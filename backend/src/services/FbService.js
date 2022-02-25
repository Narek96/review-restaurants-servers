const fetch = require('node-fetch');

class FbService {

  getUserData(userId, token) {
    if (!userId || !token) {
      throw new Error('User id and token are required')
    }
    const url = `https://graph.facebook.com/v2.10/${userId}?access_token=${token}&format=json&method=get&fields=email,first_name,last_name,name,gender,birthday,picture,address`;
    return fetch(url).then(result => result.json());
  }

}

module.exports = FbService;