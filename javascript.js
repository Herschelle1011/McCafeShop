document.addEventListener('DOMContentLoaded', () => {
  const listproducts = document.querySelector('#cards');
  let allProducts = [];




  const mcCafeBg = document.createElement('div');
  mcCafeBg.classList.add('mcCafe');
  mcCafeBg.textContent = 'McCafé';
  document.body.appendChild(mcCafeBg);

  fetch('database.json')
    .then(res => res.json())
    .then(database => {
      allProducts = database;
      displayProducts(allProducts);
    });

  function displayProducts(products) {
    listproducts.style.opacity = '0';
    listproducts.style.transform = 'translateY(30px)';
    setTimeout(() => {
      listproducts.innerHTML = '';

      products.forEach((item) => {
        const name = item.name.english.replace(/"/g, '&quot;');
        const image = item.image.hires;
        const price = item.base.price;
        const calories = item.base.calories;
        const availability = item.base.availability;
        const id = item.id;

        const size = item.options.size;

        


        listproducts.innerHTML += `
          <div class="cards" style="width: 18rem;"> 
                    <div class="cards-container" ondblclick="openProduct(${id})">
              <img src="${image}" class="cards-img-top" alt="${name}">
              <div class="cards-body">
                <h2 class="cards-title">${name}</h2>
                <div class="dropdown-row">
                  <h5>Size</h5>
                  <div class="dropdown">
            <a href="javascript:void(0)" class="dropbtn" id="sizeSelect-${id}">Select a size</a>
<div class="dropdown-content">
                 <a href="javascript:void(0)" onclick="updateSizeText('Small', ${id}, ${price})">Small</a>
              <a href="javascript:void(0)" onclick="updateSizeText('Medium', ${id}, ${price})">Medium</a>
              <a href="javascript:void(0)" onclick="updateSizeText('Large', ${id}, ${price})">Large</a>
</div>

                  </div>
                </div>
                <div class="dropdown-row">
                  <h5>Price</h5>
                  <div class="dropdown">
              <a href="#" class="dropbtn pbtn" id="price-${id}">₱${price}</a>
                  </div>
                </div>
                <div class="dropdown-row">
                  <h5>Calories</h5>
                  <div class="dropdown">
                    <a href="#" class="dropbtn cbtn">${calories}</a>
                  </div>
                </div>
         <button id="btn-${id}" class="btncart" onclick='addToCart("${name}", ${price}, "${image}", ${id})'>
                                <a class="btn btn-primaryy">ADD TO BASKET</a>
                            </button>
              </div>
            </div>
          </div>
        `;
    
       const btn = document.getElementById(`#btn-${id}`);
            if (availability === "out-of-stock") {
                btn.textContent = "Unavailable";
                btn.disabled = true;
                btn.style.opacity = "0.5";
               }
               else{

               }
     
  
    
}

  );
      
  

      setTimeout(() => {
        listproducts.style.opacity = '1';
        listproducts.style.transform = 'translateY(0)';
      }, 100);
    }, 200);
  }







  function changeBackgroundText(text) {
    mcCafeBg.style.opacity = "0";
    setTimeout(() => {
      mcCafeBg.textContent = text;
      mcCafeBg.style.opacity = "0.03";
    }, 300);
  }

window.updateSizeText = function(size, index, basePrice) {
    event.preventDefault();
  const sizeElement = document.getElementById(`sizeSelect-${index}`);
  const priceElement = document.getElementById(`price-${index}`);

  if (!sizeElement || !priceElement) {
    console.warn(`No elements found for index ${index}`);
    return;
  }

  sizeElement.textContent = size;

  let newPrice = basePrice;
  if (size === 'Medium') newPrice += 10;
  if (size === 'Large') newPrice += 20;

  priceElement.textContent = `₱${newPrice}`;

    sizeElement.dataset.selectedSize = size;
  sizeElement.dataset.updatedPrice = newPrice;
};


const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", () => {

    const searchText = searchBar.value.toLowerCase();
    const filtered = allProducts.filter(product =>
        product.name.english.toLowerCase().includes(searchText));
       if(filtered.length === 0){
      changeBackgroundText(searchText ? "NotFound" : "McCafé");
      displayProducts(!filtered);
    }
    else{
    displayProducts(filtered);
    changeBackgroundText(searchText ? "Searching." : "McCafé");
    }

});



  // Category buttons
  document.getElementById('showAll')?.addEventListener('click', e => {
    e.preventDefault();
    displayProducts(allProducts);
    changeBackgroundText('McCafé'); //for background text
  });

  document.getElementById('showIced')?.addEventListener('click', e => {
    e.preventDefault();
    const iced = allProducts.filter(p => p.options.drink_type.includes('Iced'));
    displayProducts(iced);
    changeBackgroundText('IcedCafé');
  });

  document.getElementById('showHot')?.addEventListener('click', e => {
    e.preventDefault();
    const hot = allProducts.filter(p => p.options.drink_type.includes('Hot'));
    displayProducts(hot);
    changeBackgroundText('HotCafé');
  });

  document.getElementById('showFrappe')?.addEventListener('click', e => {
    e.preventDefault();
    const frappe = allProducts.filter(p => p.options.drink_type.includes('Frappe'));
    displayProducts(frappe);
    changeBackgroundText('FrappeCafé');
  });
});


