const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://lucas:' + process.env.MONGO_ATLAS_PW + '@cluster0-shard-00-00-h3os0.mongodb.net:27017,cluster0-shard-00-01-h3os0.mongodb.net:27017,cluster0-shard-00-02-h3os0.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{useNewUrlParser: true})
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Acces-Control-Allow-Mrthods', 'PUT, POST, PATH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//el request va a entrar al rout que le pertenece. Va a ir a la pagina product,order o user y ahi sigue...
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);


//una vez que paso los otros request si no encuentra nada entra en este error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

//va a tomar cada error que no toma el anterior
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
})

module.exports = app;