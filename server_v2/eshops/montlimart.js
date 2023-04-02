// montlimart.js
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const parse = data => {
  const $ = cheerio.load(data);

  return $('.products-list.row .product-miniature')
    .map((i, element) => {
      const name = $(element)
        .find('.product-miniature__title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseFloat(
        $(element)
          .find('.product-miniature__pricing')
          .text()
          .replace(/[^0-9.,]/g, '')
          .replace(',', '.')
      );

      return {name, price};
    })
    .get();
};

module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      return parse(body);
    }

    console.error(response);
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
