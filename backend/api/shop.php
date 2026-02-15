        <?php 
        error_reporting(E_ALL);
        ini_set('display_errors', 0);
        ini_set('log_errors', 1);
        ini_set('error_log', __DIR__ . '/error.log');

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
            header("Access-Control-Allow-Origin: " . $origin);
        }
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
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
                    $gifts = $controller->listGifts();
                    echo json_encode($gifts);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'list_vendor_gifts':
                if($method === 'GET'){
                    $gifts = $controller->listVendorGifts();
                    echo json_encode($gifts);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'get_gift':
                if($method === 'GET' && $id){
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
                    $result = $controller->addGift();
                    if($result['status'] === 'success') http_response_code(201);
                    else http_response_code(400);
                    echo json_encode($result);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'delete_gift':
                if($method === 'DELETE' && $id){
                    $result = $controller->deleteGift($id);
                    echo json_encode($result);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'update_gift':
                if($method === 'PUT' && $id){
                    $result = $controller->updateGift($id);
                    echo json_encode($result);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'get_orders':
                if($method === 'GET'){
                    echo json_encode(['status' => 'success', 'data' => []]);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'get_order':
                if($method === 'GET' && $id){
                    echo json_encode(['status' => 'success', 'data' => []]);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'get_customers':
                if($method === 'GET'){
                    echo json_encode(['status' => 'success', 'data' => []]);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'get_analytics':
                if($method === 'GET'){
                    echo json_encode([
                        'status' => 'success', 
                        'data' => [
                            'totalRevenue' => '0.00',
                            'revenueChange' => '0',
                            'totalOrders' => '0',
                            'ordersChange' => '0',
                            'avgOrderValue' => '0.00',
                            'conversionRate' => '0'
                        ]
                    ]);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'get_shop_settings':
                if($method === 'GET'){
                    echo json_encode(['status' => 'success', 'data' => []]);
                } else {
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                }
                break;

            case 'update_shop_settings':
                if($method === 'POST'){
                    echo json_encode(['status' => 'success', 'message' => 'Settings updated']);
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
