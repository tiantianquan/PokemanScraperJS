var scraperjs = require('scraperjs');
var fs = require('fs');
var Pokemandb = require('./PokemanSchema.js');
var under = require('underscore');

Pokemandb.find(function(err, pokemans) {
  if (err) console.log(err);
  pokemans.forEach(scrapeIntroduce);
})

function scrapeIntroduce(pokeman) {
  scraperjs.StaticScraper.create('http://wiki.52poke.com/index.php?title=' + pokeman.Name + '&action=edit')
    .scrape(function($) {
        var draft = $('textarea').text();
        return draft;
      },function(draft){
        var flags = [{Outlook:'===外貌==='}, {SexDifferent:'====性别差异===='}, {Ability:'====特殊能力===='}, {Disposition:'===性情==='}, {Habitat:'===栖息地==='}, {Food:'===饮食==='}, {Cartoon:'==动画中=='}];

        var reg = /{{m\||}}|\[\[|\]\]|{{main\|/g;

        flags.forEach(function(content) {
          for ( attribute in content)
            new Title(attribute.toString(),content[attribute]);
        });

        // OtherIntro : {str:'xdex',index:{},text:''}

        Title.list.forEach(function(title, index, array) {
          var startIndex = draft.indexOf(title.str),
            endIndex = startIndex + title.str.length;
          title.index = {
            startIndex: startIndex,
            endIndex: endIndex
          };
        });

        Title.list.forEach(function(title, index, array) {
          if (index != array.length - 1)
            title.text = draft.slice(title.index.endIndex, array[index + 1].index.startIndex)
              .trim().replace(reg, '');
        });



        //--------------------------------------------------------

        Title.list.forEach(function(content,index,array){
          if (index != array.length - 1)
            pokeman.Introduce[content.name] = content.text;
        })

        var otherIntro = new Title('otherIntro','xdex=');
        otherIntro.index = {startIndex: draft.indexOf(otherIntro.str), endIndex:otherIntro.startIndex+otherIntro.str.length};
        if (draft.split(otherIntro.str)[1] != null){

          otherIntro.text = draft.split(otherIntro.str)[1].split('{{',2)[0].trim().replace(reg, '');
        }
        else if(draft.split('bwdex=')[1] != null){
          otherIntro.text = draft.split('bwdex=')[1].split('{{',2)[0].trim().replace(reg, '');
        }
        else
        {
          otherIntro.text = '';
        }

        pokeman.OtherIntroduce = otherIntro.text;
        pokeman.save(function(err){
          if(err)
            console.log(err);
          console.log('ok');
        });
      })
  }

  var Title = function(name,str) {
    this.name = name;
    this.str = str;
    this.index = {};
    this.text = '';
    this.addToList(this);
  }
  Title.list = Title.prototype.list = [];
  Title.prototype.addToList = function(title) {
    //str有问题
    this.list.push(title);
  }