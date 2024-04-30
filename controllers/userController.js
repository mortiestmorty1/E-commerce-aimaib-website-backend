const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');



let signup = (req, res) => {
    console.log("signup usercontroller called!");
    User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).send({ message: "User account with this email already exists!" });
            }

            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send({ message: "Error hashing password", error: err });
                }
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword,
                    PhoneNumber: req.body.PhoneNumber,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zipCode: req.body.zipCode,
                    country: req.body.country,
                    role: req.body.role,
                });
                newUser.save()
                    .then(user => {
                        res.status(200).send({ message: "User account created successfully!", user });
                    })
                    .catch(err => {
                        res.status(400).send({ message: "Error occurred while creating user account", error: err });
                    });
            });
        })
        .catch(err => {
            res.status(400).send({ message: "Error occurred while checking user account", error: err });
        });
};

let login = (req, res) => {
    console.log("login usercontroller called!");
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).send({ message: "Error verifying password", error: err });
                }
                if (!isMatch) {
                    return res.status(401).send({ message: "Invalid credentials" });
                }

                const token = jwt.sign(
                    { id: user._id, email: user.email, role: user.role },
                    process.env.SECRET_KEY,
                    { expiresIn: '10h' }
                );

                res.status(200).send({
                    message: "Login successful",
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role
                    }
                    
                });
            console.log("token!", token);
            });
        })
        .catch(err => {
            res.status(500).send({ message: "Error during login", error: err });
        });
}; 

module.exports = {
    signup,
    login
}