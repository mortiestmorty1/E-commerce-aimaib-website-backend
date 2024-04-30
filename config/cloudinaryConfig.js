
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'da7gol4ft',
    api_key: '758256268514679',
    api_secret: 'LhdDL1u7kBu-MR2EPHxfGU-3Sog',
    secure: true 
});

module.exports = { cloudinary };
