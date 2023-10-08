const jimp = require("jimp");
const fs = require('fs');
const multer = require('multer');
const multerConfig = require('./../multerConfig');
const path = require('path');




const upload = multer(multerConfig);

const addBlog = async (req, res)=>{

    upload.fields(
        [
            {name:'main_image', maxCount:1},
            {name:"additional_images", maxCount:5}
        ]
    )(req, res, async (err)=>{
        if(err instanceof multer.MulterError){
            if(err.message === "File too large" ){
                return res.status(400).json({ error: 'exceeded image size of 1MB' });
            }
            return res.status(400).json({ error: 'File upload error' });
        }else if(err){
            return res.status(500).json({ error: `Internal server error: ${err}` });
        }
    

    try{
        const {title, description, date_time} = req.body;
        const main_image = req.files['main_image'][0].buffer;
        const additional_images = req.files['additional_images'] || [];
        const now = Math.floor(Date.now()/1000); 

        // console.log("received data==>",title,description, date_time);
        if(!title){
            return res.status(400).json({error:'Title is required'});
        }else if( title.length < 5){
            return res.status(400).json({error:'Title length should atleast 5 character'});
        }else if( title.length > 50){
            return res.status(400).json({error:'Title length should not be more than 50 characters'});
        }else if(!(/^[a-zA-Z0-9\s]+$/.test(title))){
            return res.status(400).json({error:'Special characters are not allowed in title'});
        }
            

        if(!description){
            return res.status(400).json({error:"Description is required"});
        }else if(description.length>500){
            return res.status(400).json({error:"Description length should not be more than 500 characters"})
        }

        if(!date_time){
            return res.status(400).json({error:"Date time is required "});
        }else if(isNaN(date_time)){
            return res.status(400).json({error:"Invalid date time "});
        }else if(date_time < now){
            return res.status(400).json({error:"Date time should not be less than current date time"});
        }

      
        const mainImagePath = path.resolve(__dirname, `../images/main_image_${now}.jpg`);
        
        const compressedMainImage = await jimp.read(Buffer.from(main_image.buffer)) // Read the original image
        .then((image) => {
            image.resize(0.75 * image.getWidth(), 0.75 * image.getHeight()); // Resize the image
            return image.getBufferAsync(jimp.MIME_JPEG); // Get the compressed image buffer
        })
        .then((compressedBuffer) => {
            fs.writeFileSync(mainImagePath, compressedBuffer); // Save the compressed image to a file
        })
        .catch((error) => {
            console.error('Error compressing and saving main image:', error);
        });

        
        
        const compressedAdditionalImages = await Promise.all(additional_images.map( async (img,index)=>{
            try{
            const image =  await jimp.read(Buffer.from(img.buffer));
            image.resize(0.75 * image.getWidth(), 0.75 * image.getHeight());
            const compressedBuffer = await image.getBufferAsync(jimp.MIME_JPEG);
            const additionalImagePath = path.resolve(__dirname, `../images/additional_image_${now}_${index}.jpg`);
            fs.writeFileSync(additionalImagePath, compressedBuffer);
            }catch(error) {
                console.error('Error compressing and saving additional image:', error);
                throw Error('Error compressing and saving additional image:', error);
            };
        }));
        

        const blogJsonPath = path.resolve(__dirname, `../blogs.json`);
        const blogData = JSON.parse(fs.readFileSync(blogJsonPath, 'utf-8'));
        const referenceNumber = (blogData.length + 1).toLocaleString('en-US', {minimumIntegerDigits: 5, useGrouping:false});
        
        const blogPost ={
            reference: referenceNumber,
            title,
            description,
            main_image: `main_image_${now}.jpg`,
            additional_images: compressedAdditionalImages.map((image,index)=>(`additional_image_${now}_${index}.jpg`)),
            date_time: Number(date_time),
            
        }
        
        blogData.push(blogPost);

        fs.writeFileSync(blogJsonPath, JSON.stringify(blogData,null,2),'utf-8');
        res.status(201).json(blogPost);
    }catch(error){
        console.error('Error adding blog post:', error);
        res.status(500).json({ error: 'Error adding blog post' });
    }
})
};



const getAllBlogs = async (req, res)=>{

    const BlogPath = path.resolve(__dirname,'../blogs.json')
    const blogPosts = await JSON.parse(fs.readFileSync(BlogPath, 'utf-8'));
    const modifiedBlogPosts = blogPosts.map(blog=>{
        const ISODate = new Date(blog.date_time*1000).toISOString();
        return {
            ...blog,
            title:blog.title.replaceAll(/\s/gi,'_'),
            date_time:ISODate
        }
        
    })
    res.status(200).json(modifiedBlogPosts);
}


module.exports = {
    addBlog,
    getAllBlogs
}