const express = require("express");
const app = express();
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const auth = require("./middleware/auth");
const logger = require("./middleware/logger");
const utils = require("./utils");
const PORT = process.env.PORT || 3000;
const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.use(express.json());
//To parse the form(post method) urlencoded data into json, and put it in req.body.
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Third party middleware
app.use(helmet());
app.use(morgan("tiny"));

//Custom middleware
app.use(logger);
app.use(auth);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((course) => course.id === +req.params.id);
  if (!course) {
    return res.status(404).send("Course with given id was not found...");
  }
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = utils.validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.status(201).send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //check if course exists, if not, 404.
  const course = courses.find((course) => course.id === +req.params.id);
  if (!course) {
    return res.status(404).send("Course with given id was not found...");
  }

  //validate input, if invalid, 400.
  const { error } = utils.validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //valid course, then update.
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  //check if course exists, if not, 404.
  const course = courses.find((course) => course.id === +req.params.id);
  if (!course) {
    return res.status(404).send("Course with given id was not found...");
  }

  //delete course
  const courseIdx = courses.indexOf(course);
  courses.splice(courseIdx, 1);

  res.send(course);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
