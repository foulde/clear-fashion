const cheerio= require('cheerio');
 const axios = require('axios');
 const fs=require("fs")

 const url='https://coteleparis.com/collections/tous-nos-produits'
 const products=[]

  async function getProducts(){
    try{
      const response= await axios.get(url);
      const $= cheerio.load(response.data)
      const brand_name='Côtelé';
      console.log(brand_name);

      const p=$('.collection__grid');
      p.each(function(){
          link = "https://coteleparis.com" + $(this).find('.product-card__img--wrapper').attr('href')
          img= $(this).find('img').attr('src')
          title=$(this).find('.product-card__details--title').text()
          price=parseInt($(this).find('.product-card__details--price').text())

          products.push({brand_name,link,img,title,price})
      });
      if ($(".next a").length>0){
          next_page=url +$(".next a").attr("href");
          getProducts(next_page);
      }
         fs.writeFile('cotele.json', JSON.stringify(products),(err) => {
             if (err) {
                 console.log(err)
             } else {
                 console.log('Scraped data saved into cotele.json')
                 }
             })

      console.log(products);


    }catch(error){
      console.error(error);
    }

  }

  getProducts();