const BaseService = require('./BaseService');
const Review = require('../models/Review');
const reviewUtils = require('../utils/reviewUtils');
const _ = require('lodash');

class ReviewService extends BaseService {

  constructor() {
    super(Review);
  }

  async get(id) {

    const { getParamsForReview } = reviewUtils.getParams(id);
    let record = {};
    
    record = await this.getBy(getParamsForReview);

    return record
  }

  async update(id, data) {

    const { getParamsForReview } = reviewUtils.getParams(id);
    let record = {};
    await super.update(id, data, getParamsForReview);
    
    record = await this.getBy(getParamsForReview);

    return record
  }


}
module.exports = ReviewService;
