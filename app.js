const express = require('express');
//const csurf = require('csurf');
//const helmet = require('helmet');
//const flash = require('connect-flash');
const session = require('express-session');
const compression = require('compression');
const exphbs = require('express-handlebars');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session);

const homeRoute = require('./routes/home');
const sportsRoute = require('./routes/sports');
const errorMiddleware = require('./middleware/error');
const config = require('./keys/config');

const app = express();
const store = MongoStore({
    collection: 'sessions',
    uri: config.MONGODB_URL
});
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: require('./utils/hbs-helpers')
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
////app.use(csurf());
//app.use(flash());
//app.use(helmet());
app.use(compression());
app.use(express.json());

app.use('/sports', sportsRoute);
app.use('/', homeRoute);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function start(){
    try {    
        await mongoose.connect(config.MONGODB_URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}..`);
        });
    }
    catch (e) {
        console.log(e);
    }
}

start();