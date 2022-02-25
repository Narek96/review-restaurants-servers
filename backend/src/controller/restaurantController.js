const { writeStatus } = require('../utils/server');
const RestaurantsUtils = require('../utils/restaurantsUtils');
const config = require('../config');
const userRoles = require('../config/auth').userRoles;
const RestaurantsService = require('../services/RestaurantService');
const WrapperDTO = require('../services/WrapperService');
const mapper = require('../mapper/restaurant');

const service = new RestaurantsService;
const serviceDTOWrapper = new WrapperDTO(service, mapper);

/*
 * Get list of restaurants
 */
exports.getRestaurants = async function (req, res) {
  let reqParams = req.query;
  if (req.user.role === userRoles.OWNER) {
    reqParams.ownerId = req.user.id;
  }

  try {
    const result = await serviceDTOWrapper.getList();
    writeStatus(res, false, { data: result })
  } catch (err) {
    console.log(err)
    writeStatus(res, true, { status: config.ServerError, message: "Error with getting data, please recheck your permissions." })
  }
};

/*
 * Create a restaurant
 */
exports.createRestaurant = async function (req, res) {
  let { ownerId, name } = req.body;
  if (req.user.role !== userRoles.ADMIN) {
    ownerId = req.user.id;
  }
  if (!ownerId) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Owner is required." });
  }
  if (!name) {
    return writeStatus(res, true, { status: config.BadRequestError, message: "Bad Request. Name is required." });
  }

  try {
    const createdRestaurant = await serviceDTOWrapper.create(req.body);
    writeStatus(res, false, { data: createdRestaurant })
  } catch (err) {
    writeStatus(res, true, { status: config.ServerError, message: err.message })
  }
};


/*
 * Get specific restaurant by id
 */

exports.getRestaurant = async function (req, res) {
  let id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {status: config.BadRequestError, message: 'Bad Request. Restaurant is not selected'});
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
 * Update the restaurant
 */
exports.updateRestaurant = async function (req, res) {
  let id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {status: config.BadRequestError, message: "Bad Request. Restaurant is not selected."});
  }

  const rowData = {...req.body};
  if (req.user.role !== userRoles.ADMIN) {
    delete rowData.ownerId;
  }

  try {
    const result = await serviceDTOWrapper.update(id, rowData);
    writeStatus(res, false, {data: result})
  } catch (err) {
    writeStatus(res, true, {status: config.ServerError, message: "Error with getting data, please recheck your permissions."})
  }
};


/*
 * Delete restaurant
 */
exports.deleteRestaurant = async function (req, res) {
  let id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {status: config.BadRequestError, message: "Bad Request. Restaurant is not selected."});
  }
  try {
    const result = await service.delete(id);
    writeStatus(res, false, {data: result})
  } catch (err) {
    writeStatus(res, true, {status: config.ServerError, message: "Error with getting data, please recheck your permissions."})
  }
};
