const express = require('express');
const router = express.Router();
const Notification = require('../models/Notifications');
const { verifyToken } = require("../middlewares/auth");
const User = require("../models/utilisateur");

// Get all notifications for the user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notifications count
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Ensure the notification belongs to the authenticated user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Notification.findByIdAndDelete(id);
    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.post('/mark-read', verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (notificationId) {
      // Mark single notification as read
      await Notification.updateOne(
        { _id: notificationId, userId: req.user.id },
        { $set: { read: true } }
      );
    } else {
      // Mark all notifications as read
      await Notification.updateMany(
        { userId: req.user.id, read: false },
        { $set: { read: true } }
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification and emit via Socket.io
const createNotification = async ( recipientType, message, link = null) => {
  try {
    // Find all users of the specified type
    const recipients = await User.find({ type: recipientType });

    // Create notifications for each recipient
    const notificationPromises = recipients.map(user => {
      const notification = new Notification({
        userId: user._id,
        message,
        link,
      });
      return notification.save();
    });

    // Wait for all notifications to be saved
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Notification creation error:", error);
    throw error;
  }
};

// Route to create notifications
router.post('/', verifyToken, async (req, res) => {
  try {
    const { recipientType, message, link } = req.body;
    
    // Check if 'recipientType', 'message', or other necessary data is missing
    if (!recipientType || !message) {
      return res.status(400).json({ message: 'Recipient type and message are required' });
    }

    // Create the notification
    await createNotification(req.app.io, recipientType, message, link);

    res.status(201).json({ message: 'Notification created successfully' });
  } catch (err) {
    console.error('Failed to create notification:', err);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});
//marking a specific notification as read
router.post("/:id/mark-read", async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
});

module.exports = { router, createNotification };
