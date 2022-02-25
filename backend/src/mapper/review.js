const { assignByProps } = require('../utils/data');
const _ = require('lodash');


function toDTO(model) {
  return {
    id: model.id,
    name: model.name,
    comment: model.comment,
    commentReply: model.commentReply,
    visitDate: model.visitDate,
    rate: model.rate,
    restaurantId: model.restaurantId,
    restaurantName: model['restaurants.name'],
    ownerEmail: model['users.email'],
    ownerName: model['users.firstName'],
    createdAt: model.createdAt,
    updatedAt: model.updatedAt
  };
}

function fromDTO(dto) {
  const props = [
    'reviewerId',
    'restaurantId',
    'rate',
    'visitDate',
    'comment',
    'commentReply'
    ];

  return assignByProps(dto, props);
}

module.exports = {
  fromDTO,
  toDTO
};
