import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, reciverId } = req.body;
    const newMessage = await Message.create({
      sender: req.user._id,
      reciver: reciverId,
      content,
    });

    res.status(201).json({ message: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({
          $or: [
            { sender: req.user._id, reciver: userId },
            { sender: userId, reciver: req.user._id },
          ],
        }).sort("createdAt");


        res.status(200).json({ messages });
    }catch(error){
        res.status(500).json({ message: "Internal Server Error" });
    }
 }