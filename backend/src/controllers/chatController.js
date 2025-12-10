const ChatMessage = require("../models/ChatMessage");

exports.getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;

    const history = await ChatMessage.find({ roomId })
      .sort({ createdAt: 1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
