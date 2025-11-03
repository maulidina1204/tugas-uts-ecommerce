<?php
include "db.php";

$result = mysqli_query($conn, "SELECT * FROM pesanan ORDER BY id DESC");
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($data);
