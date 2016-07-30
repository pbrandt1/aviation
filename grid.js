var airports = ['CID', 'DSM', 'waukon', 'MSP', 'MDW', 'IAH', 'SAN', 'DCA', 'LGA', 'CVG', 'ORL', 'SFO', 'BUR'];
var result_type = 'distance';
var speed = 201;
if (process.argv.indexOf('-t') >= 0) {
  result_type = 'time';
  process.argv.splice(process.argv.indexOf('-t'), 1);
}
if (process.argv.indexOf('-s') >= 0) {
  var i = process.argv.indexOf('-s');
  speed = process.argv[i+1];
  process.argv.splice(i, 2);
}
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
console.log('    ' + airports.map((a, i) => ('      ' + a.LocationID).substr(-6)).join(''))

// body
airports.map((a, i) => {
  console.log(a.LocationID[colors[i%2]] + ' ' + airports.map(b => {
    if (a === b) {
      return '  --  '
    } else if (result_type === 'distance') {
      return ('      ' + Math.round(tools.distance(a, b))).substr(-6);
    } else {
      var time = tools.distance(a, b) / speed;
      var hours = time | 0;
      var minutes = Math.round((time - hours) * 60);
      return ('      ' + hours + ':' + ('00' + minutes).substr(-2)).substr(-6);
    }
  }).join('')[colors[i%2]]);
})
