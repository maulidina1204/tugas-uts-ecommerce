<?php
$host = "localhost";
$user = "root";   // ganti kalau pakai hosting
$pass = "";       // password XAMPP kosong, hosting biasanya ada
$db   = "ecommerce_db";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
?>
