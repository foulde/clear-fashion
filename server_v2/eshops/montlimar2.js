const cheerio= require('cheerio');
 const axios = require('axios');
 const fs=require("fs")

 const url='https://www.montlimart.com/99-vetements'
//  const url='https://www.dedicatedbrand.com/en/men/t-shirts'
 
 const products=[]

  async function getProducts(){
    try{
      const response= await axios.get(url);
      const $= cheerio.load(response.data)
      const brand_name='montlimart';
      console.log(brand_name);

      const p=$('.products-list row .products-list__block');
      p.each(function(){
          link = $(this).find('.product-miniature__thumb-link').attr('href')
          img= $(this).find('.product-miniature__thumb-link').attr('src')
          title=$(this).find('.product-miniature__title').text()
          price=parseInt($(this).find('.product-miniature__pricing').text().replace(/[^0-9.,]/g, ''))

          products.push({brand_name,link,img,title,price})
      });
      if ($(".next a").length>0){
          next_page=url +$(".next a").attr("href");
          getProducts(next_page);
      }
         fs.writeFile('montlimart.json', JSON.stringify(products),(err) => {
             if (err) {
                 console.log(err)
             } else {
                 console.log('Scraped data saved into dedicated.json')
                 }
             })

      console.log(products);


    }catch(error){
      console.error(error);
    }

  }

  getProducts();