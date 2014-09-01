var scraperjs = require('scraperjs');
var fs = require('fs');
var http = require('http');
var Pokemandb = require('./PokemanSchema.js');
var under = require('underscore');

var item = 0;

Pokemandb.find(function(err, pokemans) {
  if (err) console.log(err);
  pokemans.forEach(scrapeImg);
})

function scrapeImg(pokeman) {
  scraperjs.StaticScraper.create('http://wiki.52poke.com/wiki/File:'+pokeman.No.split('#')[1]+pokeman.EName+'.png')
    .scrape(function($) {
      return $('div.fullMedia>a').attr('href');
    },function(link){
      pokeman.ImgUrl.MainImg = link;
      pokeman.save(function(err){});
      http.get(link, function(res){
        var imgData='';
        res.setEncoding('binary');

        res.on('data', function(chunk){
          imgData+=chunk;
        });
        res.on('end',function(){
          fs.writeFileSync('./img/mainImg/'+pokeman.No.split('#')[1]+pokeman.EName+'.png', imgData);
          console.log(item++);
        });

      })
    })
  }