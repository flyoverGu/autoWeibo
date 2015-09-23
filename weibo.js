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
            //console.log(e);
        }
    });
}

var readFeed = function(html) {
    var $ = cheerio.load(html, {decodeEntities: false});
    $('.WB_cardwrap', '.WB_feed').each(function(index, el) {
        var $el = $(el);
        var author = $el.find('.WB_detail .WB_info a').html().trim();
        var content = $el.find('.WB_detail .WB_text').html().trim();
        var forward = $el.find('.WB_feed_handle li span[node-type="forward_btn_text"]').html().trim().replace('转发', '');
        var comment = $el.find('.WB_feed_handle li span[node-type="comment_btn_text"]').html().trim().replace('评论', '');
        var like = $el.find('.WB_feed_handle li span[node-type="like_status"] em').html().trim();
        console.log('作者: ' + author);
        console.log('内容: ' + content);
        console.log('转发: ' + forward + ' 评论: ' + comment +' 点赞: ' + like);
        console.log('');
        console.log('');
        console.log('');
    });
}

var get = function() {
    var req = http
        .get(config.url)
        .set('Cookie', config.cookie)
        .set('Host', 'weibo.com')
        .end(function(err, res) {
            if (err) {
                console.log('error ' + err);
                return;
            }
            handleHtml(res.text);
        })
}

var send = function(text) {
    
}

get();
