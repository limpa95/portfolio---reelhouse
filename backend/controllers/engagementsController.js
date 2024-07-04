//Citation for the following file:
// Date: 5/22/2024
// Adapted from react-starter-app provided in OSU CS340
// The original file was used as a template. It was modified to fit our project by changing names, comments, and my SQL queries to match our project's mySQL Engagements table.
// Source URL: https://github.com/osu-cs340-ecampus/react-starter-app
// Authors: Devin Daniels and Zachary Maes under the supervision of Dr. Michael Curry and Dr. Danielle Safonte

// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");

// Returns all rows of engagements in engagements
const getEngagements = async (req, res) => {
  try {
    // Select all rows from the "Engagements" table
    const query = "SELECT engagement_id, favorite, rating, view, user_id, Movies.movie_title AS movie_title, Televisions.television_title AS television_title FROM Engagements LEFT JOIN Movies ON Engagements.movie_id = Movies.movie_id LEFT JOIN Televisions ON Engagements.television_id = Televisions.television_id;";
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching engagements from the database:", error);
    res.status(500).json({ error: "Error fetching engagements" });
  }
};

// Returns all rows of engagements in engagements with movie_id and television_id
const getEngagementsIDs = async (req, res) => {
  try {
    // Select all rows from the "Engagements" table
    const query = "SELECT * FROM Engagements;";
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching engagements from the database:", error);
    res.status(500).json({ error: "Error fetching engagements" });
  }
};

// define a new GET request with express:
const getUsers = async (req, res) => {
  try {
    // Select all rows from the "Users" table
    const query = 'SELECT user_id, user_name FROM Users;';
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users from the database:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// define a new GET request with express:
const getMovies = async (req, res) => {
  try {
    // Select all rows from the "Movies" table
    const query = 'SELECT movie_id, movie_title, movie_total_view FROM Movies;';
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching movies from the database:", error);
    res.status(500).json({ error: "Error fetching movies" });
  }
};

// define a new GET request with express:
const getTVShows = async (req, res) => {
  try {
    // Select all rows from the "Movies" table
    const query = 'SELECT television_id, television_title, television_total_view FROM Televisions;';
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tv shows from the database:", error);
    res.status(500).json({ error: "Error fetching tv shows" });
  }
};

// Returns status of creation of new engagement
const createEngagement = async (req, res) => {
  try {
    const { favorite, rating, view, user_id, movie_id, television_id, television_total_view } = req.body;
    const query =
      "INSERT INTO Engagements (favorite, rating, view, user_id, movie_id, television_id) VALUES (?, ?, ?, ?, ?, ?)";

    const response = await db.query(query, [
      favorite === "" ? null : parseInt(favorite),
      rating === "" ? null : parseInt(rating),
      view === "" ? null : parseInt(view),
      user_id === "" ? null : parseInt(user_id),
      movie_id === "" ? null : parseInt(movie_id),
      television_id === "" ? null : parseInt(television_id)
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating engagement:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating engagement" });
  }
};

const updateMovieTotalView = async (req, res) => {
  // Get the movie ID
  const movieID = req.params.id;
  // Get the movie_total_view object
  const { favorite, rating, view, user_id, movie_id, television_id, television_total_view, movie_total_view } = req.body;

  try {
    const [data] = await db.query("SELECT movie_total_view FROM Movies WHERE movie_id = ?", [
      movieID,
    ]);

    const oldMovie = data[0];

    // If any attributes are not equal, perform update
    if (!lodash.isEqual(movie_total_view, oldMovie)) {
      const query =
        "UPDATE Movies SET movie_total_view=? WHERE movie_id=?";

      const values = [
        movie_total_view,
        movieID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.json({ message: "Movie total views updated successfully." });
    }

    res.json({ message: "Movie details are the same, no update" });
  } catch (error) {
    console.log("Error updating movie total views", error);
    res
      .status(500)
      .json({ error: `Error updating the movie total views with id ${movieID}` });
  }
};

const updateTelevisionTotalView = async (req, res) => {
  // Get the television ID
  const televisionID = req.params.id;
  // Get the television_total_view object
  const { favorite, rating, view, user_id, movie_id, television_id, television_total_view } = req.body;

  try {
    const [data] = await db.query("SELECT television_total_view FROM Televisions WHERE television_id = ?", [
      televisionID,
    ]);

    const oldTelevision = data[0];

    // If any attributes are not equal, perform update
    if (!lodash.isEqual(television_total_view, oldTelevision)) {
      const query =
        "UPDATE Televisions SET television_total_view=? WHERE television_id=?";

      const values = [
        television_total_view,
        televisionID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.json({ message: "TV show total views updated successfully." });
    }

    res.json({ message: "TV show details are the same, no update" });
  } catch (error) {
    console.log("Error updating tv show total views", error);
    res
      .status(500)
      .json({ error: `Error updating the tv show total views with id ${televisionID}` });
  }
};

// Endpoint to delete an engagement from the database
const deleteEngagement = async (req, res) => {
  console.log("Deleting engagement with id:", req.params.id);
  const engagementID = req.params.id;

  try {
    // Ensure the engagement exists
    const [isExisting] = await db.query(
      "SELECT 1 FROM Engagements WHERE engagement_id = ?",
      [engagementID]
    );

    // If the engagement doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("TV show not found");
    }

    // Delete the engagement from Engagements
    await db.query("DELETE FROM Engagements WHERE engagement_id = ?", [engagementID]);

    // Return the appropriate status code
    res.status(204).json({ message: "Engagement deleted successfully" })
  } catch (error) {
    console.error("Error deleting engagement from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getEngagements,
  getEngagementsIDs,
  getUsers,
  getMovies,
  getTVShows,
  createEngagement,
  updateTelevisionTotalView,
  updateMovieTotalView,
  deleteEngagement,
};
