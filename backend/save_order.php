<?php
include 'db.php';

$nama = $_POST['nama'];
$alamat = $_POST['alamat'];
$wa = $_POST['wa'];
$payment = $_POST['payment'];
$cart = json_decode($_POST['cart'], true);

foreach ($cart as $item) {
  $nama_produk = $item['name'];
  $jumlah = $item['quantity'];
  $total_harga = $item['price'] * $jumlah;

  $sql = "INSERT INTO orders (nama_pembeli, alamat, wa, nama_produk, jumlah, total_harga, metode_pembayaran, status)
          VALUES ('$nama', '$alamat', '$wa', '$nama_produk', '$jumlah', '$total_harga', '$payment', 'Menunggu')";

  $conn->query($sql);
}

echo "<script>alert('Pesanan berhasil dikirim!'); window.location.href='../index.html';</script>";
?>
