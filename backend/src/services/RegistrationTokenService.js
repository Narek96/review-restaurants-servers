const BaseService = require('./BaseService');
const RegistrationTokens = require('../models/registrationTokens');

class RegistrationTokensService extends BaseService {
  constructor() {
    super(RegistrationTokens);
  }


  async tryConfirm(token) {
    const registrationToken = await this.getBy({ token });
    if (!registrationToken) {
      return false;
    }
    await super.delete(registrationToken.id);
    return registrationToken.userId;
  }
}

module.exports = RegistrationTokensService;
