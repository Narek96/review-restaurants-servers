const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const fs = require('fs');
const https = require('https');
const path = require('path');

class UsersUtils {

  generateToken(user) {
    return jwt.sign(
      user,
      authConfig.secret,
      {
        expiresIn: parseInt(authConfig.tokenExpiresIn)
      }
    );
  }

  downloadFile(userData) {
    const folderPath = path.resolve(process.env.SERVE_FOLDER);
    const fileName = `${userData.id}.jpg`;
    const dest = `${folderPath}/${fileName}`;
    const file = fs.createWriteStream(path.resolve(dest));
    return new Promise(function (resolve, reject) {
      https.get(userData.avatar, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          file.close(() => resolve({ ...file, ...{ fileName: fileName } }));
        });

      }).on('error', function (err) {
        fs.unlink(dest);
        reject(err)
      });
    });
  }
}

module.exports = new UsersUtils();