//add to cart function WITH VALIDATION FOR SELECTING SIZE
function addToCart(name, basePrice, image, index) {
  const sizeElement = document.getElementById(`sizeSelect-${index}`);
  const priceElement = document.getElementById(`price-${index}`);

  const element = document.getElementById("number");
        element.style.opacity = "100%"; 

  const selectedSize = sizeElement.textContent;
  let finalPrice = basePrice;

  if (selectedSize === "Medium") finalPrice += 3;
  if (selectedSize === "Large") finalPrice += 20;

  if (selectedSize === "Select a size") {
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


//function update cart
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

//double click card
function openProduct(id) {
   localStorage.setItem('selectedProductID', id);
  window.location.href = 'product.html';


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

window.onload = function() {
    document.getElementById('loadingScreen').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';

    var iv = setInterval(function () {
        var obj = document.all ? document.all["theObject"] : document.getElementById("theObject");

        if (obj && obj.readyState === 4) {
            clearInterval(iv);
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
        }
    }, 100);

    setTimeout(() => {
        clearInterval(iv);
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }, 3000); //after 3 seconds
};


window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');

  if (window.scrollY > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});



window.addEventListener("load", () => {
  const sections = document.querySelectorAll(".checkout-item");
const nextButtons = document.querySelectorAll(".next-btn");

  
  if (sections.length === 0) return;

  sections.forEach(section => section.classList.remove("active"));

  const firstSection = document.getElementById("billing-section");
  if (firstSection) firstSection.classList.add("active");


          //NEXT BUTTON IF TEXTBOX IS empty VALIDATION
  nextButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      let isValid = true;

      //text ERRORS popup
let nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const addressError = document.getElementById('address-error');
const cityError = document.getElementById('city-error');
const zipCodeError = document.getElementById('zipCode-error');
 const bordername = document.getElementById('billing-name');
          //for BORDERS style
            const borderEmail = document.getElementById('billing-email-address');
            const borderPhone = document.getElementById('billing-phone');
            const borderAddress = document.getElementById('billing-address');
            const borderCity = document.getElementById('billing-city');
            const borderZipCode = document.getElementById('zip-code');
        //for INPUT values
  let InputEmail = document.getElementById('billing-email-address').value;
  let InputPhone = document.getElementById('billing-phone').value;
    let InputAddress = document.getElementById('billing-address').value;
  let InputCity = document.getElementById('billing-city').value;
  let InputZipCode = document.getElementById('zip-code').value;
  let InputName = document.getElementById('billing-name').value;


          //Name VALIDATION
      if(InputName.trim() === '' ){
              nameError.innerHTML = 'Name is required';
        bordername.style.border = "1px solid red";
        e.preventDefault();
        isValid = false; return;
  } 
  else
{
          nameError.innerHTML = '';
            bordername.style.border = "1px solid green";
        isValid = true;
  }


          //EMAIL VALIDATION
    if(InputEmail.trim() === '' ){
        emailError.innerHTML = 'Email is required';
        borderEmail.style.border = "1px solid red";
        e.preventDefault();
        isValid = false; return;
  } 
  else
        {
            emailError.innerHTML = '';
            borderEmail.style.border = "1px solid green";
        isValid = true;
  }
          //PHONE VALIDATION
      if(InputPhone.trim() === '' ){
        phoneError.innerHTML = 'Phone is required';
        borderPhone.style.border = "1px solid red";
        e.preventDefault();
        isValid = false; return;
  } 
  else
{
             phoneError.innerHTML = '';
            borderPhone.style.border = "1px solid green";
        isValid = true;
  }
  //ADDRESS VALIDATION
      if(InputAddress.trim() === '' ){
        addressError.innerHTML = 'Address is required';
        borderAddress.style.border = "1px solid red";
        e.preventDefault();
        isValid = false; return;
  } 
  else
{
           addressError.innerHTML = '';
            borderAddress.style.border = "1px solid green";
        isValid = true;
  }

        //CITY VALIDATION
        if(InputCity.trim() === '' ){
   cityError.innerHTML = 'City is required';
        borderCity.style.border = "1px solid red";
        e.preventDefault();
        isValid = false; return;
  } 
  else
{
           cityError.innerHTML = '';
            borderCity.style.border = "1px solid green";
            isValid = true;
  }

      // ZIPCODE VALIDATION

              if(InputZipCode.trim() === '' ){
      zipCodeError.innerHTML = 'ZipCode is required';
        borderZipCode.style.border = "1px solid red";
        e.preventDefault();
        isValid = false; return;
  } 
  else
{
      zipCodeError.innerHTML = '';
            borderZipCode.style.border = "1px solid green";
            isValid = true;
  }



      const currentSection = btn.closest(".checkout-item");
      const nextSectionId = btn.getAttribute("data-next");
      const nextSection = document.getElementById(nextSectionId);
      const edit = document.getElementById("btn-edit")

  let name = document.getElementById("billing-name");
    let email = document.getElementById("billing-email-address");
  let phone = document.getElementById("billing-phone");
  let address = document.getElementById("billing-address");
  let city = document.getElementById("billing-city");
  let zipCode = document.getElementById("zip-code");


      const shipName = document.getElementById("ship-Name");
      const shipAddress = document.getElementById("ship-address");
      const shipNumber = document.getElementById("ship-no");
      

      shipName.innerText = name.value;
      shipAddress.innerText = address.value;
      shipNumber.innerText = phone.value;



      if (!nextSection) {
        console.error(`Section with id="${nextSectionId}" not found!`);
        return;
      }

      currentSection.classList.remove("active");
      nextSection.classList.add("active");
       edit.classList.remove("active");
      nextSection.scrollIntoView({ behavior: "smooth" });
    });
  
  });
});













