// sandbox-montlimart.js

// const dedicatedbrand = require('./eshops/dedicatedbrand');

const circlesportswear = require('./eshops/circlesportswear');

async function sandbox(eshop = 'https://shop.circlesportswear.com/collections/all') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await circlesportswear.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [, , eshop] = process.argv;

sandbox(eshop);
