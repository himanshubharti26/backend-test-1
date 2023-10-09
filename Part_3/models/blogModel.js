const {Schema, model} = require('mongoose');

const blogSchema = new Schema({
    reference:{
        type:String,
        required:true
    },
    userId:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true,
        minlength:5,
        maxlength: 50,
        validate: {
            validator: (value)=> /^[a-zA-Z0-9\s]+$/.test(value),
            message: 'Title must not contain special characters'
        }

    },

    description:{
        type:String,
        maxlength:500,
        required: true
    }, 

    main_image :{
        type: Buffer,
        fileName: {
            type: String,
            required: true, // Ensure that a file name is provided
        },
        contentType: {
            type: String,
            validate: {
              validator: (value) => /^image\/jpeg$/.test(value), // Validate content type
              message: 'File must be in JPG format',
            },
        },
        required: true,
        // validate: [
        //     {
        //         validator:(value)=>{
        //             return /^image\/jpeg$/.test(value);//jpg magic header number
        //         },
        //         message:"File must be in JPG format",
        //     },
        //     {
        //         validator:(value)=>{
        //             return value.length <=1048576; //1mb in bytes
        //         },
        //         message:"File size must be less than or equal to 1MB"
        //     },
        // ],
        
    },

    additional_images:{
        type: Buffer,
        fileName: {
            type: String,
            required: true, // Ensure that a file name is provided
        },
        contentType: {
            type: String,
            validate: {
              validator: (value) => /^image\/jpeg$/.test(value), // Validate content type
              message: 'File must be in JPG format',
            },

        },
        // validate: [
        //     {
        //         validator:(value)=>{
        //             console.log("value in image validator ==>",value.mimetype);
        //             return /^image\/jpeg$/.test(value);//jpg magic header number
        //         },
        //         message:"File must be in JPG format",
        //     },
        //     {
        //         validator:(value)=>{
        //             return value.length <=1048576; //1mb in bytes
        //         },
        //         message:"File size must be less than or equal to 1MB"
        //     },
        // ],
        required:false
    },

    date_time:{
        type:Number,
        required:true,
        validate: {
            validator:(value)=>{
                return !isNaN(value) && value >= Date.now();
            },
            message: "Date must be a valid UNIX timestamp and not before the current date",
        }
    }
})

BlogModel = model('Blogs', blogSchema);

module.exports = BlogModel;