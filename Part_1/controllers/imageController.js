const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const secretKeyMap = new Map();

const generateToken = (req, res)=>{
    const {imagePath} = req.query;
    if(!imagePath){
        return res.status(400).json({ error: 'image_path is required' });
    }

    const secretKey = crypto.randomBytes(16).toString('hex');

    secretKeyMap.set(imagePath, secretKey);

    const token  = jwt.sign({imagePath}, secretKey, {expiresIn:"5m"});
    res.status(200).json({token});
}

const getImageByToken = (req,res)=>{

    const {imagePath,token} = req.query;

    
    if(!imagePath || !token){
        return res.status(400).json({error:"Both image path and token are required"});
    }

    try{
        const secretKey = secretKeyMap.get(imagePath);
    if(!secretKey){
        return res.status(400).json({error:"Secret key not found for given image path"});
    }
    const decoded = jwt.verify(token, secretKey);

    if(decoded.imagePath !== imagePath ){
        return res.status(400).json({error:"Token does not match for given path"});
    }   

    const image_path = path.join(`${__dirname}/../images`, imagePath);
    console.log("ïmage path==>", image_path);

    if(!fs.existsSync(image_path)){
        return res.status(400).json({error:"Image not found"});
    }

    const image = fs.readFileSync(image_path);

    res.setHeader('Content-Type','image/jpeg')
    res.send(image);
    


    }catch(err){
        res.status(401).json({ error: `Token is invalid or has expired ${err}` });
    }

    
}

module.exports = {
    generateToken,
    getImageByToken
}