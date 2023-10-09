const router = require('express').Router();
const blogController = require('./controllers/blogController')
const userController = require('./controllers/userController');
const multer = require('multer');
const multerConfig = require('./multerConfig');

console.log("Router module path: ", module.filename);
const upload = multer(multerConfig);
// router.post('/blog/add',blogController.createBlogPost);
router.post('/blog/add', upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'additional_images', maxCount: 5 }
  ]), blogController.createBlogPost);
router.get('/blog/all', blogController.getAllBlogPosts);
router.get('/blog/get/:id', blogController.getBlogPost);
router.put('/blog/update/:id',blogController.updateBlogPost);
router.delete('/blog/delete/:id',blogController.deleteBlogPost);
router.delete('/user/delete/:id',userController.deleteUser);

module.exports = router;