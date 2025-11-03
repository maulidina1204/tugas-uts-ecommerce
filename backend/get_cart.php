<?php
include 'db.php';

$query = "SELECT c.id, p.name, p.image, p.price, c.quantity 
          FROM cart c 
          JOIN products p ON c.product_id = p.id";

$result = mysqli_query($conn, $query);
$cart = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($cart);
?>
