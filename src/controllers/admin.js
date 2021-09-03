const Product = require('../models/product');

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
    const product = new Product(title,price,description,imageUrl)
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
    req.user.getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then(products => {
        const product = products[0]
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

exports.postEditProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    // Product.findByPk(prodId).then(product => {
    //     product.update({
    //         title: updatedTitle,
    //         price: updatedPrice,
    //         imageUrl: updatedImageUrl,
    //         description: updatedDesc
    //     }).then(result => {
    //         console.log('updated product')
    //         res.redirect('/admin/products')
    //     })
    // }).catch(err => console.log(err))
    try {
        const product = await Product.findByPk(prodId)
        await product.update({
            title: updatedTitle,
            price: updatedPrice,
            imageUrl: updatedImageUrl,
            description: updatedDesc
        })
        console.log('updated product')
        res.redirect('/admin/products')

    } catch (err) {
        console.log(err)
    }

};

exports.getProducts = (req, res, next) => {

    // Product.findAll()
    req.user.getProducts()
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(err => console.log(err))
    // Product.fetchAll(products => {
    //     res.render('admin/products', {
    //         prods: products,
    //         pageTitle: 'Admin Products',
    //         path: '/admin/products'
    //     });
    // });
};

exports.postDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
        const product = await Product.findByPk(prodId)
        await product.destroy()
        console.log('deleted product')
        res.redirect('/admin/products')

    } catch (err) {
        console.log(err)
    }
};
