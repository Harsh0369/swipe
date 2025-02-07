import User from "../models/User.js";

export const swipeRight = async (req, res) => {
    try {
        const { likedUserId } = req.params;
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);

        if (!likedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);
            await currentUser.save();
        }

        if(likedUser.likes.includes(currentUser._id)) {
            currentUser.matches.push(likedUserId);
            likedUser.matches.push(currentUser._id);
            await Promise.all([await currentUser.save(), await likedUser.save()]);
        }

        res.status(200).json({ message: "User liked" });
    } catch (error) {
        console.log("Error liking user", error);
        return res.status(500).json({ message: "Error liking user" });
    }
};
    

export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }
    return res.status(200).json({ message: "User disliked" });
  } catch (error) {
    console.log("Error disliking user", error);
    return res.status(500).json({ message: "Error disliking user" });
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );
    return res.status(200).json(user.matches);
  } catch (error) {
    console.log("Error getting matches", error);
    return res.status(500).json({ message: "Error getting matches" });
  }
};

export const getUserProfiles = async (req, res) => {
  try {
    const user = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        { _id: { $nin: req.user.likes } },
        { _id: { $nin: req.user.dislikes } },
        { _id: { $nin: req.user.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        {
          genderPreference: { $in: [currentUser.gender, "both"] },
        },
      ],
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user profiles", error);
    return res.status(500).json({ message: "Error getting user profiles" });
  }
};
