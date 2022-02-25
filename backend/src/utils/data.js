const _ = require('lodash');

const assignByProps = (obj, keys) => {
  return _.pick(obj, keys);
};

const getFileFormat = (name) => {
  const nameSplit = name.split('.');
  return nameSplit[nameSplit.length - 1];
};

module.exports = {
  assignByProps,
  getFileFormat
};
