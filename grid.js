var airports = ['CID', 'DSM', 'waukon', 'MSP', 'MDW', 'IAH', 'SAN', 'DCA', 'LGA', 'CVG', 'ORL', 'SFO', 'BUR'];
if (process.argv.length > 2) {
  airports = process.argv.slice(2);
}
var tools = require('./tools');
var data = require('./data');
require('colors');

airports = airports.map(a => {
  var airport = data.find(a);
  if (!airport) {
    console.error('could not find airport to match', a);
    process.exit(1);
  }
  if (airport.LocationID !== a.toUpperCase()) {
    console.log(a.yellow, 'is', airport.LocationID.cyan)
  }
  return airport;
})

var colors = ['cyan', 'white'];

// header
console.log('    ' + airports.map((a, i) => ('     ' + a.LocationID).substr(-5)).join(''))

// body
airports.map((a, i) => {
  console.log(a.LocationID[colors[i%2]] + ' ' + airports.map(b => {
    if (a === b) {
      //      1200
      return '    -'
    } else {
      return ('     ' + Math.round(tools.distance(a, b))).substr(-5);
    }
  }).join('')[colors[i%2]]);
})
