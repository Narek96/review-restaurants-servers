const { writeStatus } = require("../utils/server");
const path = require('path');
const config = require('../config');
const userRoles = require('../config/auth').userRoles;
const UsersService = require('../services/UserService');
const WrapperDTO = require('../services/WrapperService');
const mapper = require('../mapper/user');
const { getFileFormat } = require('../utils/data');

const service = new UsersService;
const serviceDTOWrapper = new WrapperDTO(service, mapper);

/*
 * Create a user
 */
exports.createUser = async function (req, res) {
    let { email, role } = req.body;
    if (!email) {
        return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Email address is required." });
    }

    try {
        let userData = {
            ...req.body,
            role: role || userRoles.REGULAR,
            confirmed: true
        };
        const createdUser = await serviceDTOWrapper.create(userData);
        writeStatus(res, false, { data: createdUser })
    } catch (err) {
        writeStatus(res, true, { status: config.ServerError, message: err.message })
    }
};

/*
* Get specific user by id
*/

exports.getUser = async function (req, res) {
    let id = req.params.id;

    if (!id) {
        return writeStatus(res, true, { status: config.BadRequestError, message: 'Bad Request. User is not selected' });
    }
    try {
        const result = await serviceDTOWrapper.get(id);
        if (!result) {
            writeStatus(res, true, { status: config.NotFoundStatus, message: "Error with getting data, please recheck your permissions." });
            return
        }
        writeStatus(res, false, { data: result })
    } catch (err) {
        writeStatus(res, true, { status: config.ServerError, message: "Error with getting data, please recheck your permissions." })
    }
};

/*
 * Update the user
 */
exports.updateUser = async function (req, res) {
    let id = req.params.id;

    if (!id) {
        return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. User is not selected." });
    }

    try {
        const result = await serviceDTOWrapper.update(id, req.body, {});
        writeStatus(res, false, { data: result })
    } catch (err) {
        console.log(err)
        writeStatus(res, true, { status: config.ServerError, message: "Error with getting data, please recheck your permissions." })
    }
};


/*
 * Change user password
 */
exports.changeUserPassword = async function (req, res) {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!id) {
        return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. User is not selected." });
    }

    if (!currentPassword) {
        return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Current Password is required." });
    }

    if (!newPassword) {
        return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. New Password is required." });
    }

    try {
        const user = await service.getBy({ where: { id } });
        if (!user) {
            return writeStatus(res, true, { status: config.NotFoundStatus, message: "" });
        }
        const passwordIsMatch = await user.validPassword(currentPassword);
        if (!passwordIsMatch) {
            return writeStatus(res, true, { status: config.ForbiddenError, message: "Error with getting data, please recheck your permissions." })
        }
        const result = await serviceDTOWrapper.update(id, { password: newPassword }, {});
        writeStatus(res, false, { data: result })
    } catch (err) {
        console.log(err)
        writeStatus(res, true, { status: config.ServerError, message: "Error with getting data, please recheck your permissions." })
    }
};

/*
 * Change user profile image
 */
exports.changeUserProfileImage = async function (req, res) {
    const id = req.params.id;
    const file = req.file;
    const format = getFileFormat(file.filename);
    if (!config.allowedProfileImageFormats.includes(format)) {
        return writeStatus(res, true, { status: config.BadRequestError, message: `The image format should be one of the followings: ${config.allowedProfileImageFormats.join(', ')}.` });
    }
    const folderPath = path.resolve(process.env.SERVE_FOLDER);
    const result = await serviceDTOWrapper.update(id, { avatar: `${folderPath}\\${file.filename}` }, {});
    writeStatus(res, false, { data: result, message: 'Image was uploaded.' });
};


/*
 * Delete user
 */
exports.deleteUser = async function (req, res) {
    let id = req.params.id;

    if (!id) {
        return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. User is not selected." });
    }

    try {
        const result = await service.delete(id);
        writeStatus(res, false, { data: result })
    } catch (err) {
        writeStatus(res, true, { status: config.ServerError, message: "Error with getting data, please recheck your permissions." })
    }
};

/*
 * Get list of users
 */
exports.getUsers = async function (req, res) {
    let reqParams = req.query;

    try {
        const result = await serviceDTOWrapper.getList(reqParams);
        writeStatus(res, false, { data: result })
    } catch (err) {
        writeStatus(res, true, { status: config.ServerError, message: "Error with getting data, please recheck your permissions." })
    }
};
