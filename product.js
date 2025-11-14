document.addEventListener('DOMContentLoaded', () => {
const selectedID = parseInt(localStorage.getItem('selectedProductID'));

  if (selectedID === null) return;

  fetch('database.json')
    .then(res => res.json())
    .then(database => {
const item = database.find(p => p.id === selectedID);

      if (!item) {
        document.getElementById('product').innerHTML = `<p>Product not found.</p>`;
        return;
      }

      let name = item.name.english;
      let image = item.image.hires;
      let price = item.base.price;
      let calories = item.base.calories;
      let reviews = item.base.reviews || 0;

      let description = item.description || 'No description available.';
      let size = item.options.size;

      // Display product details
      showProductDetails(name, image, price, calories, description, reviews);
    });

  function showProductDetails(name, image, price, calories, description, reviews) {
    document.getElementById('product').innerHTML = `
      <div class="row mt-5 align-items-center">
        <div class="col-lg-5 col-md-12 col-12 mb-4 mb-lg-0">
          <img class="img-fluid w-100" src="${image}" alt="${name}">
        </div>

        <div class="col-lg-6 col-md-12 col-12">
          <h1 class="fw-bold mb-10">${name}</h1>

        ${[...Array(5)].map(() => `
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" 
              fill="currentColor" class="bi bi-star-fill text-warning" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 
              6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 
              0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 
              3.356.83 4.73c.078.443-.36.79-.746.592L8 
              13.187l-4.389 2.256z"/>
            </svg>
          `).join('')}
          (${reviews} Reviews)

          <div class="description mb-10 mt-10">${description}</div>
          <h2 class="text-success mb-10">₱${price}</h2>

          <label for="size" class="form-label fw-semibold">Select Size</label>
          <select id="sizeSelect-${selectedID}" class="form-select w-50 mb-4">
            <option disabled selected>Choose size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>

          <button onclick='addToCart("${name}", ${price}, "${image}", ${selectedID})' class="btn btn-dark px-4 py-2">Add to Basket</button>
        </div>
      </div>
    `;
  }
});


//add to cart function WITH VALIDATION FOR SELECTING SIZE
function addToCart(name, basePrice, image, index) {
  const sizeElement = document.getElementById(`sizeSelect-${index}`);
  const priceElement = document.getElementById(`price-${index}`);

  const selectedSize = sizeElement?.value;
  let finalPrice = basePrice;

  if (selectedSize === "Medium") finalPrice += 3;
  if (selectedSize === "Large") finalPrice += 20;

  if (selectedSize === "Choose size"){
    showAlert("Please select a size first!", "warning");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(
    (item) => item.name === name && item.size === selectedSize
  );

  if (existingItem) {
    existingItem.quantity += 1;
    showAlert(
      `${name} (${selectedSize}) already in basket. Quantity increased to ${existingItem.quantity}.`,
      "warning"
    );
  } else {
    cart.push({ name, price: finalPrice, image, size: selectedSize, quantity: 1 });
    showAlert(`${name} (${selectedSize}) added to your cart!`, "success");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function showAlert(message, type = 'success') {
  let alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '9999';
    document.body.appendChild(alertContainer);
  }

  const alert = document.createElement('div');
  alert.className = `custom-alert alert-${type}`;
  alert.innerHTML = `<strong>${message}</strong>`;
  alertContainer.appendChild(alert);

  requestAnimationFrame(() => alert.classList.add('show'));

  setTimeout(() => {
    alert.classList.remove('show');
    alert.classList.add('hide');
    setTimeout(() => alert.remove(), 600); 
  }, 2000);
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.querySelector('.add');
  if (badge) {
    badge.textContent = totalQuantity;
    badge.classList.add('pop');
    setTimeout(() => badge.classList.remove('pop'), 300);
  }
}





