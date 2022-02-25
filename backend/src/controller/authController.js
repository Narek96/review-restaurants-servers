const usersUtils = require('../utils/userUtils');
const { v4: uuidv4 } = require('uuid');
const { writeStatus } = require("../utils/server");
const userRoles = require('../config/auth').userRoles;
const config = require('../config');
const MailService = require('../services/MailService');
const FbService = require('../services/FbService');

const userMapper = require('../mapper/user');
const UsersService = require('../services/UserService');
const ServiceWrapperDTO = require('../services/WrapperService');

const registrationTokenMapper = require('../mapper/registrationToken');
const RegistrationTokenService = require('../services/RegistrationTokenService');

const fbService = new FbService();
const service = new UsersService;
const registrationTokensService = new RegistrationTokenService;
const userServiceDTOWrapper = new ServiceWrapperDTO(service, userMapper);
const registrationTokensServiceDTOWrapper = new ServiceWrapperDTO(registrationTokensService, registrationTokenMapper);


MailService.initialize();

exports.logIn = function (req, res, next) {
  let userInfo = userMapper.toDTO(req.user);
  res.json({
    token: usersUtils.generateToken(userInfo),
    user: userInfo
  });
};

exports.socialLogin = async function (req, res, next) {
  let { email, token, id } = req.user;
  if (!email) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Email address is required." });
  }

  try {
    let fbData = await fbService.getUserData(id, token);
    if (fbData.email === email) {
      req.user.firstName = req.user.first_name; // on object create new key name. Assign old value to this
      req.user.lastName = req.user.last_name;
      delete  req.user.first_name;
      delete req.user.last_name;
      let userData = await userServiceDTOWrapper.getBy({ email });

      if (!userData) {
        const data = {
          ...req.user,
          role: userRoles.REGULAR,
          avatar: fbData.picture.data.url,
          confirmed: true
        };
        userData = await userServiceDTOWrapper.create(data);

        if (!!userData.avatar) {
          const file = await usersUtils.downloadFile(userData);
          userData = await userServiceDTOWrapper.update(userData.id, { avatar: file.fileName }, {});
        }

      }

      let userInfo = userMapper.toDTO(userData);
      res.json({
        token: usersUtils.generateToken(userInfo),
        user: userInfo
      });
    } else {
      writeStatus(res, true, { status: config.UnauthorizedError, message: "Error with getting data, please recheck your permissions." })
    }

  } catch (err) {
    writeStatus(res, true, { status: config.ServerError, message: err.message })
  }
};

exports.register = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Email address is required." });
  }

  try {
    let userData = {
      ...req.body,
      role: userRoles.REGULAR,
      confirmed: false
    };

    const createdUser = await userServiceDTOWrapper.create(userData);

    const registrationTokenData = {
      token: uuidv4(),
      userId: createdUser.id,
      confirmed: false
    };

    const createdRegistrationToken = await registrationTokensServiceDTOWrapper.create(registrationTokenData);

    MailService.sendEmail(
      createdUser.email,
      'New User Registration Confirmation',
      `Press: <a href="${config.webUrl}/auth/confirm-registration/${createdRegistrationToken.token}"> here </a>to verify your email.`
    );
    writeStatus(res, false, { success: true, message: 'Confirmation email has been sent' })
  } catch (err) {
    return writeStatus(res, true, { status: config.BadRequestError, message: err.message })
  }
}


exports.confirmRegistrationToken = async function (req, res) {
  let token = req.params.token;

  if (!token) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Registration Token is not selected." });
  }

  try {
    const userId = await registrationTokensService.tryConfirm(token);
    if (!userId) {
      return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Invalid token." })
    }
    const user = await userServiceDTOWrapper.update(userId, { confirmed: true }, {});

    return writeStatus(res, false, { token: usersUtils.generateToken(user), user })
  } catch (err) {
    return writeStatus(res, true, { status: config.ServerError, message: "Error with getting data, please recheck your permissions." })
  }
};