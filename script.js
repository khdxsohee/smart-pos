const products = document.querySelectorAll('.product');
const cartItems = document.getElementById('cart-items');
const totalDisplay = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');

let cart = [];

products.forEach(product => {
  product.addEventListener('click', () => {
    const name = product.getAttribute('data-name');
    const price = parseFloat(product.getAttribute('data-price'));

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
  });
});

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x ${item.quantity} = Rs.${item.price * item.quantity}
      <button class="remove-btn" onclick="removeItem(${index})">X</button>
    `;
    cartItems.appendChild(li);
  });

  totalDisplay.textContent = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  alert("Thank you for your purchase!\nTotal: Rs." + totalDisplay.textContent);
  cart = [];
  updateCart();
});
