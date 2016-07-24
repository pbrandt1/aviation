var place = {
  lat: 29.5482605,
  lon: -95.0948881,
};

var data = require('./data');
var tools = require('./tools');

var closest = data.airports.filter(a => {
  return a.Type === 'AIRPORT' && a.OtherServices && a.OtherServices.indexOf('RNTL') >= 0;
}).map(a => {
  a.dist = tools.distance(a, place);
  return a;
}).sort((a, b) => {
  return a.dist - b.dist;
}).slice(0, 6).map(a => {
  return {
    id: a.LocationID,
    name: a.FacilityName,
    dist: a.dist,
    addr: `${a.City}, ${a.State}`
  }
})

console.log(closest);
