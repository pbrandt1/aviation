module.exports = function(e) {
  if (e.stack) {
    console.log(e.stack);
  } else {
    console.log(e);
  }
}
