const cheerio= require('cheerio');
 const axios = require('axios');
 const fs=require("fs")

 const url='https://shop.circlesportswear.com/collections/all'
//  const url='https://www.dedicatedbrand.com/en/men/t-shirts'
 
 const products=[]

  async function getProducts(){
    try{
      const response= await axios.get(url);
      const $= cheerio.load(response.data)
      const brand_name='circlesportwear';
      console.log(brand_name);

      const p=$('.product-grid-container .grid__item');
      p.each(function(){
          link = "https://shop.circlesportswear.com" + $(this).find('.full-unstyled-link').attr('href')
          img = "https:"+$(this).find('img').attr('src');
          title = $(this).find('.card__heading').first().text().trim().replace(/\s/g, ' ');
          // price=parseInt($(this).find('.price-item--regular .money').text())
          priceString = $(this).find('.price-item--regular .money').text().trim();
          priceMatch = priceString.match(/\d+(\.\d+)?/);
          price = priceMatch ? parseFloat(priceMatch[0]) : null;

          products.push({brand_name,link,img,title,price})
      });
      if ($(".next a").length>0){
          next_page=url +$(".next a").attr("href");
          getProducts(next_page);
      }
         fs.writeFile('circlesportwear2.json', JSON.stringify(products),(err) => {
             if (err) {
                 console.log(err)
             } else {
                 console.log('Scraped data saved into circlesportwear.json')
                 }
             })

      console.log(products);


    }catch(error){
      console.error(error);
    }

  }

  getProducts();