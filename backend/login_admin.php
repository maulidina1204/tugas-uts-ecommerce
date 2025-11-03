<?php
// backend/login_admin.php
session_start();

// Pastikan request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../login_admin.html');
    exit;
}

// Ambil data dari form
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Daftar admin hardcoded (bisa diganti ke DB nanti)
$admins = [
    // username => [email, passwordPlain]
    'admin1' => ['email' => 'admin1@gmail.com', 'password' => 'admin1'],
    'admin2' => ['email' => 'admin2@gmail.com', 'password' => 'admin2'],
    'admin3' => ['email' => 'admin3@gmail.com', 'password' => 'admin3'],
];

// Cari berdasarkan username atau email
$found = null;
foreach ($admins as $user => $info) {
    if ($username === $user || strtolower($username) === strtolower($info['email'])) {
        $found = ['user' => $user, 'email' => $info['email'], 'password' => $info['password']];
        break;
    }
}

if (!$found) {
    // tidak ditemukan
    $_SESSION['login_error'] = "Akun tidak ditemukan. Gunakan username atau email admin.";
    header('Location: ../login_admin.html');
    exit;
}

// cek password (karena ini contoh sederhana, kita pakai plain compare)
if ($password === $found['password']) {
    // berhasil login -> simpan session dan redirect ke dashboard
    $_SESSION['admin'] = [
        'username' => $found['user'],
        'email' => $found['email'],
        'logged_at' => time()
    ];

    // pindah ke dashboard admin (sesuaikan path bila beda)
    header('Location: ../dashboard.html');
    exit;
} else {
    $_SESSION['login_error'] = "Password salah.";
    header('Location: ../login_admin.html');
    exit;
}
