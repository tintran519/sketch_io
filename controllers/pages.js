var welcome = function(req, res, next) {
  res.render('pages/index');
};

module.exports = {
  welcome: welcome
};
