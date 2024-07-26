const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const cloudinary = require("cloudinary").v2;

//database
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/blog_mern");
    console.log("database is connected successfully!");
  } catch (err) {
    console.log(err);
  }
};

//middlewares
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

//image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
    // fn(null,"image1.jpg")
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  image = req.file;
  console.log("image.path" + image.path);
  const uploadResult = await cloudinary.uploader.upload(image.path);
  console.log("uploadResult" + uploadResult);
  const imageUrl = uploadResult.secure_url;
  console.log("imageUrl" + imageUrl);
  res
    .status(200)
    .json({ message: "Image has been uploaded successfully!", imgu: imageUrl });
});

app.listen(5000, () => {
  connectDB();
  console.log("app is running on port " + 5000);
});
