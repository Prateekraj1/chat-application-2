import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        //checking if all the fields are filled
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required to be filled" })
        }
        //adding a validator for password length
        if (password.length < 5) {
            return res.status(400).json({ message: "Password must be atleast 5 charahters" });
        }

        //checking if the user with the same email id exists or not
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Sorry , a user with this email already exists" });
        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating a new user if the user does not exists already

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        //sending the authtoken when the new user is created
        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res, 3);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //validating the email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //validating the password
        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //generating token when login completed
        generateToken(user._id, res, 3);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        //if the profilePic is not provided in the request body
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" })
        }

        //uploading the response or profilepic through cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        //updating the profile pic and getting new updated data by providing the object {new:true}
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updateUser)
    } catch (error) {
        console.log("Error in uplaoding the profile image " + error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const fetchUsers = async (req, res) => {
    try {
        const myId = req.user._id;

        //filtering the users to show on the sider bar except the user that is logged in that is me
        const filteredUsers = await User.find({ _id: { $ne: myId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}