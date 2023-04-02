const API_URL = "https://clear-fashion-ecru.vercel.app";
const productList = document.querySelector(".product-list");
const brandFilter = document.getElementById("brand-filter");
const sortByPrice = document.getElementById("sort-by-price");

const showMore = document.getElementById("show-more");
const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const recentFilter = document.getElementById("recent-filter");
const priceFilter = document.getElementById("price-filter");
const sortByDate = document.getElementById("sort-by-date");

async function fetchBrands() {
    const response = await fetch(`${API_URL}/brands`);
    const brands = await response.json();
    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

let currentPage = 1;

async function fetchProducts(brand, sortPrice, sortDate, limit, page, price) {
    const url = new URL(`${API_URL}/products`);
    if (brand) url.searchParams.append("brand", brand);
    if (sortPrice) url.searchParams.append("sort", sortPrice);
    if (limit) url.searchParams.append("limit", limit);
    if (page) url.searchParams.append("page", page);
    if (price) url.searchParams.append("max_price", price);
    if (sortDate) url.searchParams.append("sort_date", sortDate);
    

    const response = await fetch(url);
    const products = await response.json();



    productList.innerHTML = "";
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
        <h3>${product.title}</h3>
        <img src="${product.img}" alt="${product.title}">
        <p>Brand: ${product.brand_name}</p>
        <p>Price: ${product.price}</p>`;
productList.appendChild(productCard);
});

}

// const response = await fetch(url);
// const products = await response.json();

// console.log(products); // Debugging: Examine the fetched products



// function handleFilterChange() {
//     const brand = brandFilter.value;
//     const sort = sortByPrice.value;
//     const limit = showMore.value;
//     currentPage = 1;
//     fetchProducts(brand, sort, limit, currentPage);
// }


function handlePageChange(direction) {
    currentPage += direction;
    const brand = brandFilter.value;
    const sort = sortByPrice.value;
    const limit = showMore.value;
    fetchProducts(brand, sort, limit, currentPage);
    pageInfo.textContent = currentPage;
    prevPage.disabled = currentPage === 1;
}


function getDateTwoWeeksAgo() {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return twoWeeksAgo;
  }
  


// function handleFilterChange() {
//   const brand = brandFilter.value;
//   const sort = sortByPrice.value;
//   const limit = showMore.value;
//   const recent = recentFilter.checked;
//   currentPage = 1;
//   fetchProducts(brand, sort, limit, currentPage, recent);
// }

async function fetchProductCount() {
    const response = await fetch(`${API_URL}/products/count`);
    const count = await response.json();
    document.getElementById("product-count").textContent = count;
  }
  

function handleFilterChange() {
const brand = brandFilter.value;
const sortPrice = sortByPrice.value;
const sortDate = sortByDate.value;
const limit = showMore.value;
const recent = recentFilter.checked;
const price = priceFilter.value;
currentPage = 1;
fetchProducts(brand, sortPrice, sortDate, limit, currentPage, price);
}
  




priceFilter.addEventListener("change", handleFilterChange);


sortByDate.addEventListener("change", handleFilterChange);

recentFilter.addEventListener("change", handleFilterChange);

brandFilter.addEventListener("change", handleFilterChange);
sortByPrice.addEventListener("change", handleFilterChange);
showMore.addEventListener("change", handleFilterChange);

prevPage.addEventListener("click", () => handlePageChange(-1));
nextPage.addEventListener("click", () => handlePageChange(1));

// Update the initial fetchProducts call to include the default limit of 12
fetchBrands();
fetchProducts(null, null, null, 12, 1);
fetchProductCount();
