const fs = require('fs');
const path = require('path');

const deleteImage = (imageName) => {
  return new Promise((resolve, reject) => {
    const imagePath = path.join(__dirname, '../uploads', imageName);
    fs.unlink(imagePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = { deleteImage };