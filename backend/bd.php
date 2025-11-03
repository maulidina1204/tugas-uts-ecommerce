<?php
include "bd.php";

// proses add to cart...

$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_gogumaroll";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
?>
