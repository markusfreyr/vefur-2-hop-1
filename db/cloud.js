require('dotenv').config();
const cloudinary = require('cloudinary');


const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Missing cloudinary config, uploading images will not work');
}

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function upload(buffer) {
  const encodedBuffer = buffer.toString('base64');

  if (!buffer) {
    return { error: 'Can\'t read file' };
  }

  let img;

  try {
    img = await cloudinary.uploader.upload(`data:image/gif;base64,${encodedBuffer}`);
  } catch (error) {
    throw error;
  }

  const { secure_url: url } = img;

  return url;
}

module.exports = {
  upload,
};
