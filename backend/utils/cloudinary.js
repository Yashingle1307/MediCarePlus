import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// upload image to cloudinary

export async function uploadToCloudinary(filePath,folder="doctor"){
    try{
        const result=await cloudinary.uploader.upload(filePath,{
            folder,
            resource_type:"image"
        });

        fs.unlinkSync(filePath);
        return result;
    }
    catch(err)
    {
        console.log("Cloudinary Upload Error:",err.message);
        throw err;
    }
}


export async function deleteFromCloudinary(publicId){
    try{
        if(!publicId)
        {
            await cloudinary.uploader.destroy(publicId);
        }
    }
    catch(err)
    {
        console.log("Cloudinary Delete Error:",err.message);
        throw err;
    }
}

export default cloudinary;



