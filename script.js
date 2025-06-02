
// Elements
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');
const cartItems = document.getElementById('cart-items');
const totalDisplay = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');
const printInvoiceBtn = document.getElementById('print-invoice');
const addProductForm = document.getElementById('add-product-form');
const newProductName = document.getElementById('new-product-name');
const newProductPrice = document.getElementById('new-product-price');

// Data storage keys
const STORAGE_PRODUCTS_KEY = 'pos_products';
const STORAGE_CART_KEY = 'pos_cart';

// Default products (if none in local storage)
const defaultProducts = [
  { name: 'Milk', price: 120 },
  { name: 'Bread', price: 80 },
  { name: 'Eggs', price: 150 },
  { name: 'Butter', price: 200 },
];

// Load products from localStorage or default
let products = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY)) || defaultProducts;

// Load cart from localStorage or empty
let cart = JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];

// Render products based on array (and optional filter)
function renderProducts(filter = '') {
  productList.innerHTML = '';
  let filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    productList.innerHTML = '<p>No products found.</p>';
    return;
  }

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.textContent = `${product.name} - Rs.${product.price}`;
    div.onclick = () => addToCart(product.name);
    productList.appendChild(div);
  });
}

// Add product to cart or increment quantity
function addToCart(productName) {
  const product = products.find(p => p.name === productName);
  if (!product) return;

  const cartItem = cart.find(item => item.name === productName);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ name: product.name, price: product.price, quantity: 1 });
  }
  saveCart();
  renderCart();
}

// Render cart items and total
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;

  if(cart.length === 0){
    cartItems.innerHTML = '<li>Cart is empty.</li>';
    totalDisplay.textContent = '0';
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x ${item.quantity} = Rs.${item.price * item.quantity}
      <button class="remove-btn" onclick="removeFromCart(${index})">X</button>
    `;
    cartItems.appendChild(li);
  });

  totalDisplay.textContent = total;
}

// Remove item from cart by index
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
}

// Save products to localStorage
function saveProducts() {
  localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
}

// Handle product search input
searchInput.addEventListener('input', () => {
  renderProducts(searchInput.value);
});

// Handle checkout click
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  alert(`Thank you for your purchase!\nTotal: Rs.${totalDisplay.textContent}`);
  cart = [];
  saveCart();
  renderCart();
});

// Handle print invoice click
printInvoiceBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  printInvoice();
});

// Print invoice function
function printInvoice() {
  let invoiceWindow = window.open('', '', 'width=600,height=700');
  let total = 0;
  let html = `<h1>Invoice</h1><table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">
  <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>`;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `<tr>
      <td>${item.name}</td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:right;">Rs.${item.price}</td>
      <td style="text-align:right;">Rs.${itemTotal}</td>
    </tr>`;
  });

  html += `<tr>
    <td colspan="3" style="text-align:right;"><strong>Grand Total</strong></td>
    <td style="text-align:right;"><strong>Rs.${total}</strong></td>
  </tr></table>`;

  html += `<p>Thank you for shopping with us!</p>`;

  invoiceWindow.document.write(html);
  invoiceWindow.document.close();
  invoiceWindow.focus();
  invoiceWindow.print();
  invoiceWindow.close();
}

// Handle new product add form submit
addProductForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = newProductName.value.trim();
  const price = parseFloat(newProductPrice.value);

  if (!name || isNaN(price) || price <= 0) {
    alert('Please enter valid product name and price');
    return;
  }

  // Check if product already exists
  if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    alert('Product already exists');
    return;
  }

  products.push({ name, price });
  saveProducts();
  renderProducts(searchInput.value);
  newProductName.value = '';
  newProductPrice.value = '';
});

// Initial render
renderProducts();
renderCart();

// Expose removeFromCart to global scope for button onclick
window.removeFromCart = removeFromCart;
