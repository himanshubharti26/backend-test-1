const blog = require('../models/blogModel');


const userBlogModel = require('../models/userBlogModel');

// import { CreateBlogDto } from "./dtos/blogPost.dto"

exports.createBlogPost = async ( req, res)=>{
    try{
        const main_image = req.files['main_image'][0].buffer;
        const additional_images = req.files['additional_images'].map(image=>image.buffer) || [];
        console.log("main Image==>",main_image)
        console.log("additional images==>",additional_images);

        const reference = generateReferenceNumber();
        const blogPostData = {...req.body,main_image,additional_images,reference};

        await blog.create(blogPostData)
        .then(createdBlogPost=>{
            if(!createdBlogPost){
                return res.status(400).json({
                    error:"Blog post creation failed"
                })
            }
            const {userId} = blogPostData;
            
            createUserBlog(userId,blogPostData.reference);

            createdBlogPost.main_image = `main_image_${Date.now().jpg}`
            createdBlogPost.additional_images = createdBlogPost.additional_images.map(image=>`additional_image_${Date.now()}.jpg`);
            return res.status(201).json({
                createdBlogPost
            })
        })
    }catch(e){
        res.status(500).json({
            error:`Internal server error: ${e}`
        })
    }
}

const generateReferenceNumber = ()=>{
    return new Date().getUTCMilliseconds();
}


const createUserBlog = async(userId, blogId)=>{
    await userBlogModel.create({userId,blogId})
    .then(userBlog=>{
        if(!userBlog){
            console.log("error in creating user blog")
        }else{
            console.log("user blog created successFully", userBlog);
        }
    })
}

exports.getAllBlogPosts = async(req, res)=>{
    try{
        blog.find()
        .then(allBlogPosts=>{
            res.status(200).json({
                allBlogPosts
            })
        })
    }catch(e){
        res.status(500).json({
            error:`Internal server error: ${e}`
        })
    }
}

exports.getBlogPost = async(req, res)=>{
    try{
        
        blog.find({reference:req.params.id})
        .then(blogPost=>{
            res.status(200).json({
                blogPost
            })
        }).catch(error=>{
            res.status(404).json({
                message:`Blog post not found ${error}`
            })
        })
    }catch(e){
        res.status(500).json({
            error:`Internal server error: ${e}`
        })
    }
}

exports.updateBlogPost = async(req, res)=>{
    try{
        const update = req.body;

        blog.findOneAndUpdate({
            reference:req.params.id
        },
        update,
        {new:true}
        ).then(blogPost=>{
            res.status(200).json({
                blogPost
            })
        }).catch(error=>{
            res.status(404).json({
                message:`Blog post not found ${error}` 
            })
        })
    }catch(e){
        res.status(500).json({
            error:`Internal server error: ${e}`
        })
    }
}

exports.deleteBlogPost = async(req, res)=>{
    blog.findOneAndDelete({reference:req.params.id})
        .then((data,err)=>{
            if(err){
                res.status(404).json({
                    message:`Blog post not found ${err}` 
                })
            }else{
                res.status(200).json({
                   data
                })
            }
            
        }).catch(error=>{
            res.status(404).json({
                message:`Blog post not found ${error}`
            })
        })
}