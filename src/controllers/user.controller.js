const User = require("../models/user.model");

const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { $set: req.body },
        { new: true }
      ).select("-password");
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFollowing: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).populate("following");
      res.json(user.following);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFollowers: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).populate("followers");
      res.json(user.followers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
