const cheerio= require('cheerio');
 const axios = require('axios');
 const fs=require("fs")

 const url='https://www.dedicatedbrand.com/en/men/t-shirts'
//  const url='https://www.dedicatedbrand.com/en/men/t-shirts'
 
 const products=[]

  async function getProducts(){
    try{
      const response= await axios.get(url);
      const $= cheerio.load(response.data)
      const brand_name='dedicated';
      console.log(brand_name);

      const p=$('.productList-container .productList');
      p.each(function(){
          link = $(this).find('.productList-link').attr('href')
          img= $(this).find('.productList-image img').attr('data-src')
          title=$(this).find('.productList-title').text().trim().replace(/\s/g, ' ')
          price=parseInt($(this).find('.productList-price').text())

          products.push({brand_name,link,img,title,price})
      });
      if ($(".next a").length>0){
          next_page=url +$(".next a").attr("href");
          getProducts(next_page);
      }
         fs.writeFile('dedicated.json', JSON.stringify(products),(err) => {
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