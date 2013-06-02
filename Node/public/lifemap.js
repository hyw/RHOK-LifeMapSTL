var buckets = { 
  assault: [
    'agg.assault',
    'assault',
    'asslt',
    'homicide',
    'simple assault' ],
  theft: [
    'auto theft',
    'burglary',
    'larceny',
    'larc',
    'robbery',
    'stolen property' ],
  sex: [
    'sex offns',
    'rape',
    'prostitution' ],
  white_collar: [
    'embezzlement',
    'fraud',
    'health',
    'forgery' ],
  other: [
    'weapons',
    'stalking',
    'public order',
    'obstruct govrn op',
    'liquor laws',
    'leaving scene of accident',
    'dui' ]
}

function determineGridPosition(lng, lat) {
  var minLng      = parseFloat($('#minx').val()),
      minLat      = parseFloat($('#miny').val()),
      resolution  = parseFloat($('#resolution').val()),
      distanceLat = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(minLat, lng), 
        new google.maps.LatLng(lat,    lng), 
        3956.6
      ),
      distanceLng = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(lat, minLng), 
        new google.maps.LatLng(lat, lng), 
        3956.6
      )

  console.log('X: %s, Y: %s', Math.floor(distanceLat / resolution), Math.floor(distanceLng / resolution))
  // console.log('Y %s %s', minLng, lng)
  // console.log('Grid Lat:%s, Lng:%s', distanceLat / resolution, distanceLng / resolution)
}

$('#mapper').on('submit', function () {
  $.get('http://localhost:3000/crime', {
    minX: $('#minx').val(),
    minY: $('#miny').val(),
    maxX: $('#maxx').val(),
    maxY: $('#maxy').val()
  }, function (result, status) {
    var categories = { assault: 0, theft: 0, sex: 0, white_collar: 0, other: 0 },
        minX = 0,
        minY = 100,
        maxX = -100,
        maxY = 0

    result.features.forEach(function (crime) {
      var cat = crime.attributes.Description.split('-'),
          geo = crime.geometry

      if (geo.x < minX)
        minX = geo.x
      else if (geo.x > maxX)
        maxX = geo.x
      
      if (geo.y < minY)
        minY = geo.y
      else if (geo.y > maxY)
        maxY = geo.y      

      for (var b in buckets)
        if (buckets.hasOwnProperty(b))
          buckets[b].forEach(function (bucket) {
            if (cat[0].toLowerCase().indexOf(bucket) > -1)
              ++categories[b]
          })

      determineGridPosition(geo.x, geo.y)
    })

    console.log(categories)
    console.log('Min X:', minX)
    console.log('Min Y:', minY)
    console.log('Max X:', maxX)
    console.log('Max Y:', maxY)
  })

  return false
})