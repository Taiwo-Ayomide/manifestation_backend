const express = require('express');
const router = express.Router();
const User = require("../model/User");
const CryptoJS = require('crypto-js');
require('dotenv').config();
const { authMiddleware, verifyTokenAndCoordinator } = require('./middleware');


// GET USER BY ID
router.get("/user/:id", verifyTokenAndCoordinator,  async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const userData = excludePassword(user);
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error while fetching user" });
    }
});

// UPDATE USER
router.put("/user/:id", authMiddleware, async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        
        // If password is being updated, encrypt it
        if (password) {
            updateData.password = CryptoJS.AES.encrypt(
                password,
                process.env.PASS_SEC
            ).toString();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = excludePassword(updatedUser);
        res.status(200).json({
            message: "User updated successfully",
            user: userData
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error while updating user" });
    }
});

// DELETE USER
router.delete("/user/:id", verifyTokenAndCoordinator, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "User deleted successfully",
            userId: req.params.id
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error while deleting user" });
    }
});


module.exports = router