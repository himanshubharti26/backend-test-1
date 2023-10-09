
const userBlogModel = require("../models/userBlogModel");
const {deleteBlogPost} = require("./blogController");

const getBlogPostIds = async(userId)=>{
   return await userBlogModel.find({userId})
    .then(data=>{
        const blogIds = data.map(entry=>entry.blogId);
        return blogIds;
    })
}

const deleteAllUserPosts = async(blogIds)=>{
    blogIDs.forEach(async(id)=>{
        try {
            const req = { params: { id } }; // Create a mock request object
            const res = {
                status: (statusCode) => {
                  console.log(statusCode)
                  return {
                    json: (data) => {
                     
                      console.log(`Status Code: ${statusCode}`);
                      console.log(data);
                    },
                  };
                },
              };

            const result = await deleteBlogPost(req, res);
            console.log(`Blog post with ID ${id} deleted. Response:`, result);
          } catch (error) {
            console.error(`Error deleting blog post with ID ${id}:`, error);
          }
    })
}

const deleteUserById = async(userId)=>{

}

exports.deleteUser = async(req, res)=>{
    try{
        const userId = req.params.id;
        //fetch all the blogpost ids related to this user
        const blogIDs = getBlogPostIds(userId);
        //call delete blog post for all the ids
        deleteAllUserPosts(blogIDs);
        
        //delete user
        await deleteUserById(userId);
        res.status(200).json({
            message: 'User and associated blog posts deleted successfully',
        });
    }catch(e){
        console.log("error in deleting user",e);
    }
}