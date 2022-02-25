require('dotenv-flow').config();


module.exports = {
    db: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
    },
    serverPort: process.env.SERVER_PORT,
    webUrl: process.env.WEB_URL,
    fbClient: process.env.FB_CLIENT_ID,
    fbSecret: process.env.FB_CLIENT_SECRET,
    BadRequestError: 400,
    UnauthorizedError: 401,
    ForbiddenError: 403,
    NotFoundStatus: 404,
    ServerError: 500,
    mailServer: {
        from: 'narek.test123@gmail.com',
        host: 'smtp.gmail.com',
        auth: {
            user: 'narek.test123@gmail.com',
            pass: 'toxmtnem123',
        }
    },
    allowedProfileImageFormats: [
        'png',
        'jpg',
        'jpeg'
    ]
};
