var scraperjs = require('scraperjs');
var fs = require('graceful-fs');
var http = require('http');
var Pokemandb = require('./PokemanSchema.js');
var under = require('underscore');
var request = require('request');

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

      var file = fs.createWriteStream('./img/mainImg/'+pokeman.No.split('#')[1]+pokeman.EName+'.png');
      if (typeof(link) != 'string') return;
        
      var options = {
        host: 'static.52poke.com',
        port: 80,
        path: link.split('http://static.52poke.com')[1]
      };
      var request = http.get(options, function(res) {
        res.pipe(file);
        file.on('open',function(){console.log('stream open')})
        file.on('finish',function(){
          console.log(link);
          file.close();
        });
        file.on('end',function(){
          console.log('stream end');
          file.close();
        });
        file.on('error',function(e){console.log("Got error: " + e.message);});
      });
      request.on('error', function(e) {
        console.log("Got error: " + e.message);
      });

      // request(
      //   {
      //     method: 'GET',
      //     uri: link
      //   },
      //   function(err, res, body){
      //     if(err){
      //       console.log('Got error:' + err.message);
      //     }
      //     else if(res.statusCode == 404){ console.log('404');}
      //     else {
      //       res.pipe(file);
      //       file.on('finish',function(){file.close();});
      //     }
      //   }

      // )
    })
  }
