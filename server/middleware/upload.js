const multer = require('multer');
const moment = require('moment');
const fs = require('fs');


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		//проверка ключа файла для сохранения в нужную папку
			if (file.fieldname === 'imageSrc') {
				cb(null, 'server/public/uploads');
			} else if (file.fieldname === 'image'){
				cb(null, 'server/public/images');
			} else {
				cb(null, 'server/public/avatar/');
			}
		 },
	filename: (req, file, cb) => {
		const date = moment().format('DDMMYYYY-HHmmss_SSS');
		cb(null, `${date}-${file.originalname}`);
	}
});

const fileFilter = (req, file, cb) => {

	if (file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/jpg')
	{
		cb(null, true)
	} else {
		cb(null, false)
	}
};

const limits = {
	fileSize: 1024 * 1024 * 5
};

module.exports = multer({storage, fileFilter, limits});
