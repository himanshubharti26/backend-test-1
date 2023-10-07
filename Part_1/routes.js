const router = require('express').Router();
const blogController = require('./controllers/blogController');
const imageController = require('./controllers/imageController');

router.post('/blog/add',blogController.addBlog);
router.get('/blog/all', blogController.getAllBlogs);
router.get('/generate/token',imageController.generateToken);
router.get('/get/image',imageController.getImageByToken);

module.exports = router;