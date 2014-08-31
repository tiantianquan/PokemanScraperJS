var scraperjs = require('scraperjs');
var fs = require('fs');
var Pokemandb = require('./PokemanSchema.js');

//mainpath = 神奇宝贝列表（按全国图鉴编号）
var mainpath = '%E7%A5%9E%E5%A5%87%E5%AE%9D%E8%B4%9D%E5%88%97%E8%A1%A8%EF%BC%88%E6%8C%89%E5%85%A8%E5%9B%BD%E5%9B%BE%E9%89%B4%E7%BC%96%E5%8F%B7%EF%BC%89';
scraperjs.StaticScraper.create('http://wiki.52poke.com/wiki/' + mainpath)
  .scrape(function($) {
    var links = $('span[class^="sprite-icon sprite-icon-"]').map(function() {
      return $(this).closest('td').next().next().next().children().attr('href');
    }).get();
    return links;
  }, function(links) {
    links.forEach(function(link) {

      scraperjs.StaticScraper.create('http://wiki.52poke.com' + link)
        .scrape(function($) {
          var subj = new Pokemandb();
          subj.No = $('a[href="/wiki/' + mainpath + '"]').text().trim();
          subj.Name = $('title').text().split(' ')[0].trim();
          subj.EName = link.split('/')[2];
          subj.Category = $('b a[title="分类"]').closest('b').next('table').children(':contains("神奇宝贝")').text().trim();
          subj.Property = $('b a[title="属性"]').closest('b').next('table').find('a').map(function() {
            return $(this).text().trim()
          }).get();
          subj.WikiLink = link;

          subj.Introduce = {};
          subj.ImgUrl = {};

          console.log(subj);
          return subj;
        }, function(content) {
          // fs.writeFileSync('./cacheHtml/' + link.split('/')[2] + '.html', content);
          content.save(function(err) {
            if (err)
              console.log(err);
            console.log('ok');
          })
        })
    })
  });