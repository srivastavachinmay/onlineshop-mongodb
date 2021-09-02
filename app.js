const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./src/controllers/error');
const sequelize = require('./src/util/database')
const User = require('./src/models/user')
const Product = require('./src/models/product');
const Cart = require('./src/models/cart');
const CartItem = require('./src/models/cart-item');
const Order = require('./src/models/order');
const OrderItem = require('./src/models/order-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => {
            console.log(err)
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// ************Associations*************

Product.belongsTo(User, {
    constrainsts: true,
    onDelete: 'CASCADE'
})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, {through: OrderItem})

// **************************************
let existingUser;
sequelize
    .sync()
    // .sync({ force: true }) // only for production and development
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({name: "max", email: "test@test.com"})
        }
        return user
    })
    .then(user => {
        // console.log(user)
        existingUser = user
        return Cart.findAll({
            where: {
                userId: 1
            }
        })


    }).then(carts => {
    let cart = carts[0]
    if (!cart) {
        return existingUser.createCart()
    }
    return cart
}).then(cart => {
    app.listen(3000)
}).catch(err => console.log(err))
