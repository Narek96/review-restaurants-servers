
class BaseService {

  constructor(model) {
    this.model = model;
  }

  get(id) {
    return this.getBy({ where: { id } });
  }

  async getBy(params) {
    const promise = this.model.findOne(params);
    const model = await promise;
    if (!model) {
      return null;
    }
    return model;
  };

  async create(data) {
    return await this.model.create(data);
  };

  async getList(options) {
    return await this.model.findAndCountAll({
      ...options
    })
  }

  async delete(id) {
    const instance = await this.getBy({ where: { id } });
    return await instance.destroy();
  }

  async update(id, data, queryParams) {
    let params = { where: { id } };
    await this.model.update(data, params);
    params = queryParams ? queryParams : params;
    return await this.getBy(params);
  };
}

module.exports = BaseService;
