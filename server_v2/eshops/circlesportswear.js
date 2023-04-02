// circlesportswear.js
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-grid-container .card')
    .map((i, element) => {
      const name = $(element)
        .find('.card__heading.h5')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseFloat(
        $(element)
          .find('.price')
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
