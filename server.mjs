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

app.listen(PORT, () => {
  console.log("Server is running on 4000");
});
