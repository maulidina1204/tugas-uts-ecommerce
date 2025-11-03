<?php
include 'db.php';

$nama = $_POST['nama'];
$alamat = $_POST['alamat'];
$whatsapp = $_POST['whatsapp'];
$metode = $_POST['metode_pembayaran'];

$query = "INSERT INTO orders (customer_name, address, whatsapp, payment_method) 
          VALUES ('$nama', '$alamat', '$whatsapp', '$metode')";

if (mysqli_query($conn, $query)) {
  echo "Pesanan berhasil dikonfirmasi! Silakan cek WhatsApp kamu 🙂";
  
  // Kosongkan keranjang setelah checkout
  mysqli_query($conn, "TRUNCATE TABLE cart");
} else {
  echo "Gagal menyimpan pesanan";
}
?>
