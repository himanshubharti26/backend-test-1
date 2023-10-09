const {Schema, model} = require('mongoose');


const userBlogSchema = new Schema({
    userId:{
        type:Number,
        required:true
    },
    blogId:{
        type:String,
        required:true
    }
})

const userBlogModel = model('userBlogs',userBlogSchema);

module.exports = userBlogModel;