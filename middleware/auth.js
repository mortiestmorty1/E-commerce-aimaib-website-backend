const express = require('express');

const isAuthorized = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        res.status(401).send({ error: "You are not authorized to access this route" })
    }
    console.log("token is ", token)
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user= decoded
    console.log("the token is for:",req.user.email);
    if(req.user.role=="user")
    {
        next();
    }
    else{
        return res.status(401).send({message:"You are not authorized to access this route"})
    }
}

module.exports = isAuthorized;