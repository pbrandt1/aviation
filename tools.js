

// distance formula
// C3 = lat1, D3 = lon1, G2 = lat2, G3 = lon2
//=ACOS(SIN((90-Constants!$C3)*PI()/180) * SIN((90-Constants!G$2)*PI()/180) * COS(Constants!$D3*PI()/180 - Constants!G$3*PI()/180) + COS((90-Constants!$C3)*PI()/180)*COS((90-Constants!G$2)*PI()/180))*3960


var distance = module.exports.distance = function(a, b) {
  var ACOS = Math.acos;
  var SIN = Math.sin;
  var COS = Math.cos;
  var PI = Math.PI;
  return ACOS(SIN((90-a.lat)*PI/180) * SIN((90-b.lat)*PI/180) * COS(a.lon*PI/180 - b.lon*PI/180) + COS((90-a.lat)*PI/180)*COS((90-b.lat)*PI/180))*3960;
}

if (!module.parent) {
  var places = require('./data').places;
  var a = places[0];
  for (var i = 1; i < places.length; i++) {
    var b = places[i];
    console.log(a.name, '✈︎', b.name, ':', distance(a, b));
  }
}
