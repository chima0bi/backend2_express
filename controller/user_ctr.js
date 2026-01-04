import Users from "../model/user_model.js";
import bcrypt, { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";

//REGISTER USER
export const createUser = async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    state,
    country,
    address,
    phone,
    role,
    service,
    experienceYears,
  } = req.body;

  try {
    //prevent registration of double unique details
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Already existing user, please log in",
      });
    }
    const existingPhone = await Users.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        message: "Please use a new phone Number",
      });
    }
    const existingUsername = await Users.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists, please chose a new one",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Users.create({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      country,
      state,
      address,
      role,
      service,
      experienceYears,
    });
    return res
      .status(201)
      .json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating user, Server Error", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let allUsers = await Users.find();
    return res
      .status(200)
      .json({ message: "Users retrieved suceesfully", allUsers });
  } catch (error) {
    console.error("Error getting all users: ", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

//GET USER BY ID
export const getUserById = async (req, res) => {
  const userId = req.user.id; //use params.email if want to find by email. Also, I changed req.params.id to req.user.id because this function only runs after authenticate which creates req.user. Also it is more secure than using params which comes with the browser url and can be easily changed.
  try {
    const user = await Users.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User retrieved", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Invalid User Id, please try again", error });
  }
};

//LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Email does not exist, please register" });
    }
    const correctPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    //GENERATE JWT TOKEN
    const token = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );
    return res.status(200).json({
      message: "Login successful",
      token,
      existingUser: {
        id: existingUser._id,
        role: existingUser.role,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        username: existingUser.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user.id; //changed req.params.id to req.user.id because this function only runs after authenticate which creates req.user. Also it is more secure than using params which comes with the browser url and can be easily changed.
  const {
    name,
    email,
    phone,
    password,
    country,
    state,
    address,
    username,
    role,
    service,
    experienceYears,
  } = req.body;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Update required/affected fields and save
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    // Rehash password if updated in req.body
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.country = country || user.country;
    user.state = state || user.state;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.service = service || user.service;
    user.experienceYears = experienceYears || user.experienceYears;
    await user.save();
    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.user.id; //changed req.params.id to req.user.id because this function only runs after authenticate which creates req.user. Also it is more secure than using params which comes with the browser url and can be easily changed.
  try {
    const user = await Users.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    } //await user.deleteOne()
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Particular requests not using req.user.id
export const adminDelete = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    } //await user.deleteOne()
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminUpdate = async (req, res) => {
  const userId = req.params.id;
  const {
    name,
    email,
    phone,
    password,
    country,
    state,
    address,
    username,
    role,
    service,
    experienceYears,
  } = req.body;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //Update required/affected fields and save
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    // Rehash password if updated in req.body
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.country = country || user.country;
    user.state = state || user.state;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.service = service || user.service;
    user.experienceYears = experienceYears || user.experienceYears;
    await user.save();
    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminFind = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User retrieved", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Invalid User Id, please try again", error });
  }
};
