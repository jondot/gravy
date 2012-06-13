(function() {
  var app, colors, express, fs, im, path, port, request, temp, type_whitelist, _;

  request = require('request');

  fs = require('fs');

  path = require('path');

  temp = require('temp');

  im = require('imagemagick');

  express = require('express');

  colors = require('colors');

  _ = require('underscore');

  type_whitelist = new RegExp("^[a-z]+$");

  app = express.createServer();

  app.get('/:type/:gravatar_hash', function(req, resp) {
    var offset, reqid, type, x, y, _ref;
    reqid = parseInt(Math.random() * 10000);
    offset = req.query.offset || '0,0';
    _ref = _.map(offset.split(','), function(i) {
      return parseInt(i);
    }), x = _ref[0], y = _ref[1];
    offset = x > 0 && y > 0 ? "+" + x + "+" + y : "+0+0";
    type = req.params.type;
    if (!(type && type_whitelist.test(type))) type = 'grainysubhatch';
    return path.exists("templates/" + type, function(exists) {
      var p, temp_name, ws;
      if (!exists) {
        console.log(("no template " + type).red);
        resp.send(406);
        return;
      }
      console.log(("[" + reqid + "] Template: " + type + " offset: " + offset + ", requesting " + req.params.gravatar_hash + ", size " + req.query.s + ".").white);
      console.time(reqid);
      temp_name = temp.path({
        prefix: 'mkt'
      });
      ws = fs.createWriteStream(temp_name);
      ws.on('close', function() {
        var temp_result;
        console.log(("[" + reqid + "] Done downloading.").yellow);
        temp_result = temp.path({
          prefix: 'mkt-res'
        });
        return im.composite(['-geometry', offset, this.path, "templates/" + type + "/tmpl.png", "templates/" + type + "/mask.png", '-compose', 'Dst_Over', temp_result], function() {
          var rs;
          console.log(("[" + reqid + "] Done compositing.").yellow);
          rs = fs.createReadStream(temp_result);
          rs.on('close', function() {
            console.log(("[" + reqid + "] Went down the pipe!.").green);
            return console.timeEnd(reqid);
          });
          return rs.pipe(resp);
        });
      });
      return p = request("http://www.gravatar.com/avatar/" + req.params.gravatar_hash + "?s=" + req.query.s).pipe(ws);
    });
  });

  port = process.env.PORT || 4000;

  console.log("Gravy up and ready for requests on port " + port);

  console.log("Give me some delicious gravatars!".rainbow);

  app.listen(port);

}).call(this);
