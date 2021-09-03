const Product = require('../models/product');
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl)
    product.save()
        .then(result => {
            console.log('created product')
            res.redirect('/admin/products')
        }).catch(err => console.log(err))
    // const product = new Product(null, title, imageUrl, description, price);
    // product.save().then(() => {
    //     res.redirect('/');
    // }).catch(err => console.log(err));

};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    try {
        const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, new ObjectId(prodId))
        product.save().then(result => {
            console.log('updated product')
            res.redirect('/admin/products')
        })

    } catch (err) {
        console.log(err)
    }

};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        }).catch(err => console.log(err))
};

exports.postDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        await Product.deleteById(prodId)
        console.log('deleted product')
        res.redirect('/admin/products')

    } catch (err) {
        console.log(err)
    }
};
