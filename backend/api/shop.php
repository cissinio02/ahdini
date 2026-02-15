        <?php 
        error_reporting(E_ALL);
        ini_set('display_errors', 0);

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/GiftController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new GiftController($db);

// Get the request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

        // Route handling
        switch($action){
            case 'get_gifts':
                if($method === 'GET'){
                    $controller->listGifts();
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'get_gift':
                if($method === 'GET' && $id){
                    // Get single gift by ID
                    $gift = new Gift($db);
                    $result = $gift->Read($id);
                    if($result){
                        echo json_encode([
                            'status' => 'success',
                            'data' => $result
                        ]);
                    } else {
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'Gift not found']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
                }
                break;

            case 'add_gift':
                if($method === 'POST'){
                    $controller->addGift();
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'delete_gift':
                if($method === 'DELETE' && $id){
                    $controller->deleteGift($id);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'update_gift':
                if($method === 'PUT' && $id){
                    $controller->updateGift($id);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

    default:
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}
?>