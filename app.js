var co = require('co')

var distances = require('./distances')
var data = require('./data')
var err = require('./err')

co(function*() {
  var airports = yield data.airports();
  console.log('num airports:', airports.length);
  // look for Ellington
  var Ellington = airports.filter(a => {
    return (a.FacilityName || '').match(/\bellington/i) && a.City === 'HOUSTON';
  })[0];

  console.log(Ellington);

  console.log(airports.filter(a => {
    return a.FacilityName !== 'ELLINGTON' && a.City !== 'HOUSTON' && a.Use === 'PU';
  }).map(a => {
    a.dist_from_ellington = distances.distance(a, Ellington);
    return a;
  }).sort((a, b) => {
    return a.dist_from_ellington - b.dist_from_ellington;
  }).slice(0, 10));

  console.log('calculating the distance between IAH and SAN');
  var codes = yield data.codes();
  console.log('Distance from IAH to SAN is', distances.distance(codes.IAH, codes.SAN));

}).catch(err);
