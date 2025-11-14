document.addEventListener('DOMContentLoaded', () => { 
  const cartContainer = document.getElementById('Addcart');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<h2 class="text-center mt-5">Your basket is empty 🛒</h2>`;
      return;
    }

    const total = cart.reduce((t, i) => t + (i.price * (i.quantity || 1)), 0);

    cartContainer.innerHTML = `
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12">
            <div class="card card-registration card-registration-2" style="border-radius: 15px; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
              <div class="card-body p-0">
                <div class="row g-0">
                  <div class="col-lg-8">
                    <div class="p-5">
                      <div class="d-flex justify-content-between align-items-center mb-5">
                        <h1 class="fw-bold mb-0">My Basket</h1>
                        <h6 class="mb-0 text-muted">${cart.length} item(s)</h6>
                      </div>
                      <hr class="my-4">

                      ${cart.map((item, index) => `
                        <div class="row mb-4 d-flex justify-content-between align-items-center">
                          <div class="col-md-2 col-lg-2 col-xl-2">
                            <img src="${item.image}" class="img-fluid rounded-3" alt="${item.name}">
                          </div>

                          <div class="col-md-3 col-lg-3 col-xl-3">
                            <h6 class="mb-0">${item.name}</h6>
                          </div>

                          <div class="col-md-3 col-lg-2 col-xl-2 d-flex align-items-center">
                            <button class="btn btn-outline-secondary btn-sm decrease-qty" data-index="${index}">−</button>
                            <input type="text" class="form-control form-control-sm text-center mx-2" style="width: 50px;" value="${item.quantity || 1}" readonly>
                            <button class="btn btn-outline-secondary btn-sm increase-qty" data-index="${index}">+</button>
                          </div>

                          <div class="col-md-2 col-lg-2 col-xl-2 offset-lg-1">
                            <h6 class="mb-0">₱${item.price * (item.quantity || 1)}</h6>
                          </div>

                          <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                            <button class="btn btn-outline-danger btn-sm delete-btn" data-index="${index}">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      `).join('')}

                      <hr class="my-4">

                      <div class="pt-5">
                        <h6 class="mb-0">
                          <a href="designUI.html" class="text-body">
                            <i class="fas fa-long-arrow-alt-left me-2"></i>Back to shop
                          </a>
                        </h6>
                      </div>
                    </div>
                  </div>

                <div class="col-lg-4 bg-body-tertiary">
  <div class="p-5">
    <h3 class="fw-bold mb-5 mt-2 pt-1">Summary</h3>
    <hr class="my-4">

    ${cart.map(item => `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h6 class="mb-0">${item.name}</h6>
          <small class="text-muted">${item.size}</small>
        </div>
        <span>₱${item.price * (item.quantity || 1)}</span>
      </div>
    `).join('')}

    <hr class="my-4">

    <div class="d-flex justify-content-between mb-4">
      <h5 class="text-uppercase fw-bold">Total</h5>
      <h5 class="fw-bold">₱${total}</h5>
    </div>

    <button type="button" class="btn btn-dark btn-block btn-lg w-100"
    onclick="window.location.href='checkout.html'"
    >Checkout</button>
  </div>
</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;


      //FOR DELETE BUTTON
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', e => {
        const index = e.target.closest('button').dataset.index;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        showAlert('Item removed from cart.', 'warning');
        renderCart();
      });
    });

    // ➕ FOR ADD quantity
    document.querySelectorAll('.increase-qty').forEach(button => {
      button.addEventListener('click', e => {
        const index = e.target.dataset.index;
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });

    //REMOVE
    document.querySelectorAll('.decrease-qty').forEach(button => {
      button.addEventListener('click', e => {
        const index = e.target.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1); 
          showAlert('Item removed from cart.', 'warning');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});

//SHOW SUCCESS ALERT
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
  alert.className = `alert alert-${type} alert-dismissible fade show shadow`;
  alert.role = 'alert';
  alert.innerHTML = `<strong>${message}</strong>`;
  alertContainer.appendChild(alert);

  //FOR ANIMATION BREATHING CARDS
  setTimeout(() => {
    alert.classList.remove('show');
    alert.classList.add('fade');
    setTimeout(() => alert.remove(), 500);
  }, 2000);
}
