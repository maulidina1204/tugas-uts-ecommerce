<?php
// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "goguma_db");

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Ambil data dari form
$nama = $_POST['nama'];
$email = $_POST['email'];
$password = $_POST['password'];

// Enkripsi password (lebih aman)
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Simpan ke database
$sql = "INSERT INTO users (nama, email, password) VALUES ('$nama', '$email', '$hashed_password')";

if ($conn->query($sql) === TRUE) {
    // Jika sukses daftar → redirect ke halaman tentang kami
    echo "<script>
            alert('Registrasi berhasil! Silakan login dulu ya 💜');
            window.location.href = '../tentang.html';
          </script>";
} else {
    echo "<script>
            alert('Terjadi kesalahan saat registrasi.');
            window.history.back();
          </script>";
}

$conn->close();
?>
