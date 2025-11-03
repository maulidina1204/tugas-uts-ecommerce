<?php
include 'db.php';

$product_id = $_GET['id'];
$query = "DELETE FROM cart WHERE product_id='$product_id'";
mysqli_query($conn, $query);

echo "Removed";
?>