// for SHOWING ALL COUNTRIES

 const countries = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
      "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
      "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
      "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
      "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
      "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
      "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
      "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
      "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
      "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
      "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
      "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
      "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
      "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
      "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
      "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
      "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine",
      "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
      "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
      "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
      "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
      "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
      "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
      "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
      "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
      "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    const select = document.querySelector("#country");

    countries.forEach(country => {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      select.appendChild(option);
    });


    //FOR Checkout SUMMARY section


let cart = JSON.parse(localStorage.getItem('cart')) || [ //GET DETAILS FROM THE LOCAL STORAGE CART TO SHOW
  {
    name: "Waterproof Mobile Phone",
    image: "https://www.bootdey.com/image/280x280/FF00FF/000000",
    price: 260,
    quantity: 2,
    size: "Large"
  },
  {
    name: "Smartphone Dual Camera",
    image: "https://www.bootdey.com/image/280x280/FF00FF/000000",
    price: 260,
    quantity: 1,
    size: "Medium"
  }
];

// for CHECKOUT body
let checkoutBody = document.querySelector("#checkoutBody"); // tbody element

checkoutBody.innerHTML = ""; 

cart.forEach((item, index) => {
  const total = item.price * item.quantity;

  checkoutBody.innerHTML += `
    <tr>
      <th scope="row">
        <img src="${item.image}" alt="product-img" title="${item.name}" class="avatar-lg rounded">
      </th>
      <td>
        <h5 class="font-size-16 text-truncate">
          <a href="#" class="text-dark">${item.name}</a> (${item.size})
        </h5>
        <p class="text-muted mb-0">
          <i class="bx bxs-star text-warning"></i>
          <i class="bx bxs-star text-warning"></i>
          <i class="bx bxs-star text-warning"></i>
          <i class="bx bxs-star text-warning"></i>
          <i class="bx bxs-star-half text-warning"></i>
        </p>
        <p class="text-muted mb-0 mt-1">₱${item.price} x ${item.quantity}</p>
      </td>
      <td>₱${total}</td>
    </tr>
  `;
});






let subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
document.getElementById("total").innerText = `₱${subtotal + 34 + 49}`; //TOTAL
document.getElementById("tax").innerText = `₱${34}`;                     //TAX  
document.getElementById("shipping").innerText = `₱${49}`; 








// for POPUP body NOT FINISHED CAUSE ERROR

 let Cart = JSON.parse(localStorage.getItem("cart")) || [
    { name: "Glow Serum", price: 12.99, size: "Medium", quantity: 1 },
    { name: "Hydra Cream", price: 18.5, size: "Large", quantity: 2 }
  ];

  // Proceed Button
  let proceedBtn = document.getElementById("proceedBtn");

  proceedBtn.addEventListener("click", () => {
    let popupBody = document.getElementById("popup-body");
    popupBody.innerHTML = ""; // clear old content

    // Build receipt HTML
    let receiptHTML = `
      <section class="h-100 h-custom" style="background-color: #eee;">
        <div class="container py-4 h-100">
          <div class="row justify-content-center align-items-center h-100">
            <div class="col-lg-10">
              <div class="card border-top border-bottom border-3" style="border-color: #f37a27 !important;">
                <div class="card-body p-4">
                  <p class="lead fw-bold mb-4" style="color: #f37a27;">Purchase Receipt</p>

                  <div class="row mb-4">
                    <div class="col">
                      <p class="small text-muted mb-1">Date</p>
                      <p>${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="col text-end">
                      <p class="small text-muted mb-1">Order No.</p>
                      <p>#${Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div class="mx-n3 px-3 py-3" style="background-color: #f2f2f2;">
    `;

    // Add cart items
    Cart.forEach(item => {
      receiptHTML += `
        <div class="row mb-3">
          <div class="col-md-8">
            <p class="mb-1 fw-bold">${item.name}</p>
            <small>Size: ${item.size || "N/A"} | Qty: ${item.quantity || 1}</small>
          </div>
          <div class="col-md-4 text-end">
            <p class="mb-0">₱${item.price}</p>
          </div>
        </div>
      `;
    });

    // Calculate total
    let total = Cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    let shipping = 5.0;

    // Add totals + tracking
    receiptHTML += `
          <hr>
          <div class="row">
            <div class="col-md-8"><p class="mb-0">Shipping</p></div>
            <div class="col-md-4 text-end"><p class="mb-0">₱${shipping.toFixed(2)}</p></div>
          </div>
          </div>

          <div class="row my-4">
            <div class="col-md-4 offset-md-8 text-end">
              <p class="lead fw-bold mb-0" style="color: #f37a27;">₱${(total + shipping).toFixed(2)}</p>
            </div>
          </div>

          <p class="lead fw-bold mb-3" style="color: #f37a27;">Tracking Order</p>
          <ul class="list-inline d-flex justify-content-between">
            <li class="list-inline-item"><span class="badge bg-warning text-dark">Ordered</span></li>
            <li class="list-inline-item"><span class="badge bg-warning text-dark">Shipped</span></li>
            <li class="list-inline-item"><span class="badge bg-warning text-dark">On the way</span></li>
            <li class="list-inline-item"><span class="badge bg-secondary">Delivered</span></li>
          </ul>

          <p class="mt-4 pt-2 mb-0">Need help? 
            <a href="#" style="color: #f37a27;">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
    `;

    popupBody.innerHTML = receiptHTML;

    // Show popup
    const modal = new bootstrap.Modal(document.getElementById("popup"));
    modal.show();
  });



