require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const path = require('path');
const { logger } = require('./configs/config.logger');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const expressWinston = require('express-winston');
const { is404Handler, returnError } = require('./middlewares/errorHandler');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(
      helmet.contentSecurityPolicy({
            directives: {
                  scriptSrc: ["'self'"],
                  styleSrc: ["'self'"],
            },
      }),
);
// x content type options
app.use(helmet.noSniff());
// x xss protection
app.use(helmet.xssFilter());
// referrer policy
app.use(
      helmet.referrerPolicy({
            policy: 'no-referrer',
      }),
);
app.use(
      compression({
            level: 6, // level compress
            threshold: 100 * 1024, // > 100kb threshold to compress

            filter: (req) => {
                  return !req.headers['x-no-compress'];
            },
      }),
);

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
      expressWinston.logger({
            winstonInstance: logger,
            statusLevels: true,
      }),
);

// Check file type
function checkFileType(file, cb) {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
            return cb(null, true);
      } else {
            cb('Error: Images Only!');
      }
}

app.use('/v1/api', require('./routes/index'));

app.use(is404Handler);
app.use(returnError);

module.exports.handler = serverless(app);
module.exports = app;
