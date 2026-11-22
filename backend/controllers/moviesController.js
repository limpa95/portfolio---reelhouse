//Citation for the following file:
// Date: 5/22/2024
// Adapted from react-starter-app provided in OSU CS340
// The original file was used as a template. It was modified to fit our project by changing names, comments, and my SQL queries to match our project's mySQL Movies table.
// Source URL: https://github.com/osu-cs340-ecampus/react-starter-app
// Authors: Devin Daniels and Zachary Maes under the supervision of Dr. Michael Curry and Dr. Danielle Safonte

// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");

// Returns all rows of movies in movies
const getMovies = async (req, res) => {
  try {
    // Select all rows from the "Movies" table
    const query = 'SELECT Movies.movie_id, Movies.movie_title, Movies.movie_length, COALESCE(sum(view::int),0) AS movie_total_view FROM "Reelhouse"."Engagements" AS Engagements RIGHT JOIN "Reelhouse"."Movies" AS Movies ON Engagements.movie_id = Movies.movie_id GROUP BY Movies.movie_id ORDER BY Movies.movie_id;';
    // Execute the query using the "db" object from the configuration file
    const {rows} = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching movies from the database:", error);
    res.status(500).json({ error: "Error fetching movies" });
  }
};

// define a new GET request with express:
const getMoviesGenres = async (req, res) => {
  try {
    // Select all rows from the "Movies" table
    const query = 'SELECT mg.movie_genre_id, g.genre_name AS "genres", mg.movie_id_mg AS "movieID" FROM "Reelhouse"."Movies_Genres" AS mg INNER JOIN "Reelhouse"."Genres" AS g ON g.genre_id = mg.genre_id_mg INNER JOIN "Reelhouse"."Movies" AS m ON m.movie_id = mg.movie_id_mg ORDER BY m.movie_id;';
    // Execute the query using the "db" object from the configuration file
    const {rows} = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching movie genres from the database:", error);
    res.status(500).json({ error: "Error fetching movies genres" });
  }
};

// define a new GET request with express:
const getMoviesActors = async (req, res) => {
  try {
    // Select all rows from the "Movies_Actors" table
    const query = 'SELECT ma.movie_actor_id, a.actor_name AS "actors", ma.movie_id_ma AS "movieID" FROM "Reelhouse"."Movies_Actors" AS ma INNER JOIN "Reelhouse"."Actors" AS a ON a.actor_id = ma.actor_id_ma INNER JOIN "Reelhouse"."Movies" AS m ON m.movie_id = ma.movie_id_ma ORDER BY m.movie_id;';
    // Execute the query using the "db" object from the configuration file
    const {rows} = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching movie actors from the database:", error);
    res.status(500).json({ error: "Error fetching movies actors" });
  }
};

// define a new GET request with express:
const getMoviesDirectors = async (req, res) => {
  try {
    // Select all rows from the "Movies_Directors" table
    const query = 'SELECT md.movie_director_id, d.director_name AS "directors", md.movie_id_md AS "movieID" FROM "Reelhouse"."Movies_Directors" AS md INNER JOIN "Reelhouse"."Directors" AS d ON d.director_id = md.director_id_md INNER JOIN "Reelhouse"."Movies" AS m ON m.movie_id = md.movie_id_md ORDER BY m.movie_id;';
    // Execute the query using the "db" object from the configuration file
    const {rows} = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching movie directors from the database:", error);
    res.status(500).json({ error: "Error fetching movies directors" });
  }
};


