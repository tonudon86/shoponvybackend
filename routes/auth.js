const express= require('express')

const router = express.Router()

const {isAuthenticatedUser,authorizeRoles}=require('../middlerwares/auth')
const {registerUser,loginUser,getUserProfile,updateProfile,updatePassword,forgotPassword,resetPassword,logoutUser,updateUser,getUserDetails,allUsers,deleteUser}=require('../controllers/authController')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticatedUser,getUserProfile)
router.route('/me/update').put(isAuthenticatedUser,updateProfile)
router.route('/password/update').put(isAuthenticatedUser,updatePassword)

router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers)
router.route('/admin/userdetails/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)
module.exports=router;