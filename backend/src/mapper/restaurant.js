const { assignByProps } = require('../utils/data');
const _ = require('lodash');

function toDTO(model) {
  const record = _.has(model, 'record') ? model.record : model;

  return {
    id: record.id,
    name: record.name,
    ownerId: record.ownerId,
    ownerEmail: record['users.email'],
    highestRatedReview: record['reviews.maxRate'],
    lowestRatedReview: record['reviews.maxRate'],
    avgRateing: record['reviews.avgRating'],
    lastReview: record.lastReview,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function fromDTO(dto) {
  const props = [
    'ownerId',
    'name'
    ];

  return assignByProps(dto, props);
}


module.exports = {
  fromDTO,
  toDTO
};
