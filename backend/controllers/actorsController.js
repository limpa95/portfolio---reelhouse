//Citation for the following file:
// Date: 5/22/2024
// Adapted from react-starter-app provided in OSU CS340
// The original file was used as a template. It was modified to fit our project by changing names, comments, and my SQL queries to match our project's mySQL Actors table.
// Source URL: https://github.com/osu-cs340-ecampus/react-starter-app
// Authors: Devin Daniels and Zachary Maes under the supervision of Dr. Michael Curry and Dr. Danielle Safonte

// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");

// Returns all rows of actors in actors
const getActors = async (req, res) => {
  try {
    // Select all rows from the "Actors" table
    const query = 'SELECT actor_id, actor_name FROM "Reelhouse"."Actors";';
    // Execute the query using the "db" object from the configuration file
    const {rows} = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching actors from the database:", error);
    res.status(500).json({ error: "Error fetching actors" });
  }
};

// Returns status of creation of new actor
const createActor = async (req, res) => {
  try {
    const { actor_name } = req.body;
    const query =
      'INSERT INTO "Reelhouse"."Actors" (actor_name) VALUES ($1)';

    const response = await db.query(query, [
      actor_name
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating actor:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating actor" });
  }
};

// Endpoint to delete a actor from the database
const deleteActor = async (req, res) => {
  console.log("Deleting actor with id:", req.params.id);
  const actorID = req.params.id;

  try {
    // Ensure the actor exists
    const isExisting = await db.query(
      'SELECT EXISTS(SELECT 1 FROM "Reelhouse"."Actors" WHERE actor_id = $1) AS "exists',
      [actorID]
    );

    // If the actor doesn't exist, return an error
    if (!isExisting.rows[0].exists) {
      return res.status(404).send("Actor not found");
    }

    // Delete the actor from Actors
    await db.query('DELETE FROM "Reelhouse"."Actors" WHERE actor_id = $1', [actorID]);

    // Return the appropriate status code
    res.status(204).json({ message: "Actor deleted successfully" })
  } catch (error) {
    console.error("Error deleting actor from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getActors,
  createActor,
  deleteActor,
};
