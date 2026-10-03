require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Student Manager Backend is running!");
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    course: String
});

const Student = mongoose.model("Student", studentSchema);

app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);

        await student.save();

        res.json(student);
    } catch (error) {
        res.status(500).send("Student save failed");
    }
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).send("Failed to get students");
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});