var express = require("express");
var cors = require("cors");
var multer = require("multer");
require("dotenv").config();

var app = express();
const upload = multer({ dest: "./upload" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post(
  "/api/fileanalyse",
  upload.single("upfile"),
  async (req, res, next) => {
    try {
      const { originalname, mimetype, size } = req.file;
      return res.status(200).json({ name: originalname, type: mimetype, size });
    } catch (error) {
      console.log(error.message);
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
