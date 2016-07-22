module.exports.places = [{
  name: 'NASA Johnson (Ellington)',
  lat: 29.5819135,
  lon: -95.18547
}, {
  name: 'Cedar Rapids',
  lat: 41.886386,
  lon: -91.706975
}, {
  name: 'College Park',
  lat: 38.9699022,
  lon: -76.9353331
}, {
  name: 'South Bend',
  lat: 41.706954,
  lon: -86.322464
}];

var fs = require('fs');
var csv = fs.readFileSync(__dirname + '/sql/NfdcFacilities.csv', 'utf8')
var headers = csv.split('\n')[0].split(',');
var airports = csv.split('\n').slice(1).map(r => {
  var in_quote = false;
  var val = '';
  var array = [];
  for (var i = 0; i < r.length; i++) {
    if (r[i] === ',' && !in_quote) {
      array.push(val);
      val = '';
    } else if (r[i] === '"') {
      in_quote = !in_quote;
      val += '"'
    } else {
      val += r[i];
    }
  }
  return array;
}).filter(Boolean).map(r => {
  var obj = r.reduce((obj, v, i) => {
    if (v) {
      obj[headers[i]] = v.replace(/"/g, '')
    }
    if (headers[i] === 'ARPLatitude') {
      obj.lat = dms2lat(v);
    } else if (headers[i] === 'ARPLongitude') {
      obj.lon = dms2lon(v);
    }
    return obj;
  }, {});
  return obj;
})


// turns 43-01-2.13412N into a single +/- decimal
function dms2lat(dms) {
  return dms.split('-').reduce((lat, v, i) => {
    if (i === 0) { return +v }
    else if (i === 1) { return lat + v/60}
    else {
      var sign = v.slice(-1) === 'N' ? 1 : -1;
      return sign * (lat + v.substr(0, v.length - 1)/3600);
    }
  }, 0)
}

// turns 43-01-2.13412N into a single +/- decimal
function dms2lon(dms) {
  return dms.split('-').reduce((lat, v, i) => {
    if (i === 0) { return +v }
    else if (i === 1) { return lat + v/60}
    else {
      var sign = v.slice(-1) === 'E' ? 1 : -1;
      return sign * (lat +v.substr(0, v.length - 1)/3600);
    }
  }, 0)
}

module.exports.airports = airports;

var codes = module.exports.codes = airports.reduce((codes, a) => {
  if (a.IcaoIdentifier)
    codes[a.LocationID] = a;
  return codes;
}, {})

var find = module.exports.find = function(q) {
  if (codes[q.toUpperCase()]) {
    return codes[q.toUpperCase()];
  }

  var regexp = new RegExp(q, 'i');

  results = airports.filter(a => {
    return a.FacilityName && a.FacilityName.match(regexp);
  })

  if (results.length === 1) {
    return results[0];
  } else if (results.length > 1) {
    results = results.filter(r => {
      return r.Type === 'AIRPORT' && r.City.match(regexp);
    });
    if (results.length === 1) {
      return results[0];
    }
  }

  results = airports.filter(a => {
    return JSON.stringify(a).match(regexp);
  }).sort((a, b) => {
    return JSON.stringify(a).match(new RegExp(q, 'ig')).length - JSON.stringify(b).match(new RegExp(q, 'ig')).length;
  })

  if (results.length >= 1) {
    return results.pop();
  }
}

if (!module.parent) {
  var q = process.argv[2];
  console.log(find(q));
}
