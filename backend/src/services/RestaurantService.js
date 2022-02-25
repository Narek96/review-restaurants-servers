const BaseService = require('./BaseService');
const Restaurants = require('../models/Restaurant');
const restaurantUtils = require('../utils/restaurantsUtils');
const ReviewService = require('../services/ReviewService');
const { sequelize } = require('../connection/connection');

const reviewService = new ReviewService;

class RestaurantsService extends BaseService {

  constructor() {
    super(Restaurants);
  }

  async get(id) {

    const { getRrviewMinMaxAvg, getlastReview } = restaurantUtils.getParams(id);
    let record = {};
    
    record = await this.getBy(getRrviewMinMaxAvg);

    const lastReview = await reviewService.get(getlastReview);
    record.lastReview = lastReview;

    return record
  }


  async update(id, data) {

    const { getRrviewMinMaxAvg, getlastReview } = restaurantUtils.getParams(id);
    let record = {};
    record = await super.update(id, data, getRrviewMinMaxAvg);
    
    const lastReview = await reviewService.get(getlastReview);
    record.lastReview = lastReview;

    return record
  }

  async getList() {
    return await  sequelize.query('SELECT restaurant.name, restaurant.id, restaurant.createdAt, restaurant.updatedAt, reviewrestaurants.reviews.id , AVG(reviewrestaurants.reviews.rate) AS avgRating FROM reviewrestaurants.restaurants as restaurant '
    + 'LEFT JOIN reviewrestaurants.reviews AS reviews ON restaurant.id = reviews.restaurantId group by restaurant.id order by avgRating ASC',
    {raw: true})
}
}

module.exports = RestaurantsService;
