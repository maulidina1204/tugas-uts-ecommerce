// admin.js : login handling, session guard, orders handling (localStorage)
// Hardcoded admin accounts:
const ADMINS = [
  { user: "admin1", email: "admin1@gmail.com", pass: "admin1" },
  { user: "admin2", email: "admin2@gmail.com", pass: "admin2" },
  { user: "admin3", email: "admin3@gmail.com", pass: "admin3" },
];

// --- LOGIN (used on login_admin.html) ---
function handleAdminLogin(evt) {
  evt.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const found = ADMINS.find(
    (a) => a.user === username && a.email === email && a.pass === password
  );
  if (!found) {
    alert("Login gagal — cek username / email / password.");
    return;
  }
  // store session in sessionStorage
  sessionStorage.setItem(
    "adminUser",
    JSON.stringify({ user: found.user, email: found.email })
  );
  window.location.href = "dashboard.html";
}

// --- GUARD: protect admin-only pages ---
function requireAdmin() {
  const admin = sessionStorage.getItem("adminUser");
  if (!admin) {
    // not logged in
    window.location.href = "login_admin.html";
    return null;
  }
  return JSON.parse(admin);
}

// --- LOGOUT ---
function adminLogout() {
  sessionStorage.removeItem("adminUser");
  window.location.href = "login_admin.html";
}

// --- ORDERS helpers (stored in localStorage, key 'orders') ---
// Order object example:
// { fullname, whatsapp, address, note, payment, cart: [{name, price, qty}], status: "Menunggu", createdAt: timestamp }
function getOrders() {
  return JSON.parse(localStorage.getItem("orders") || "[]");
}
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

// --- Render orders in admin pesanan page ---
function renderAdminOrders() {
  const tbody = document.getElementById("orders-body");
  if (!tbody) return;
  const orders = getOrders();
  tbody.innerHTML = "";
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">Belum ada pesanan.</td></tr>`;
    return;
  }
  orders.forEach((o, i) => {
    const productsText = (o.cart || [])
      .map((p) => `${p.name} x${p.qty || 1}`)
      .join("<br>");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.fullname}</td>
      <td>${o.whatsapp}</td>
      <td>${o.address}</td>
      <td>${productsText}</td>
      <td>
        <select data-index="${i}" id="status-${i}">
          <option ${o.status === "Menunggu" ? "selected" : ""}>Menunggu</option>
          <option ${o.status === "Diproses" ? "selected" : ""}>Diproses</option>
          <option ${o.status === "Dikirim" ? "selected" : ""}>Dikirim</option>
          <option ${o.status === "Selesai" ? "selected" : ""}>Selesai</option>
          <option ${
            o.status === "Dibatalkan" ? "selected" : ""
          }>Dibatalkan</option>
        </select>
      </td>
      <td>
        <button class="btn" onclick="saveStatus(${i})">Simpan</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
function saveStatus(index) {
  const sel = document.getElementById(`status-${index}`);
  const orders = getOrders();
  orders[index].status = sel.value;
  saveOrders(orders);
  alert("Status diperbarui!");
  renderAdminOrders();
}

// --- Dashboard numbers ---
function renderDashboardCounts() {
  const productsCountEl = document.getElementById("count-products");
  const ordersCountEl = document.getElementById("count-orders");
  const reportsCountEl = document.getElementById("count-reports");
  const orders = getOrders();
  if (productsCountEl) productsCountEl.textContent = 3; // as example
  if (ordersCountEl) ordersCountEl.textContent = orders.length;
  if (reportsCountEl)
    reportsCountEl.textContent = Math.max(0, Math.floor(orders.length / 5));
}

// --- Init page specific scripts (call from pages) ---
function initLoginPage() {
  const form = document.getElementById("login-form");
  if (form) form.addEventListener("submit", handleAdminLogin);
}
function initDashboardPage() {
  const admin = requireAdmin();
  if (!admin) return;
  document.getElementById("admin-name").textContent = admin.user;
  document.getElementById("btn-logout").addEventListener("click", adminLogout);
  renderDashboardCounts();
}
function initPesananPage() {
  const admin = requireAdmin();
  if (!admin) return;
  document.getElementById("btn-logout").addEventListener("click", adminLogout);
  renderAdminOrders();
}
function initProdukPage() {
  const admin = requireAdmin();
  if (!admin) return;
  document.getElementById("btn-logout").addEventListener("click", adminLogout);
}
function initCheckoutAdminPage() {
  const admin = requireAdmin();
  if (!admin) return;
  document.getElementById("btn-logout").addEventListener("click", adminLogout);
  // show recent orders preview
  const orders = getOrders();
  const list = document.getElementById("checkout-orders");
  if (list) {
    list.innerHTML = orders.length
      ? orders
          .map(
            (o, i) =>
              `<li>${o.fullname} — ${o.payment} — <strong>${
                o.status || "Menunggu"
              }</strong></li>`
          )
          .join("")
      : "<li>Belum ada pesanan.</li>";
  }
}
