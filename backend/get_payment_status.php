<?php
include '../config/koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data dari form checkout
    $nama       = $_POST['nama'];
    $alamat     = $_POST['alamat'];
    $no_wa      = $_POST['no_wa'];
    $metode     = $_POST['metode_bayar'];
    $total_harga = $_POST['total_harga'];
    $status = 'Menunggu Konfirmasi';
    $tanggal = date('Y-m-d H:i:s');

    // Simpan data ke tabel orders
    $sql = "INSERT INTO orders (nama_pembeli, alamat, no_wa, metode_bayar, total_harga, status, tanggal) 
            VALUES ('$nama', '$alamat', '$no_wa', '$metode', '$total_harga', '$status', '$tanggal')";

    if ($conn->query($sql) === TRUE) {
        // Redirect WhatsApp otomatis ke admin
        $pesan = "Halo Admin Goguma Roll! Saya ingin konfirmasi pesanan saya.\n\n".
                 "🧾 *Atas Nama:* $nama\n".
                 "📍 *Alamat:* $alamat\n".
                 "📱 *No WA:* $no_wa\n".
                 "💰 *Total Harga:* Rp $total_harga\n".
                 "💳 *Metode Pembayaran:* $metode\n".
                 "📅 *Tanggal Pesan:* $tanggal\n\n".
                 "Mohon konfirmasinya ya kak 💜";
        $pesan_wa = urlencode($pesan);
        header("Location: https://wa.me/6281413304002?text=$pesan_wa");
        exit();
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
$conn->close();
?>
