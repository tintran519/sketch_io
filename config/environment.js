var _ = require('lodash');

var localEnvVars = {
  TITLE:      'sketch_io',
  SAFE_TITLE: 'sketch_io'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
