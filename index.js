const request = require('request');
const cheerio = require('cheerio');
const express = require('express')
var app = express();
app.use(express.urlencoded());
app.use(express.json());
var time = 3000;
app.get('/', function (req, res) { 
  console.log(req.query.list);
  var url = 'http://truyendoc.info/';
  if(req.query) {
    url = `http://truyendoc.info/tinh-nang/truyen-moi-nhat/${req.query.list}`;
  }
  var options = {
    url: url,
    method: 'GET', 
    headers: {
      'User-Agent': 'Super Agent/0.0.1' , 
      'Content-Type' : 'application/x-www-form-urlencoded'
    } , 
    qs:{'key1' :  'xxx' , 'key2': 'yyy'}
  };
  var ds ;
  var html = '';
  var name;
  var array = [];
  var index = 0;
  var index2 = 0;
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
       ds = $(body).find(".thumbnail a img");
       name = $(body).find(".thumbnail a");
       tap = $(body).find(".comic_content span.left")
      name.each(function(i , e){
       array.push(e["attribs"])
      })
      tap.each(function(i , e){
         index2++;
        if(index2 == 2) {
          index2 = -1;
          array[index].tap = $(this).text();
          index++
        }
       })
      ds.each(function(i , e){
        index = 0
        var heft = array[index].href ;
        var title = array[index].title;
        var tap = array[index].tap;
        index++;
       html += `<li class="span100"><img src="${e["attribs"]["src"]}" alt="?"><a title="${heft}" onclick="gettruyen('${heft}')">${title}</a><p>${tap}</p></li>`
      })
    }
  })
  setTimeout(() => {
    res.send(`
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    </head>
    <style>
    img {
      height:50px ;
      width:50px ;
    }
    .boximg {
      display:flex
      flex-wrap: wrap;
    }
    .span100 {
      width:100%;
    }
    </style>
    <h1>http://truyendoc.info/</h1>
    <form method="POST" action="/">
    <input type="text" name="name" placeholder="khai báo link truyện tại đây" style="width:100%"> <br>
    <input type="submit" value="bấm vào đây để Đọc" style="width:30%">
   </form>
   <form method="POST" action="/gettruyen">
    <input type="text" name="name" placeholder="get truyen theo ten" style="width:100%" class="gettruyen"> <br>
    <input type="submit" value="bấm vào đây để Đọc" style="width:30%">
   </form>
   <a href="http://localhost:3000?list=${Number(req.query.list) + 1}">Next</a>
   <a href="http://localhost:3000?list=${Number(req.query.list) - 1}">back </a>
   <div class="boximg">
    ${html}
    </div>
    <script>
    function gettruyen(title){
      document.querySelector(".gettruyen").setAttribute("value" , title);
    }
    </script>
    `)
  }, time);
})
app.post('/', function (req, res) {
  var options = {
    url: req.body.name ,
    method: 'GET', 
    headers: {
      'User-Agent': 'Super Agent/0.0.1' , 
      'Content-Type' : 'application/x-www-form-urlencoded'
    } , 
    qs:{'key1' :  'xxx' , 'key2': 'yyy'}
  };
  var ds ;
  var html = '';
  var input = '';
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
       ds = $(body).find(".main_img");
       dsn = $(body).find(".next_page");
       var index = 0;
       var str = '';
      ds.each(function(i , e){
        html += ` <img src="${e["attribs"]["src"]}" alt="" style="width:60%">`
      })
      dsn.each(function(i , e){
        index++;
        if(index == 1 || index == 3) {
          str = "tập trước"
        }else {
          str = "tập sau"
        }
        input += `<form method="POST" action="/"><button type="submit">${str}</button> <input type="text" id="lname" name="name" value='${e["attribs"]["href"]}' style="width:90%"><br></form>`
     })
    }
  })
  setTimeout(() => {
    res.send(input + html + input);
  }, time);
})
app.post('/gettruyen', function (req, res) {
  var options = {
    url: req.body.name ,
    method: 'GET', 
    headers: {
      'User-Agent': 'Super Agent/0.0.1' , 
      'Content-Type' : 'application/x-www-form-urlencoded'
    } , 
    qs:{'key1' :  'xxx' , 'key2': 'yyy'}
  };
  var ds ;
  var html = '';
  var index = '';
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
       dsn = $(body).find(".list_chapter li a");
       var index = 0;
       var str = '';
      dsn.each(function(i , e){
        index++;
        html += `<a herf="${e["attribs"]["href"]}" onclick="gettruyen('http://truyendoc.info/${e["attribs"]["href"]}')">Chap:${ dsn.length - index + 1}</a> <br>`
    })
  }
  })
  setTimeout(() => {
    res.send(`${html}
    <form method="POST" action="/">
    <input type="text" name="name" placeholder="get truyen theo ten" style="width:100%" class="gettruyen"> <br>
    <input type="submit" value="bấm vào đây để Đọc" style="width:30%">
   </form>
    <script>
    function gettruyen(title){
      document.querySelector(".gettruyen").setAttribute("value" , title);
    }
    </script>
    `);
  }, time);
})
app.listen(3000 , function(){
  console.log("port 3000")
})