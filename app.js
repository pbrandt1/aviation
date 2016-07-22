var co = require('co')

var distances = require('./distances')
var data = require('./data')
var err = require('./err')

console.log('num airports:', data.airports.length);
// look for Ellington
// var Ellington = airports.filter(a => {
//   return (a.FacilityName || '').match(/\bellington/i) && a.City === 'HOUSTON';
// })[0];
//
// console.log(Ellington);
//
// console.log(airports.filter(a => {
//   return a.FacilityName !== 'ELLINGTON' && a.City !== 'HOUSTON' && a.Use === 'PU';
// }).map(a => {
//   a.dist_from_ellington = distances.distance(a, Ellington);
//   return a;
// }).sort((a, b) => {
//   return a.dist_from_ellington - b.dist_from_ellington;
// }).slice(0, 10));

console.log('calculating the distance between IAH and SAN');
console.log('Distance from IAH to SAN is', distances.distance(data.codes.IAH, data.codes.SAN));
