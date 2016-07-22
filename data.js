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

var promisify = require('promisify-node');
var fs = promisify(require('fs'));
var airports = function*() {
  var csv = yield fs.readFile(__dirname + '/sql/NfdcFacilities.csv', 'utf8');
  var headers = csv.split('\n')[0].split(',');

  return csv.split('\n').slice(1).map(r => {
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

}

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

module.exports.codes = function *() {
  var data = yield airports();
  return data.reduce((codes, a) => {
    codes[a.NOTAMFacilityID] = a;
    return codes;
  }, {})
}

if (!module.parent) {

  var co = require('co');
  co(function*() {
    var a = yield airports();
    console.log(a.filter(p => {
      return p.NOTAMFacilityID === 'CID';
    }));


  }).catch(console.error.bind(console));
}
