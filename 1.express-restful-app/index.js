const express = require("express");
const Joi = require("joi");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((course) => course.id === +req.params.id);
  if (!course) {
    res.status(404).send("Course with given id was not found...");
  }
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const name = req.body.name;
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name,
  };
  courses.push(course);
  res.status(201).send(course);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
