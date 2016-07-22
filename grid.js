var airports = ['CID', 'DSM', 'MSP', 'MDW', 'IAH', 'SAN', 'DCA', 'LGA', 'CVG', 'ORL', 'SFO', 'BUR'];
var tools = require('./tools');
var data = require('./data');

// header
console.log('    ' + airports.map(a => ('     ' + a).substr(-5)).join(''))

// body
airports.map(a => {
  console.log(a + ' ' + airports.map(b => {
    if (a === b) {
      //      1200
      return '     '
    } else {
      return ('     ' + Math.round(tools.distance(data.codes[a], data.codes[b]))).substr(-5);
    }
  }).join(''));
})
