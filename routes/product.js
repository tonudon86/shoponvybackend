const express =require('express');
const router=express.Router();

const {isAuthenticatedUser ,authorizeRoles}=require('../middlerwares/auth')
const {getProducts ,newProducts ,deleteProduct,getSingleProduct,updateProduct,createProductReview,getProductsReviews,deleteReviews,getAllProducts}=require('../controllers/productController');

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/product/admin/new').post(newProducts);
router.route('/product/admin/:id').put(updateProduct).delete(deleteProduct);
router.route('/products/admin').get(getAllProducts)
router.route('/review').put(isAuthenticatedUser,createProductReview);
router.route('/reviews/').get(getProductsReviews);
router.route('/reviews/').delete(deleteReviews);
module.exports=router;