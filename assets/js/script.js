/* script.js - frontend cart (localStorage) */
const ADMIN_WA = "+6281413304002"; // nomor admin (ubah kalau perlu)

function getCart() {
  return JSON.parse(localStorage.getItem("goguma_cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("goguma_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const c = getCart().reduce((s, i) => s + i.qty, 0);
  const el =
    document.querySelector(".cart-count-span") ||
    document.getElementById("cart-count");
  if (el) {
    el.textContent = c;
  }
}

/* add product by id + meta */
function addToCart(id, name, price, image) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart(cart);
  // small toast
  alert(`${name} ditambahkan ke keranjang!`);
}

/* render products on index (if using dynamic injection) */
function renderProducts(products, targetSelector = ".products") {
  const root = document.querySelector(targetSelector);
  if (!root) return;
  root.innerHTML = "";
  products.forEach((p) => {
    const html = `
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <p class="price">Rp ${numberWithSep(p.price)}</p>
        <div class="row">
          <button class="btn" onclick="addToCart(${p.id},'${p.name}',${
      p.price
    },'${p.image}')">Masukkan Keranjang</button>
          <button class="btn secondary" onclick="buyNow(${p.id},'${p.name}',${
      p.price
    },'${p.image}')">Beli Sekarang</button>
        </div>
      </div>`;
    root.insertAdjacentHTML("beforeend", html);
  });
}

/* number format */
function numberWithSep(n) {
  return (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* buy now -> add then go checkout */
function buyNow(id, name, price, image) {
  addToCart(id, name, price, image);
  window.location.href = "checkout.html";
}

/* CART PAGE render */
function renderCartPage() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;
  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:20px;">Keranjang kosong — tambahkan produk dulu ya 💜</p>`;
    totalEl.textContent = "0";
    return;
  }
  cart.forEach((it, idx) => {
    total += it.price * it.qty;
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <img src="${it.image}" alt="${it.name}">
      <div class="info">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${it.name}</strong>
          <span>Rp ${numberWithSep(it.price)}</span>
        </div>
        <div class="qty-control">
          <button onclick="changeQty(${idx}, -1)">-</button>
          <div style="min-width:36px; text-align:center">${it.qty}</div>
          <button onclick="changeQty(${idx}, 1)">+</button>
          <button style="margin-left:12px" onclick="removeItem(${idx})" class="btn secondary">Hapus</button>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
  totalEl.textContent = numberWithSep(total);
}

/* qty control */
function changeQty(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  saveCart(cart);
  renderCartPage();
}

/* remove */
function removeItem(index) {
  const cart = getCart();
  if (!cart[index]) return;
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
}

/* checkout flow: prepare order summary and show form */
function renderCheckoutSummary() {
  const cart = getCart();
  const wrapper = document.getElementById("order-summary");
  const totalInput = document.getElementById("total_input");
  if (!wrapper) return;
  wrapper.innerHTML = "";
  let total = 0;
  cart.forEach((it) => {
    wrapper.insertAdjacentHTML(
      "beforeend",
      `<p>${it.name} x ${it.qty} — Rp ${numberWithSep(it.price * it.qty)}</p>`
    );
    total += it.price * it.qty;
  });
  totalInput.value = total;
  document.getElementById("order-total-display").textContent =
    numberWithSep(total);
}

/* submit checkout -> save to local storage order_temp and go to payment */
function submitCheckoutForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.nama.value.trim(),
    wa: form.wa.value.trim(),
    alamat: form.alamat.value.trim(),
    catatan: form.catatan.value.trim(),
    metode: form.metode.value,
    cart: getCart(),
    total: Number(form.total_input.value),
  };
  if (!data.name || !data.wa || !data.alamat) {
    alert("Isi Nama, No WA, dan Alamat dulu ya");
    return;
  }
  localStorage.setItem("goguma_order_temp", JSON.stringify(data));
  // go to payment page
  window.location.href = "payment.html";
}

/* payment page render */
function renderPaymentPage() {
  const tmp = JSON.parse(localStorage.getItem("goguma_order_temp") || "null");
  if (!tmp) {
    document.getElementById("payment-root").innerHTML =
      '<p style="text-align:center;">Tidak ada pesanan. Kembali ke toko.</p>';
    return;
  }
  const root = document.getElementById("payment-root");
  root.innerHTML = `
    <div style="text-align:center">
      <h3>Ringkasan Pesanan</h3>
      ${tmp.cart
        .map(
          (it) =>
            `<p>${it.name} x ${it.qty} — Rp ${numberWithSep(
              it.price * it.qty
            )}</p>`
        )
        .join("")}
      <p style="margin-top:8px;"><strong>Total: Rp ${numberWithSep(
        tmp.total
      )}</strong></p>
      <hr style="opacity:.12"/>
      <p><strong>Nama:</strong> ${tmp.name}</p>
      <p><strong>No WA:</strong> ${tmp.wa}</p>
      <p><strong>Alamat:</strong> ${tmp.alamat}</p>
      ${tmp.catatan ? `<p><strong>Catatan:</strong> ${tmp.catatan}</p>` : ""}
      <p><strong>Metode:</strong> ${tmp.metode}</p>
      <div class="payment-methods">
        <div class="method" onclick="selectMethod(this,'Transfer Bank')">Transfer Bank</div>
        <div class="method" onclick="selectMethod(this,'QRIS')">QRIS</div>
        <div class="method" onclick="selectMethod(this,'Tunai')">Tunai</div>
      </div>
      <div style="margin-top:16px">
        <button class="btn" onclick="confirmToWhatsApp()">Konfirmasi via WhatsApp</button>
      </div>
    </div>
  `;
}

/* choose method */
function selectMethod(el, name) {
  document
    .querySelectorAll(".method")
    .forEach((m) => m.classList.remove("active"));
  el.classList.add("active");
  // save selection in temp order object
  const tmp = JSON.parse(localStorage.getItem("goguma_order_temp") || "null");
  if (tmp) {
    tmp.metode = name;
    localStorage.setItem("goguma_order_temp", JSON.stringify(tmp));
  }
}

/* build WA message and open chat */
function confirmToWhatsApp() {
  const tmp = JSON.parse(localStorage.getItem("goguma_order_temp") || "null");
  if (!tmp) {
    alert("Tidak ada pesanan");
    return;
  }
  if (!tmp.metode) {
    alert("Pilih metode pembayaran dulu");
    return;
  }
  const lines = [];
  lines.push("Halo Admin Goguma Roll! Saya ingin konfirmasi pesanan saya:");
  lines.push("");
  lines.push(`Nama: ${tmp.name}`);
  lines.push(`No WA: ${tmp.wa}`);
  lines.push(`Alamat: ${tmp.alamat}`);
  lines.push("");
  lines.push("Pesanan:");
  tmp.cart.forEach((it) =>
    lines.push(
      `- ${it.name} x ${it.qty} = Rp ${numberWithSep(it.price * it.qty)}`
    )
  );
  lines.push("");
  lines.push(`Total: Rp ${numberWithSep(tmp.total)}`);
  lines.push(`Metode Pembayaran: ${tmp.metode}`);
  if (tmp.catatan) lines.push(`Catatan: ${tmp.catatan}`);
  lines.push("");
  lines.push("Mohon info selanjutnya ya, terima kasih 💜");
  const message = encodeURIComponent(lines.join("\n"));
  // open wa
  window.open(
    `https://wa.me/${ADMIN_WA.replace(/\+/, "")}?text=${message}`,
    "_blank"
  );
  // optionally clear cart & temp
  localStorage.removeItem("goguma_cart");
  localStorage.removeItem("goguma_order_temp");
  updateCartCount();
  // redirect to index after short delay
  setTimeout(() => (window.location.href = "index.html"), 600);
}

/* auto init on pages */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  const productsRoot = document.querySelector(".products");
  if (productsRoot) {
    // static data for frontend demo (use assets path)
    const demo = [
      {
        id: 1,
        name: "Goguma Roll Original",
        price: 20000,
        desc: "Ubi ungu asli, lembut setiap gigitan",
        image: "assets/img/original.jpg",
      },
      {
        id: 2,
        name: "Goguma Roll Choco",
        price: 23000,
        desc: "Cokelat lumer yang manis banget",
        image: "assets/img/choco.jpg",
      },
      {
        id: 3,
        name: "Goguma Roll Cheese",
        price: 25000,
        desc: "Keju meleleh nikmat",
        image: "assets/img/cheese.jpg",
      },
    ];
    // adapt path key used in renderProducts
    const adapted = demo.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      desc: p.desc,
    }));
    renderProducts(adapted);
  }
  if (window.location.pathname.endsWith("cart.html")) renderCartPage();
  if (window.location.pathname.endsWith("checkout.html")) {
    renderCheckoutSummary();
    const form = document.getElementById("checkout-form");
    if (form) form.addEventListener("submit", submitCheckoutForm);
  }
  if (window.location.pathname.endsWith("payment.html")) renderPaymentPage();
});