// Returns a single movie by its unique ID from Movies
const getMovieByID = async (req, res) => {
  try {
    const movieID = req.params.id;
    const query = 'SELECT * FROM "Reelhouse"."Movies" WHERE movie_id = $1';
    const {result} = await db.query(query, [movieID]);
    // Check if movie was found
    if (result.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const movie = result[0];
    res.json(movie);
  } catch (error) {
    console.error("Error fetching movie from the database:", error);
    res.status(500).json({ error: "Error fetching movie" });
  }
};

// define a new GET request with express:
const getGenres = async (req, res) => {
  try {
    // Select all rows from the "Movies" table
    const query = 'SELECT genre_id, genre_name FROM "Reelhouse"."Genres";';
    // Execute the query using the "db" object from the configuration file
    const {rows} = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching genres from the database:", error);
    res.status(500).json({ error: "Error fetching genres" });
  }
};

// define a new GET request with express:
const getActors = async (req, res) => {
  try {
    // Select all rows from the "Movies" table
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

// define a new GET request with express:
const getDirectors = async (req, res) => {
  try {
    // Select all rows from the "Movies" table
    const query = 'SELECT director_id, director_name FROM "Reelhouse"."Directors";';
    // Execute the query using the "db" object from the configuration file
    const {rows} = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching directors from the database:", error);
    res.status(500).json({ error: "Error fetching directors" });
  }
};

// Returns status of creation of new person in bsg_movies
const createMovie = async (req, res) => {
  try {
    const { movie_title, movie_length } = req.body;
    const query =
      'INSERT INTO "Reelhouse"."Movies" (movie_title, movie_length) VALUES ($1, $2)';

    const response = await db.query(query, [
      movie_title,
      movie_length === "" ? null: parseInt(movie_length)
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating movie:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating movie" });
  }
};

// Returns status of creation of new person in bsg_movies
const createMovieGenre = async (req, res) => {
  try {
    const { genre_name } = req.body;
    const query =
      'INSERT INTO "Reelhouse"."Movies_Genres" (movie_id_mg, genre_id_mg) VALUES ((SELECT max(movie_id) FROM "Reelhouse"."Movies"), (SELECT genre_id FROM "Reelhouse"."Genres" WHERE genre_name = $1))';

    const response = await db.query(query, [
      genre_name
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating movie genre:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating movie genre" });
  }
};

// Returns status of creation of new person in bsg_movies
const createMovieActor = async (req, res) => {
  try {
    const { actor_name } = req.body;
    const query =
      'INSERT INTO "Reelhouse"."Movies_Actors" (movie_id_ma, actor_id_ma) VALUES ((SELECT max(movie_id) FROM "Reelhouse"."Movies"), (SELECT actor_id FROM "Reelhouse"."Actors" WHERE actor_name = $1))';

    const response = await db.query(query, [
      actor_name
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating movie actor:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating movie actor" });
  }
};

// Returns status of creation of new person in bsg_movies
const createMovieDirector = async (req, res) => {
  try {
    const { director_name } = req.body;
    const query =
      'INSERT INTO "Reelhouse"."Movies_Directors" (movie_id_md, director_id_md) VALUES ((SELECT max(movie_id) FROM "Reelhouse"."Movies"), (SELECT director_id FROM "Reelhouse"."Directors" WHERE director_name = $1))';

    const response = await db.query(query, [
      director_name
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating movie director:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating movie director" });
  }
};


const updateMovie = async (req, res) => {
  // Get the movie ID
  const movieID = req.params.id;
  // Get the movie object
  const newMovie = req.body;

  try {
    const {data} = await db.query('SELECT * FROM "Reelhouse"."Movies" WHERE movie_id = $1', [
      movieID,
    ]);

    const oldMovie = data.rows[0];
    
    // If any attributes are not equal, perform update
    if (!lodash.isEqual(newMovie, oldMovie)) {
      const query =
        'UPDATE "Reelhouse"."Movies" SET movie_title=$1, movie_length=$2 WHERE movie_id=$3';

      const values = [
        newMovie.movie_title,
        newMovie.movie_length,
        movieID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.json({ message: "Movie updated successfully." });
    }

    res.json({ message: "Movie details are the same, no update" });
  } catch (error) {
    console.log("Error updating movie", error);
    res
      .status(500)
      .json({ error: `Error updating the movie with id ${movieID}` });
  }
};

const updateMovieGenre = async (req, res) => {
  // Get the movie genre ID
  const movieGenreID = req.params.id;
  // Get the movie genre object
  const newMovieGenre1 = req.body;
  const newMovieGenre2 = {movie_genre_id: parseInt(movieGenreID), movie_id_mg: newMovieGenre1.movie_id_mg, genre_id_mg: newMovieGenre1.genre_id_mg};

  try {
    const {data} = await db.query('SELECT * FROM "Reelhouse"."Movies_Genres" WHERE movie_genre_id = $1', [
      movieGenreID,
    ]);

    const oldMovieGenre = data[0];
    
    // If any attributes are not equal, perform update
    if (!lodash.isEqual(newMovieGenre2, oldMovieGenre)) {
      const query =
        'UPDATE "Reelhouse"."Movies_Genres" SET movie_id_mg=$1, genre_id_mg=$2 WHERE movie_genre_id=$3';

      const values = [
        newMovieGenre2.movie_id_mg,
        newMovieGenre2.genre_id_mg,
        movieGenreID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.json({ message: "Movie Genres updated successfully." });
    }

    res.json({ message: "Movie Genre details are the same, no update" });
  } catch (error) {
    console.log("Error updating movie genre", error);
    res
      .status(500)
      .json({ error: `Error updating the movie genre with id ${movieGenreID}` });
  }
};

const updateMovieActor = async (req, res) => {
  // Get the movie actor ID
  const movieActorID = req.params.id;
  // Get the movie actor object
  const newMovieActor1 = req.body;
  const newMovieActor2 = {movie_actor_id: parseInt(movieActorID), movie_id_ma: newMovieActor1.movie_id_ma, actor_id_ma: newMovieActor1.actor_id_ma};

  try {
    const {data} = await db.query('SELECT * FROM "Reelhouse"."Movies_Actors" WHERE movie_actor_id = $1', [
      movieActorID,
    ]);

    const oldMovieActor = data[0];

    // If any attributes are not equal, perform update
    if (!lodash.isEqual(newMovieActor2, oldMovieActor)) {
      const query =
        'UPDATE "Reelhouse"."Movies_Actors" SET movie_id_ma=$1, actor_id_ma=$2 WHERE movie_actor_id=$3';

      const values = [
        newMovieActor2.movie_id_ma,
        newMovieActor2.actor_id_ma,
        movieActorID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.json({ message: "Movie Actors updated successfully." });
    }

    res.json({ message: "Movie Actor details are the same, no update" });
  } catch (error) {
    console.log("Error updating movie actor", error);
    res
      .status(500)
      .json({ error: `Error updating the movie actor with id ${movieActorID}` });
  }
};

const updateMovieDirector = async (req, res) => {
  // Get the movie director ID
  const movieDirectorID = req.params.id;
  // Get the movie director object
  const newMovieDirector1 = req.body;
  const newMovieDirector2 = {movie_director_id: parseInt(movieDirectorID), movie_id_md: newMovieDirector1.movie_id_md, director_id_md: newMovieDirector1.director_id_md};

  try {
    const {data} = await db.query('SELECT * FROM "Reelhouse"."Movies_Directors" WHERE movie_director_id = $1', [
      movieDirectorID,
    ]);

    const oldMovieDirector = data[0];

    // If any attributes are not equal, perform update
    if (!lodash.isEqual(newMovieDirector2, oldMovieDirector)) {
      const query =
        'UPDATE "Reelhouse"."Movies_Directors" SET movie_id_md=$1, director_id_md=$2 WHERE movie_director_id=$3';

      const values = [
        newMovieDirector2.movie_id_md,
        newMovieDirector2.director_id_md,
        movieDirectorID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.json({ message: "Movie Directors updated successfully." });
    }

    res.json({ message: "Movie Director details are the same, no update" });
  } catch (error) {
    console.log("Error updating movie director", error);
    res
      .status(500)
      .json({ error: `Error updating the movie director with id ${movieDirectorID}` });
  }
};

// Endpoint to delete a customer from the database
const deleteMovie = async (req, res) => {
  console.log("Deleting movie with id:", req.params.id);
  const movieID = req.params.id;

  try {
    // Ensure the person exitst
    const isExisting = await db.query(
      'SELECT EXISTS(SELECT 1 FROM "Reelhouse"."Movies" WHERE movie_id = $1) AS "exists"',
      [movieID]
    );

    // If the person doesn't exist, return an error
    if (!isExisting.rows[0].exists) {
      return res.status(404).send("Movie not found");
    }

    // Delete related records from the intersection table (see FK contraints bsg_cert_movies)
    const {response1} = await db.query(
      'DELETE FROM "Reelhouse"."Movies_Actors" WHERE movie_id_ma = $1',
      [movieID]
    );

    console.log(
      "Deleted",
      response1.affectedRows,
      "rows from Movies_Actors intersection table"
    );

    const {response2} = await db.query(
      'DELETE FROM "Reelhouse"."Movies_Directors" WHERE movie_id_md = $1',
      [movieID]
    );

    console.log(
      "Deleted",
      response2.affectedRows,
      "rows from Movies_Directors intersection table"
    );

    const {response3} = await db.query(
      'DELETE FROM "Reelhouse"."Movies_Genres" WHERE movie_id_mg = $1',
      [movieID]
    );

    console.log(
      "Deleted",
      response3.affectedRows,
      "rows from Movies_Genres intersection table"
    );

    // Delete the movie from Movies
    await db.query('DELETE FROM "Reelhouse"."Movies" WHERE movie_id = $1', [movieID]);

    // Return the appropriate status code
    res.status(204).json({ message: "Movie deleted successfully" })
  } catch (error) {
    console.error("Error deleting movie from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getMovies,
  getMovieByID,
  createMovie,
  createMovieGenre,
  createMovieActor,
  createMovieDirector,
  updateMovie,
  updateMovieGenre,
  updateMovieActor,
  updateMovieDirector,
  deleteMovie,
  getMoviesGenres,
  getMoviesActors,
  getMoviesDirectors,
  getGenres,
  getActors,
  getDirectors,
};
