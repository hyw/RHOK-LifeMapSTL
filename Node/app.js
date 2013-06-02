var express = require('express'),
    http    = require('http'),
    app     = express()

app.use(express.static(__dirname + '/public'))

// For now, we're not supporting :severity. I think we will in the future, but not now.
app.get('/:mode', function(req, res) {
  var response = req.param('mode') + ' ' + req.param('severity'),
      minX     = req.param('minX'),
      minY     = req.param('minY'),
      maxX     = req.param('maxX'),
      maxY     = req.param('maxY'),
      query    = 'http://54.225.191.82/arcgis/rest/services/' +
        'SaintLouis/STLCrime_12Months_wTime/FeatureServer/0/query?' +
        'where=1+%3D+1&' +
        'objectIds=&' +
        'time=&' +
        'geometry=' + minX +',' + minY + ',' + maxX + ',' + maxY + '&' +
        'geometryType=esriGeometryEnvelope&' +
        'inSR=4326&' +
        'spatialRel=esriSpatialRelIntersects&' +
        'relationParam=&' +
        'outFields=Description&' +
        'returnGeometry=true&' +
        'maxAllowableOffset=&' +
        'geometryPrecision=&' +
        'outSR=4326&' +
        'gdbVersion=&' +
        'returnIdsOnly=false&' +
        'returnCountOnly=false&' +
        'orderByFields=&' +
        'groupByFieldsForStatistics=&' +
        'outStatistics=&' +
        'returnZ=false&' +
        'returnM=false&' +
        'f=json'

  http.get(query, function (result) {
    var out = ''

    result.on('data', function (data) {
      out += data
    })

    result.on('end', function () {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Length', out.length)
      
      res.send(out)
    })
  })
})

app.listen(3000)
console.log('Listening on port 3000')