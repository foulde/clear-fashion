const API_URL = "https://clear-fashion-ecru.vercel.app";
const productList = document.querySelector(".product-list");
const brandFilter = document.getElementById("brand-filter");
const sortByPrice = document.getElementById("sort-by-price");

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

async function fetchProducts(brand, sort) {
    const url = new URL(`${API_URL}/products`);
    if (brand) url.searchParams.append("brand", brand);
    if (sort) url.searchParams.append("sort", sort);

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


function handleFilterChange() {
const brand = brandFilter.value;
const sort = sortByPrice.value;
fetchProducts(brand, sort);
}

brandFilter.addEventListener("change", handleFilterChange);
sortByPrice.addEventListener("change", handleFilterChange);

fetchBrands();
fetchProducts();
