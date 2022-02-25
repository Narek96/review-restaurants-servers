const BaseService = require("./BaseService");
const bcrypt = require('bcrypt');
const User = require('../models/user');


class UserService extends BaseService {

    constructor() {
        super(User);
    }
    async create(data) {
        const email = data.email.toLowerCase();
        const user = await this.getBy({ where: { email } });
        if (user) {
            throw new Error("User with such email exist.");
        }
        let password = data.password ? await bcrypt.hash(data.password, 10) : undefined;
        const dataToSave = {
            ...data,
            ...(password && { password })
        }
        return super.create(dataToSave);
    }

    async update(id, data, queryParams) {
        let password = data.password ? await bcrypt.hash(data.password, 10) : undefined;
        const dataToSave = {
            ...data,
            ...(password && { password })
        }
        return super.update(id, dataToSave, queryParams);
    }

    async getList(options) {
        const { page, limit } = options;
        const queryParams = {
            offset: (+page - 1) * +limit,
            limit: +limit
        }
        return super.getList(queryParams);
    }


}

module.exports = UserService;