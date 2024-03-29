if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({path: 'server/.env'});

const connectDB = require('./config/db');
const express = require('express');
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

const { me } = require('./middleware/authVerify');
//routes
const authRouter = require('./routes/authRouter');
const userProfile = require('./routes/userProfile');
const categoryRouter = require('./routes/categoryRouter');
const productRouter = require('./routes/productRouter');
const contactsRouter = require('./routes/contactsRouter');
const cartRouter = require('./routes/cartRouter');
const imgWithCaptionRouter = require('./routes/imgWithCaptionRouter');
const textBlockRouter = require('./routes/textBlockRouter');
const bannerRouter = require('./routes/bannerRouter');
const stripeRouter = require('./routes/stripeRouter');
const orderRouter = require('./routes/orderRouter');

const app = express();

connectDB();


app.use(morgan('dev'));
//если не загружать изображения в локал сторедж, то строка ниже не нужна
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use('/public/avatar', express.static(__dirname + '/public/avatar'));
app.use('/public/images', express.static(__dirname + '/public/images'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

//routes
app.get('/api', me, async (req, res) => {
	res.json({message: 'work'});
}); 
app.use('/api', authRouter);
app.use('/api/user', userProfile);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', contactsRouter);
app.use('/api', cartRouter);
app.use('/api', imgWithCaptionRouter);
app.use('/api', textBlockRouter);
app.use('/api', bannerRouter);
app.use('/api', stripeRouter);
app.use('/api', orderRouter);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'PRODUCTION') {
	app.use(express.static( path.join(__dirname, '../client/build' )));

	app.get('*', (req, res) =>  {
		res.sendFile(path.resolve( __dirname, '../client/build/index.html' ));
	});
}

const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err, promise) => {
	console.log(`Logged Error: ${err}`);
	server.close(() => process.exit(1));
});