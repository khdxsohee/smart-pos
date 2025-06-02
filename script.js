// Initial products with stock quantity
let products = [
  { id: 1, name: 'Apple', price: 50, stock: 10 },
  { id: 2, name: 'Banana', price: 20, stock: 15 },
  { id: 3, name: 'Milk', price: 80, stock: 8 },
];

let cart = [];

// DOM elements
const productListEl = document.getElementById('product-list');
const cartItemsEl = document.getElementById('cart-items');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');
const printInvoiceBtn = document.getElementById('print-invoice');
const addProductForm = document.getElementById('add-product-form');
const searchInput = document.getElementById('search');

// Render inventory products with stock
function renderProducts(filter = '') {
  productListEl.innerHTML = '';

  let filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    productListEl.innerHTML = '<p>No products found.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-item');

    // Show stock quantity with product
    productDiv.innerHTML = `
      <strong>${product.name}</strong><br>
      Rs. ${product.price}<br>
      Stock: ${product.stock}<br>
      <button data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>Add to Cart</button>
    `;
    productListEl.appendChild(productDiv);
  });
}

// Render cart items with quantity
function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<li>Cart is empty.</li>';
    totalEl.textContent = '0';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    const li = document.createElement('li');
    li.innerHTML = `
      ${product.name} x ${item.quantity} = Rs. ${product.price * item.quantity}
      <button class="remove-btn" data-id="${product.id}">Remove</button>
      <button class="increase-btn" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>+</button>
      <button class="decrease-btn" data-id="${product.id}">-</button>
    `;
    cartItemsEl.appendChild(li);
    total += product.price * item.quantity;
  });

  totalEl.textContent = total;
}

// Add product to cart with stock check
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    alert('Product not found!');
    return;
  }

  if (product.stock <= 0) {
    alert('Sorry, product is out of stock.');
    return;
  }

  const cartItem = cart.find(item => item.productId === productId);

  if (cartItem) {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity++;
      product.stock--; // decrease stock
    } else {
      alert('No more stock available for this product.');
      return;
    }
  } else {
    cart.push({ productId, quantity: 1 });
    product.stock--; // decrease stock
  }
  renderProducts(searchInput.value);
  renderCart();
}

// Remove product from cart and restore stock
function removeFromCart(productId) {
  const cartItem = cart.find(item => item.productId === productId);
  if (!cartItem) return;

  const product = products.find(p => p.id === productId);

  product.stock += cartItem.quantity; // restore stock

  cart = cart.filter(item => item.productId !== productId);
  renderProducts(searchInput.value);
  renderCart();
}

// Increase quantity in cart with stock check
function increaseQuantity(productId) {
  const cartItem = cart.find(item => item.productId === productId);
  const product = products.find(p => p.id === productId);

  if (product.stock <= 0) {
    alert('No more stock available.');
    return;
  }

  if (cartItem) {
    cartItem.quantity++;
    product.stock--;
    renderProducts(searchInput.value);
    renderCart();
  }
}

// Decrease quantity in cart and restore stock
function decreaseQuantity(productId) {
  const cartItem = cart.find(item => item.productId === productId);
  const product = products.find(p => p.id === productId);

  if (!cartItem) return;

  cartItem.quantity--;
  product.stock++;

  if (cartItem.quantity <= 0) {
    cart = cart.filter(item => item.productId !== productId);
  }
  renderProducts(searchInput.value);
  renderCart();
}

// Checkout - just clear cart (you can enhance to reduce stock here if you want)
function checkout() {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }

  alert('Checkout successful!');
  cart = [];
  renderCart();
  renderProducts(searchInput.value);
}

// Add new product to inventory with stock
addProductForm.addEventListener('submit', e => {
  e.preventDefault();

  const nameInput = document.getElementById('new-product-name');
  const priceInput = document.getElementById('new-product-price');
  const stockInput = document.getElementById('new-product-stock');

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const stock = parseInt(stockInput.value);

  if (!name || isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
    alert('Please enter valid product details.');
    return;
  }

  // Generate unique id
  const newId = products.length ? products[products.length - 1].id + 1 : 1;

  products.push({ id: newId, name, price, stock });

  nameInput.value = '';
  priceInput.value = '';
  stockInput.value = '';

  renderProducts(searchInput.value);
});

// Search functionality
searchInput.addEventListener('input', () => {
  renderProducts(searchInput.value);
});

// Event delegation for buttons inside product list and cart
productListEl.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const id = parseInt(e.target.getAttribute('data-id'));
    addToCart(id);
  }
});

cartItemsEl.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const id = parseInt(e.target.getAttribute('data-id'));
    if (e.target.classList.contains('remove-btn')) {
      removeFromCart(id);
    } else if (e.target.classList.contains('increase-btn')) {
      increaseQuantity(id);
    } else if (e.target.classList.contains('decrease-btn')) {
      decreaseQuantity(id);
    }
  }
});

checkoutBtn.addEventListener('click', checkout);

printInvoiceBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }

  let invoiceWindow = window.open('', '', 'width=700,height=700');
  let invoiceHTML = `
    <html>
    <head>
      <title>Invoice</title>
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h2>Invoice</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price (Rs.)</th>
            <th>Quantity</th>
            <th>Total (Rs.)</th>
          </tr>
        </thead>
        <tbody>
  `;

  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    invoiceHTML += `
      <tr>
        <td>${product.name}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>${lineTotal.toFixed(2)}</td>
      </tr>
    `;
  });

  invoiceHTML += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
            <td><strong>Rs. ${total.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <script>
        window.onload = function() {
          window.print();
          // Optional: close the window after printing
          // window.close();
        }
      </script>
    </body>
    </html>
  `;

  invoiceWindow.document.write(invoiceHTML);
  invoiceWindow.document.close();
  invoiceWindow.focus();
});

  
// Initial render
renderProducts();
renderCart();
