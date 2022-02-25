const _ = require('lodash');

class WrapperSerivice {
  constructor(service, mapper) {
    this.service = service;
    this.mapper = mapper;
  }

  async get(id) {
    const model = await this.service.get(id);
    return model && this.toDTO(model);
  }

  async create(...args) {
    const dataFromDTO = this.fromDTO(...args, 'create');
    const model = await this.service.create(dataFromDTO);
    return this.toDTO(model);
  };

  async getBy(...args) {
    const model = await this.service.getBy(...args);
    return model && this.toDTO(model);
  }

  async getList(...args) {
    const model = await this.service.getList(...args);
    const data = this.convertAll(model?.rows || {});
    return { ...data, count: model.count }
  }

  async update(id, data, queryParams) {
    const dataFromDTO = this.fromDTO(data);
    const model = await this.service.update(id, dataFromDTO, queryParams);
    return this.toDTO(model);
  };

  toDTO(...args) {
    return this.mapper.toDTO(...args)
  }

  fromDTO(...args) {
    return this.mapper.fromDTO(...args)
  }

  convertAll(data) {
    if (!Array.isArray(data)) {
      throw "Data should be array";
    }
    return { ...data.map((item) => this.toDTO(item)) }
  }
}

module.exports = WrapperSerivice;