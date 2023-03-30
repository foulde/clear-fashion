// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');


const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const recentProductsCheckbox = document.querySelector('#recent-products');
const reasonablePriceCheckbox = document.querySelector('#reasonable-price');
const selectSort = document.querySelector('#sort-select');
const spanNbRecentProducts = document.querySelector('#nbRecentProducts');



let totalProductCount = 0;

/**
 * Select the page to display
 */
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), parseInt(selectShow.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  totalProductCount = meta.count;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand = '') => {
  try {
    let url = `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`;
    if (brand) {
      url += `&brand=${brand}`;
    }
    const response = await fetch(url);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (products, pagination) => {
  const {count} = pagination;
  const numberOfRecentProducts = getNumberOfRecentProducts(products);

  spanNbProducts.innerHTML = count;
  spanNbRecentProducts.innerHTML = numberOfRecentProducts;
};



const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(products, pagination);
};


/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
  
  await renderBrands();


});



const fetchBrands = async () => {
  try {
    const response = await fetch('https://clear-fashion-api.vercel.app/brands');
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }

    console.log('Brands from API:', body.data);
    return body.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};




selectBrand.addEventListener('change', async (event) => {
  const selectedBrand = event.target.value;
  const products = await fetchProducts(currentPagination.currentPage, parseInt(selectShow.value));

  setCurrentProducts(products);

  if (selectedBrand) {
    const filteredProducts = currentProducts.filter(product => product.brand === selectedBrand);
    render(filteredProducts, currentPagination);
  } else {
    render(currentProducts, currentPagination);
  }
});





const renderBrands = async () => {
  console.log('Rendering brands...');
  const selectBrand = document.querySelector('#brand-select');
  const brands = await fetchBrands();
  const options = ['<option value="">All brands</option>', ...brands.result
    .map(brand => `<option value="${brand}">${brand}</option>`)]
    .join('');

  selectBrand.innerHTML += options;
  console.log('Updated brand-select innerHTML:', selectBrand.innerHTML);
};



const filterRecentProducts = (products) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  return products.filter(product => {
    const releaseDate = new Date(product.released);
    return releaseDate >= twoWeeksAgo;
  });
};





recentProductsCheckbox.addEventListener('change', async (event) => {
  const products = await fetchProducts(
    currentPagination.currentPage,
    parseInt(selectShow.value),
    selectBrand.value
  );

  setCurrentProducts(products);

  if (event.target.checked) {
    const recentProducts = filterRecentProducts(currentProducts);
    render(recentProducts, currentPagination);
  } else {
    render(currentProducts, currentPagination);
  }
});

const filterReasonablePrice = (products) => {
  const maxPrice = 50;
  return products.filter(product => product.price <= maxPrice);
};



reasonablePriceCheckbox.addEventListener('change', async (event) => {
  const products = await fetchProducts(
    currentPagination.currentPage,
    parseInt(selectShow.value),
    selectBrand.value
  );

  setCurrentProducts(products);

  if (event.target.checked) {
    const reasonablyPricedProducts = filterReasonablePrice(currentProducts);
    render(reasonablyPricedProducts, currentPagination);
  } else {
    render(currentProducts, currentPagination);
  }
});


// const sortProductsByPrice = (products, sortOrder) => {
//   return products.slice().sort((a, b) => {
//     if (sortOrder === 'price-asc') {
//       return a.price - b.price;
//     } else if (sortOrder === 'price-desc') {
//       return b.price - a.price;
//     } else {
//       return 0;
//     }
//   });
// };


selectSort.addEventListener('change', async (event) => {
  const sortOrder = event.target.value;
  const sortedProducts = sortProducts(currentProducts, sortOrder);
  render(sortedProducts, currentPagination);
});



const sortProducts = (products, sortOrder) => {
  return products.slice().sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    } else if (sortOrder === 'price-desc') {
      return b.price - a.price;
    } else if (sortOrder === 'date-asc') {
      return new Date(a.released) - new Date(b.released);
    } else if (sortOrder === 'date-desc') {
      return new Date(b.released) - new Date(a.released);
    } else {
      return 0;
    }
  });
};


const getNumberOfRecentProducts = (products) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  return products.filter(product => {
    const releaseDate = new Date(product.released);
    return releaseDate > twoWeeksAgo;
  }).length;
};

