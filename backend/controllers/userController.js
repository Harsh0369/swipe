import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const updateProfile = async (req, res) => {
    try {
        const { image, ...otherData } = req.body;

        let updatedData = otherData;
        if (image) {
            if (image.startsWith("data:image"))
            {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    updatedData.image = uploadResponse.secure_url;
                } catch(error) {
                    console.log("Error uploading image", error);
                    return res.status(500).json({ message: "Error uploading image" });
                }
            }
             const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });
        }
    } catch(error) {
        console.log("Error updating profile",error);
        return res.status(500).json({ message: "Error updating profile" });
    }
}