const express =require('express');
const router=express.Router();

const {isAuthenticatedUser ,authorizeRoles}=require('../middlerwares/auth')
const {getProducts ,newProducts ,deleteProduct,getSingleProduct,updateProduct,createProductReview,getProductsReviews,deleteReviews}=require('../controllers/productController');

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/product/admin/new').post(isAuthenticatedUser ,authorizeRoles('admin'),newProducts);
router.route('/product/admin/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

router.route('/review').put(isAuthenticatedUser,createProductReview);
router.route('/reviews/').get(getProductsReviews);
router.route('/reviews/').delete(isAuthenticatedUser,deleteReviews);
module.exports=router;