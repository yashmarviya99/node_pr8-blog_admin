
const Admin = require("../models/Admin");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Admin Register
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const oldAdmin = await Admin.findOne({ email });

        if (oldAdmin) {
            return res.status(400).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Admin Registered Successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 2. Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        if (admin.status !== "Active") {
            return res.status(403).json({
                message: "Admin account is inactive"
            });
        }

        const checkPassword = await bcrypt.compare(
            password,
            admin.password
        );

        if (!checkPassword) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login Successfully",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 3. Get Admin Profile
const getAdminProfile = async (req, res) => {
    try {
        res.status(200).json({
            message: "Admin Profile",
            admin: req.admin
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 4. Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({
            status: "Active"
        });
        const inactiveUsers = await User.countDocuments({
            status: "Inactive"
        });

        res.status(200).json({
            totalUsers,
            activeUsers,
            inactiveUsers
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 5. Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User Created Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 6. Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            totalUsers: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 7. Get Single User
const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 8. Update User
const updateUser = async (req, res) => {
    try {
        const { name, email, password, status } = req.body;

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (email) {
            updateData.email = email;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (status) {
            updateData.status = status;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User Updated Successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 9. Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    getDashboardStats,
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};
