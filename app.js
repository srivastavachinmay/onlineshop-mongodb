const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./src/controllers/error');
const mongoConnect = require('./src/util/database').mongoConnect
const User = require('./src/models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6132205d8a287863dcc7fa14')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {

    app.listen(3000)
})