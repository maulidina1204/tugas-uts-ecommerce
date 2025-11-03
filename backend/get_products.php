<?php
include "bd.php";

$query = mysqli_query($conn, "SELECT * FROM products");
$products = [];

while ($row = mysqli_fetch_assoc($query)) {
    $products[] = $row;
}

echo json_encode($products);
?>
