
const express = require("express");

const router = express.Router();

const {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    getDashboardStats,
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
} = require("../controllers/adminControllers");

const protectAdmin = require("../middleware/authMiddleware");


// Admin Register
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", loginAdmin);

// Admin Profile
router.get("/profile", protectAdmin, getAdminProfile);

// Dashboard Statistics
router.get("/dashboard", protectAdmin, getDashboardStats);


// Create User
router.post("/users", protectAdmin, createUser);

// Get All Users
router.get("/users", protectAdmin, getAllUsers);

// Get Single User
router.get("/users/:id", protectAdmin, getSingleUser);

// Update User
router.put("/users/:id", protectAdmin, updateUser);

// Delete User
router.delete("/users/:id", protectAdmin, deleteUser);


module.exports = router;
