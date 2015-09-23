var http = require('superagent');
var fs = require('fs');
var cheerio = require('cheerio');

var config = require('./config');

var handleHtml = function(html) {
    var $ = cheerio.load(html);
    $('script').each(function(index, el) {
        var $el = $(el);
        var js = $el.html();
        var dom = "";
        try {
            js = "var FM = {view: function(o){return o.html;}}; return " + js;
            dom = new Function(js)();
            readFeed(dom);
        } catch(e) {
            console.log(e);
        }
    });
}

var readFeed = function(html) {
    var $ = cheerio.load(html, {decodeEntities: false});
    $('.WB_cardwrap', '.WB_feed').each(function(index, el) {
        var $el = $(el);
        var author = $el.find('.WB_detail .WB_info a').html();
        var content = $el.find('.WB_detail .WB_text').html();
        console.log(author, content);
    });
}

var wb = fs.readFileSync('./wb.html', 'utf8');
handleHtml(wb);


var url = 'http://weibo.com/u/5642637931/home';


var get = function() {
    var file = fs.createWriteStream('./wb.html');
    var req = http
        .get(url)
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .set('Accept-Encoding', 'gzip, deflate, sdch')
        .set('Cookie', config.cookie)
        .set('Host', 'weibo.com')
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2513.0 Safari/537.36')
    req.pipe(file)
        //.end(function(err, res) {
        //    if (err) {
        //        console.log('error ' + err);
        //        return;
        //    }
        //    //handleHtml(res.text);
        //})
    req.on('error', function(err) {
        console.log(err);
    });

}

var send = function(text) {
    
}
