<?php
include 'db.php';

$product_id = $_GET['id'];

$query = "SELECT * FROM cart WHERE product_id='$product_id'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
  $query = "UPDATE cart SET quantity = quantity + 1 WHERE product_id='$product_id'";
} else {
  $query = "INSERT INTO cart (product_id, quantity) VALUES ('$product_id', 1)";
}
mysqli_query($conn, $query);

echo "Success";
?>
