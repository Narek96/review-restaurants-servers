const { sequelize } = require('../connection/connection');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

class ReviewUtils {

    getParams(id) {
        const getParamsForReview = {
            where: { id },
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'email', 'firstName'],
                },
                {
                    model: Restaurant,
                    as: 'restaurants',
                    attributes: ['id', 'name'],
                }
            ],
            raw: true
        };

        return { getParamsForReview }
    }

    /*
    * Set general parameters
    */
    setGeneralParams(reqParams) {
        const { ownerId, page, limit } = reqParams;
        let generalParams = {};

        if (ownerId) {
            generalParams = { where: ownerId };
        }

        generalParams = {
            where: { ...generalParams },
            include: [
                {
                    model: Review,
                    as: 'reviews',
                },
            ],
            order: !ownerId ? [[Review, sequelize.fn('AVG', sequelize.col('rate')), 'DESC']] : [['createdAt', 'DESC']],
            offset: (+page - 1) * +limit,
            limit: +limit,
        }
        return generalParams;
    }

}

module.exports = new ReviewUtils();
