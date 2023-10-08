const request = require('supertest');
const  app = require('../server');
const fs = require('fs');
const path = require('path');






describe('Add blog post succeeded test', ()=>{
    try{
        it('should add a valid blog post with all field', async() =>{
           
            const blogPostData = {
                title: 'Test Blog Post',
                description: 'This is a test blog post description.',
                date_time: Math.floor(Date.now() / 1000),
            }
            
            const filePath = path.resolve(__dirname,'../images/main_image_1696689518.jpg');
          
            const response = await    request(app)
            .post('/api/blog/add')
            .field('title', blogPostData.title)
            .field('description', blogPostData.description)
            .field('date_time', blogPostData.date_time)
            .attach('main_image', filePath)
            .expect(201);
            
        
            expect(response?.body)?.toMatchObject({
                title:blogPostData.title,
                description:blogPostData.description,
                date_time:blogPostData.date_time,
            });
            
            
            // fs.unlinkSync(filePath);
        })
    }catch(err){
        console.log("Error in catch: ", err);

    }
    
})

//partial field test
describe('Add partial blog post fields', ()=>{
    try{
        it('should return an error message for missing required fields', async() =>{
            const blogPostData = {
                title: '',
                description: '',
                date_time: "",
            }

            const filePath = path.resolve(__dirname,'../images/main_image_1696689518.jpg');
            const response = await    request(app)
            .post('/api/blog/add')
            .field('title', blogPostData?.title)
            .field('description', blogPostData?.description)
            .field('date_time', blogPostData?.date_time)
            .attach('main_image', filePath)
            .expect(400);

            expect(response.body).toEqual({
                error: 'Title is required'
            });
        })
    }catch(err){
        console.log("test case failed with error:",err);
    }
})

//test case for image size
describe('Add full blog post fields with main_image that exceeds 1MB', ()=>{
    try{
        it('should return an error message for exceeding image size', async() =>{
            const blogPostData = {
                title: 'Test Blog Post',
                description: 'This is a test blog post description.',
                date_time: Math.floor(Date.now() / 1000),
            }

            const filePath = path.resolve(__dirname,'./images/2mb-image.jpg');
            const response = await    request(app)
            .post('/api/blog/add')
            .field('title', blogPostData?.title)
            .field('description', blogPostData?.description)
            .field('date_time', blogPostData?.date_time)
            .attach('main_image', filePath)
            .expect(400);

            expect(response.body).toEqual({
                error: 'exceeded image size of 1MB'
            });
        })
    }catch(err){
        console.log("test case failed with error:",err);
    }
})


//test case for special character in title
describe('Add full blog post fields with title that has special characters', ()=>{
    try{
        it('should return an error message for special characters in title', async() =>{
            const blogPostData = {
                title: '# Test Blog Post',
                description: 'This is a test blog post description.',
                date_time: Math.floor(Date.now() / 1000),
            }

            const filePath = path.resolve(__dirname,'../images/main_image_1696689518.jpg');
            const response = await    request(app)
            .post('/api/blog/add')
            .field('title', blogPostData?.title)
            .field('description', blogPostData?.description)
            .field('date_time', blogPostData?.date_time)
            .attach('main_image', filePath)
            .expect(400);

            expect(response.body).toEqual({
                error: 'Special characters are not allowed in title'
            });
        })
    }catch(err){
        console.log("test case failed with error:",err);
    }
})

//invalid date format
describe('Add full blog post fields with ISO date_time', ()=>{
    try{
        it('should return an error message for invalid date format ', async() =>{
            const blogPostData = {
                title: 'Test Blog Post',
                description: 'This is a test blog post description.',
                date_time: new Date().toISOString(),
            }

            const filePath = path.resolve(__dirname,'../images/main_image_1696689518.jpg');
            const response = await    request(app)
            .post('/api/blog/add')
            .field('title', blogPostData?.title)
            .field('description', blogPostData?.description)
            .field('date_time', blogPostData?.date_time)
            .attach('main_image', filePath)
            .expect(400);

            expect(response.body).toEqual({
                error: 'Invalid date time '
            });
        })
    }catch(err){
        console.log("test case failed with error:",err);
    }
})




