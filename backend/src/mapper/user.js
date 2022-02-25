const { assignByProps } = require('../utils/data');

function toDTO(model) {
  return {
    id: model.id,
    email: model.email.toLowerCase(),
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    role: model.role,
    avatar: model.avatar,
    firstName: model.firstName || model.first_name,
    lastName: model.lastName || model.last_name,
    confirmed: model.confirmed,
  };
}


function fromDTO(dto, type) {
  const props = [
    'email',
    'password',
    'role',
    'firstName',
    'lastName',
    'confirmed',
    'avatar'
    ];

  if (type === 'create') {
   props.push('password');
  }

  return assignByProps(dto, props);
}

module.exports = {
  fromDTO,
  toDTO
};
