'use strict';

const { SuccessResponse } = require('../core/success.response');
const { uploadService } = require('../services/upload.services');

class UPLOADCONTROLLER {
      upLoadImgFile = async (req, res, next) => {
            new SuccessResponse({
                  message: 'Upload image success',
                  metaData: await uploadService(req.file),
            }).send(res);
      };
}

module.exports = new UPLOADCONTROLLER();
