import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bodyParser from "body-parser";

const adapter = new JSONFile("db.json");
const db = new Low(adapter);
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 4000;

(async () => {
  await db.read();
})();

app.get("/allMovies", async (req, res) => {
  await db.read();
  return res.json(db.data.data);
});

app.get("/allGenres", async (req, res) => {
  await db.read();
  return res.json(db.data.genres);
});

app.get("/allLocations", async (req, res) => {
  await db.read();
  return res.json(db.data.locations);
});

app.post("/addMovie", async (req, res) => {
  await db.read();
  const { body } = req;
  const movieData = db.data.data;
  body.id = movieData.length + 1;
  movieData.push(body);
  await db.write();
  return res.json(
    "Successfully added : " + movieData[movieData.length - 1].name
  );
});

app.post("/updateMovie/:id", async (req, res) => {
  await db.read();
  const { params, body } = req;
  const requestedMovieId = params.id;
  const movieData = db.data.data;

  const requiredIndex = movieData.findIndex((movie) => {
    return movie.id === Number(requestedMovieId);
  });
  body.id = requiredIndex + 1;
  movieData[requiredIndex] = body;
  await db.write();
  return res.json("Successfully updated : " + movieData[requiredIndex].name);
});

app.post("/deleteMovie/:name", async (req, res) => {
  await db.read();
  const { params } = req;
  const movieToBeDeleted = params.name;
  const movieData = db.data.data;

  const newMovieData = movieData.filter((movie) => {
    return !(movie.name === movieToBeDeleted);
  });
  const updatedMovieData = newMovieData.map((movie, i) => {
    movie.id = i + 1;
    return movie;
  });
  db.data.data = updatedMovieData;
  await db.write();
  return res.json("Successfully deleted : " + movieToBeDeleted);
});

app.listen(PORT, () => {
  console.log("Server is running on 4000");
});
