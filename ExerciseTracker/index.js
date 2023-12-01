const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const User = require("./models/user");
const Exercise = require("./models/exercise");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.create({ username });
    return res.status(200).json({ username: user.username, _id: user._id });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      return res.json({ message: "Username already exists" });
    }
    console.log(error.message);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await User.find({}).select("_id username");
    return res.status(200).json(users);
  } catch (error) {
    console.log({ error: error.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res, next) => {
  try {
    const { description, duration, date } = req.body;
    const { _id } = req.params;
    const userExists = await User.findById(_id).select("_id username");
    if (!userExists) {
      return res.status(400).json("Id does not exist");
    }
    const exercise = await Exercise.create({
      description,
      duration,
      date: date ? new Date(date)?.getTime() : undefined,
      userId: _id,
    });

    const data = {
      _id: userExists._id,
      username: userExists.username,
      duration: exercise.duration,
      description: exercise.description,
      date: new Date(exercise.date).toDateString(),
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

app.get("/api/users/:_id/logs", async (req, res, next) => {
  try {
    const { from, to, limit } = req.query;
    const { _id } = req.params;
    const userExists = await User.findById(_id);
    if (!userExists) {
      return res.status(400).json("Id does not exist");
    }

    const queryConditions = { userId: _id };

    if (from) {
      queryConditions.date = {
        ...queryConditions.date,
        $gte: new Date(from).getTime(),
      };
    }
    if (to) {
      queryConditions.date = {
        ...queryConditions.date,
        $lte: new Date(to).getTime(),
      };
    }

    const exercisesForUser = await Exercise.find(queryConditions)
      .limit(Number(limit) || 0)
      .select("description duration date")
      .lean();

    exercisesForUser.forEach((exercise) => {
      exercise["date"] = new Date(exercise["date"]).toDateString();
    });

    return res.status(200).json({
      _id: userExists._id,
      username: userExists.username,
      count: exercisesForUser.length,
      log: exercisesForUser,
    });
  } catch (error) {
    console.log(error);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
  connectDB();
});