//get all post successful test 

describe('Add blog post then Get all blog posts successful Test', ()=>{
    try{
        it('should add a valid blog post and retrieve it successfully', async() =>{
            const blog = {
                title: 'Test new Blog Post',
                description: 'This is a test blog post new description.',
                date_time: Math.floor(Date.now() / 1000),
            }

            const filePath = path.resolve(__dirname,'../images/main_image_1696689518.jpg');
            const response = await    request(app)
            .post('/api/blog/add')
            .field('title', blog?.title)
            .field('description', blog?.description)
            .field('date_time', blog?.date_time)
            .attach('main_image', filePath)
            .expect(201);

            expect(response.body).toMatchObject(blog);


            const getResponse  = await    request(app)
            .get('/api/blog/all')
            .expect(200);

            const addedBlogPostFound = getResponse.body.some(blogPost=>blogPost.description === blog.description)

            expect(addedBlogPostFound).toBe(true);

        })
    }catch(err){
        console.log("test case failed with error:",err);
    }
})



//get all post failed test
describe('Add blog post then Get all blog posts successful Test', ()=>{
    try{
        it('should add an invalid blog post and check that it does not exists in retrived results', async() =>{
            const blog = {
                title: '@ Test new Blog Post',
                description: 'This is a test blog post new description.',
                date_time: Math.floor(Date.now() / 1000),
            }

            const filePath = path.resolve(__dirname,'../images/main_image_1696689518.jpg');
            const response = await    request(app)
            .post('/api/blog/add')
            .field('title', blog?.title)
            .field('description', blog?.description)
            .field('date_time', blog?.date_time)
            .attach('main_image', filePath)
            .expect(400);

            expect(response.body).toEqual({
                error: 'Special characters are not allowed in title'
            });


            const getResponse  = await    request(app)
            .get('/api/blog/all')
            .expect(200);

            const addedBlogPostFound = getResponse.body.some(blogPost=>blogPost.title === blog.title);

            expect(addedBlogPostFound).toBe(false);

        })
    }catch(err){
        console.log("test case failed with error:",err);
    }
})







describe("Get token from Generate token API and send to Get image by token API successful Test", () => {
    let token;
 
     it("generate token from Generate token API", async () => {
         const imagePath = "main_image_1696805394.jpg";
 
         // Make a request to the Generate token API
         const response = await request(app)
             .get('/api/generate/token')
             .query({ imagePath })
             .expect(200);
 
         // Extract the generated token from the response
         token = response?.body?.token;
 
         // Ensure that the token is not empty
         expect(token).toBeTruthy();
     });
 
     it("get image from Get image by token API using the generated token", async () => {
         const imagePath = "main_image_1696805394.jpg";
 
         // Make a request to the Get image by token API using the generated token
         const response = await request(app)
             .get('/api/get/image')
             .query({
                 token: token, // Use the generated token
                 imagePath: imagePath
             })
             .expect(200);
 
         expect(response.headers['content-type']).toContain('image/jpeg');
     });
 });



 describe("Get token from Generate token API and send to Get image by token API failed Test", () => {
    let token;
 
     it("generate token from Generate token API", async () => {
         const imagePath = "main_image_1696805394.jpg";
 
         // Make a request to the Generate token API
         const response = await request(app)
             .get('/api/generate/token')
             .query({ imagePath })
             .expect(200);
 
         // Extract the generated token from the response
         token = response?.body?.token;
 
         // Ensure that the token is not empty
         expect(token).toBeTruthy();
     });
 
     it("get image from Get image by token API using the generated token but with different image path", async () => {
         const imagePath = "main_image_1696653219.jpg";
 
         // Make a request to the Get image by token API using the generated token
         const response = await request(app)
             .get('/api/get/image')
             .query({
                 token: token, // Use the generated token
                 imagePath: imagePath
             })
             .expect(400);
 
         expect(response.body).toEqual({
            
            error:"Secret key not found for given image path"
         });
     });
 });



 
 
