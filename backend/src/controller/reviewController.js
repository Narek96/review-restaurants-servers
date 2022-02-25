const { writeStatus } = require('../utils/server');
const RestaurantsUtils = require('../utils/reviewUtils');
const config = require('../config');
const userRoles = require('../config/auth').userRoles;
const ReviewService = require('../services/ReviewService');
const WrapperDTO = require('../services/WrapperService');
const mapper = require('../mapper/review');

const service = new ReviewService;
const serviceDTOWrapper = new WrapperDTO(service, mapper);

/*
 * Create a review
 */
exports.createReview = async function (req, res) {
  let { restaurantId, rate } = req.body;
  if (!restaurantId) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Restaurant is required." });
  }
  if (!rate) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Rate is required." });
  } else if (!parseInt(rate) || parseInt(rate) < 0 || parseInt(rate) > 5) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. The value of the rate should be a number between 0 and 5" });
  }

  const reviewData = { ...req.body, ...{ reviewerId: req.user.id } };

  try {
    const createdReview = await serviceDTOWrapper.create(reviewData);
    writeStatus(res, false, { data: createdReview });
  } catch (err) {
    writeStatus(res, true, { status: config.ServerError, message: err.message })
  }
};

/*
 * Get specific review by id
 */

exports.getReview = async function (req, res) {
  let id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {status: config.BadRequestError, message: 'Bad Request. Review is not selected'});
  }

  try {
    const result = await serviceDTOWrapper.get(id);
    if (!result) {
      writeStatus(res, true, {status: config.NotFoundStatus, message: "Error with getting data, please recheck your permissions."});
      return
    }
    writeStatus(res, false, {data: result})
  } catch (err) {
    console.log(err)
    writeStatus(res, true, {status: config.ServerError, message: "Error with getting data, please recheck your permissions."})
  }
};

/*
 * Update the review
 */
exports.updateReview = async function (req, res) {
  let id = req.params.id;
  let data = {...req.body};

  if (!id) {
    return writeStatus(res, true, {status: config.BadRequestError, message: "Bad Request. Review is not selected."});
  }

  if (req.user.role !== userRoles.OWNER) {
    delete data.commentReply;
  }

  try {
    const result = await serviceDTOWrapper.update(id, data);
    writeStatus(res, false, {data: result})
  } catch (err) {
    console.log(err)
    writeStatus(res, true, {status: config.ServerError, message: "Error with getting data, please recheck your permissions."})
  }
};


/*
 * Delete review
 */
exports.deleteReview = async function (req, res) {
  let id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {status: config.BadRequestError, message: "Bad Request. Review is not selected."});
  }

  try {
    const result = await service.delete(id);
    writeStatus(res, false, {data: result})
  } catch (err) {
    writeStatus(res, true, {status: config.ServerError, message: "Error with getting data, please recheck your permissions."})
  }
};