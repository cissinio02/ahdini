<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../controllers/GiftController.php';

$database = new Database();
$db = $database->getConnection();
$Controller = new GiftController($db);

$action = $_GET['action'] ? '';

//aymen use switch or if to handdle get_gift or add_gift