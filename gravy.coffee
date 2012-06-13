request = require 'request'
fs = require 'fs'
path = require 'path'
temp = require 'temp'
im = require 'imagemagick'
express = require 'express'
colors = require 'colors'
_ = require 'underscore'


type_whitelist = new RegExp("^[a-z]+$")
app = express.createServer()

app.get '/:type/:gravatar_hash', (req, resp)->
  reqid = parseInt(Math.random()*10000)
  offset = req.query.offset || '0,0'
  
  [x, y] = _.map offset.split(','), (i)-> parseInt(i)
  
  offset = if x > 0 && y > 0 then "+#{x}+#{y}" else "+0+0"

  type = req.params.type
  unless type && type_whitelist.test(type)
    type = 'grainysubhatch'



  path.exists "templates/#{type}", (exists)->
    unless exists
      console.log "no template #{type}".red
      resp.send(406)
      return

    console.log "[#{reqid}] Template: #{type} offset: #{offset}, requesting #{req.params.gravatar_hash}, size #{req.query.s}.".white

    console.time(reqid)
    #
    # setup tempfile write stream
    temp_name = temp.path({prefix: 'mkt'})
    ws = fs.createWriteStream(temp_name)
    ws.on 'close', ()->
      console.log "[#{reqid}] Done downloading.".yellow
      #
      # setup tempresult for composite result
      temp_result = temp.path({prefix: 'mkt-res'})
      im.composite ['-geometry', offset, this.path, "templates/#{type}/tmpl.png", "templates/#{type}/mask.png", '-compose', 'Dst_Over', temp_result], ()->
        # when done, pipe it down the response
        console.log "[#{reqid}] Done compositing.".yellow
        rs = fs.createReadStream(temp_result)
        rs.on 'close', ()->
          console.log "[#{reqid}] Went down the pipe!.".green
          console.timeEnd(reqid)
          #XXX do a courtesy cleanup of tempfiles
          #    not needed if there's a tempcleaning procedure.
        rs.pipe(resp)

    # make a request that hooks on write stream
    # and makes the chain reaction go off.
    p = request("http://www.gravatar.com/avatar/#{req.params.gravatar_hash}?s=#{req.query.s}").pipe(ws)

port = process.env.PORT || 4000 
console.log "Gravy up and ready for requests on port #{port}"
console.log "Give me some delicious gravatars!".rainbow
app.listen(port)

