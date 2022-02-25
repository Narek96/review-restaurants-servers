const { assignByProps } = require('../utils/data');


function toDTO(model) {
  return {
    _id: model._id,
    token: model.token,
    userId: model.userId,
    confirmed: model.confirmed,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt
  };
}

function fromDTO(dto) {
  const props = [
    'token',
    'userId',
    'confirmed'
    ];

  return assignByProps(dto, props);
}

module.exports = {
  fromDTO,
  toDTO
};
