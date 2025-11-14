fetch('database.json')
  .then(rawData => rawData.json())
  .then(database => {
    database
      .filter(item => item.options.drink_type.includes("Iced"))     //display only Iced drinks 
      .forEach(item => { 
        let name = item.name.english;
        let image = item.image.hires;
        let price = item.base.price;
        let calories = item.base.calories;

        document.querySelector('#cards').innerHTML += `
          <div class="cards" style="width: 18rem;"> 
            <div class="cards-container">
              <img src="${image}" class="cards-img-top" alt="${name}">
              <div class="cards-body">
                <h2 class="cards-title">${name}</h2>

                <!-- SIZE DROPDOWN -->
                <div class="dropdown-row">
                  <h5>Size</h5>
                  <div class="dropdown">
                    <a href="#" class="dropbtn">Select a size</a>
                    <div class="dropdown-content">
                      <a href="#">Small</a>
                      <a href="#">Medium</a>
                      <a href="#">Large</a>
                    </div>
                  </div>
                </div>

                <!-- PRICE -->
                <div class="dropdown-row">
                  <h5>Price</h5>
                  <div class="dropdown">
                    <a href="#" class="dropbtn">${price}</a>
                  </div>
                </div>

                <!-- CALORIES -->
                <div class="dropdown-row">
                  <h5>Calories</h5>
                  <div class="dropdown">
                    <a href="#" class="dropbtn">${calories}</a>
                  </div>
                </div>

                <a href="#" class="btn btn-primaryy">ADD TO BASKET</a>
              </div>
            </div>
          </div>
        `;
      });
    });
