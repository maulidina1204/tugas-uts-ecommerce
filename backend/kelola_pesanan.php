<?php
include "db.php";

// Mode = ambil semua pesanan
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = mysqli_query($conn, "SELECT * FROM pesanan ORDER BY id DESC");
    $data = mysqli_fetch_all($result, MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// Mode = update status pesanan
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id     = $_POST['id'];
    $status = $_POST['status'];
    mysqli_query($conn, "UPDATE pesanan SET status='$status' WHERE id='$id'");
    echo "success";
    exit;
}
?>
