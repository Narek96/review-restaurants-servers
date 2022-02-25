const { sequelize } = require('../connection/connection');
const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');
const User = require('../models/User');

class RestaurantsUtils {

  getParams(id) {
    const getRrviewMinMaxAvg = {
      where: { id },
      include: [
        {
          model: Review,
          as: 'reviews',
          attributes: [
            [sequelize.fn('max', sequelize.col('rate')), 'maxRate'],
            [sequelize.fn('min', sequelize.col('rate')), 'minRate'],
            [sequelize.fn('AVG', sequelize.col('rate')), 'avgRating']
          ],
        },
        {
          model: User,
          as: 'users',
          attributes: ['id', 'email', 'firstName'],
        }
      ],
      raw: true
    };

    const getlastReview = {
      where: { restaurantId: id },
      attributes: ['comment', 'commentReply', 'rate'],
      order: [['createdAt', 'DESC']],
      limit: 1,
      raw: true
    };

    return { getRrviewMinMaxAvg, getlastReview }
  }

  /*
  * Set general parameters
  */
  async setGeneralParams(reqParams) {
    const { ownerId, page, limit } = reqParams;
    let generalParams = {};

    if (ownerId) generalParams = { ownerId };

    const query = await  sequelize.query('SELECT restaurant.name, restaurant.id, restaurant.createdAt, restaurant.updatedAt, reviewrestaurants.reviews.id , AVG(reviewrestaurants.reviews.rate) AS avgRating FROM reviewrestaurants.restaurants as restaurant '
      + 'LEFT JOIN reviewrestaurants.reviews AS reviews ON restaurant.id = reviews.restaurantId group by restaurant.id order by avgRating ASC')
    
    generalParams = {
      where: { ...generalParams },
      include: [
        {
          model: Review,
          as: 'reviews',
          attributes: [[sequelize.fn('AVG', sequelize.col('rate')), 'avgRating']],
          group: ['restaurant.id'],
        },
      ],
      // order: !ownerId ? [[Review, sequelize.fn('AVG', sequelize.col('rate')), 'DESC']] : [['createdAt', 'DESC']],
      offset: (+page - 1) * +limit,
      limit: +limit,
    }
    return generalParams;
  }

}

module.exports = new RestaurantsUtils();
