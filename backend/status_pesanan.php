<?php
header('Content-Type: application/json');
include 'db.php';

$nama = $_GET['nama'];
$nowa = $_GET['nowa'];

$query = "SELECT * FROM pesanan WHERE nama = '$nama' AND nowa = '$nowa'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
  $pesanan = mysqli_fetch_assoc($result);
  echo json_encode([
    'success' => true,
    'nama' => $pesanan['nama'],
    'nowa' => $pesanan['nowa'],
    'produk' => $pesanan['produk'],
    'jumlah' => $pesanan['jumlah'],
    'total' => $pesanan['total'],
    'status' => $pesanan['status']
  ]);
} else {
  echo json_encode(['success' => false]);
}
