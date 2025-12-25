<?php
// CORS: allowlist specific localhost dev origins
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

// simple request log for debugging
@file_put_contents(__DIR__ . '/../log.txt', json_encode([
    'time' => date('Y-m-d H:i:s'),
    'endpoint' => 'forgot.php',
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? '',
    'method' => $_SERVER['REQUEST_METHOD'] ?? '',
    'raw' => $raw,
]) . PHP_EOL, FILE_APPEND);

if (empty($input['email'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email is required',
        'errors' => ['email' => 'Email is required']
    ]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$userModel = new User($db);
$user = $userModel->getUserByEmail($input['email']);

if (!$user) {
    // For privacy, you may want to respond with success even if user not found.
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email not found',
        'errors' => ['email' => 'No account found with that email']
    ]);
    exit();
}

// Generate a reset token and persist it
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry

try {
    $stmt = $db->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
    $stmt->execute([$input['email'], $token, $expiresAt]);
} catch (Exception $e) {
    @file_put_contents(__DIR__ . '/../log.txt', "Failed to persist token: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
}

// Attempt to send email using PHPMailer if available
$mailSent = false;
try {
    $mailConfig = require __DIR__ . '/../config/mail.php';
    if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
        require __DIR__ . '/../vendor/autoload.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $mailConfig['smtp_host'];
            $mail->SMTPAuth = true;
            $mail->Username = $mailConfig['smtp_user'];
            $mail->Password = $mailConfig['smtp_pass'];
            $mail->SMTPSecure = ($mailConfig['smtp_secure'] === 'ssl') ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $mailConfig['smtp_port'];

            $mail->setFrom($mailConfig['from_email'], $mailConfig['from_name']);
            $mail->addAddress($input['email']);

            $resetUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . '/reset-password.php?token=' . $token;

            $mail->isHTML(true);
            $mail->Subject = 'Reset your Ahdini password';
            $mail->Body = "<p>Click the link to reset your password:</p><p><a href=\"{$resetUrl}\">Reset password</a></p>";
            $mail->AltBody = "Reset link: {$resetUrl}";

            $mail->send();
            $mailSent = true;
            @file_put_contents(__DIR__ . '/../log.txt', json_encode(['time' => date('Y-m-d H:i:s'), 'sent' => $input['email']]) . PHP_EOL, FILE_APPEND);
        } catch (Exception $e) {
            @file_put_contents(__DIR__ . '/../log.txt', "PHPMailer error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        }
    } else {
        @file_put_contents(__DIR__ . '/../log.txt', "PHPMailer not installed; token: {$token}\n", FILE_APPEND);
    }
} catch (Throwable $ex) {
    @file_put_contents(__DIR__ . '/../log.txt', "Mail send exception: " . $ex->getMessage() . PHP_EOL, FILE_APPEND);
}

// Respond success (do not reveal whether an account exists)
echo json_encode([
    'status' => 'success',
    'message' => 'If an account exists for this email, reset instructions have been sent.'
]);
exit();