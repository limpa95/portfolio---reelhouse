//Citation for the following file:
// Date: 5/22/2024
// Adapted from react-starter-app provided in OSU CS340
// The original file was used as a template. It was modified to fit our project by changing names of table elements to match our project's mySQL Engagements table.
// Source URL: https://github.com/osu-cs340-ecampus/react-starter-app
// Authors: Devin Daniels and Zachary Maes under the supervision of Dr. Michael Curry and Dr. Danielle Safonte

import { useState, useEffect } from "react";
import axios from "axios";
import { BsTrash } from "react-icons/bs";

/* eslint-disable react/prop-types */
const TableRow = ({ engagement, fetchEngagements }) => {

  const [engagementsIDs, setEngagementsIDs] = useState([]);
  const [Movies, setMovies] = useState([]);
  const [TVShows, setTVShows] = useState([]);

  const fetchEngagementsIDs = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "engagements" + "/engagementsids";
      const response = await axios.get(URL);
      setEngagementsIDs(response.data);
    } catch (error) {
      alert("Error fetching engagements from the server.");
      console.error("Error fetching engagements:", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "engagements" + "/movies";
      const response = await axios.get(URL);
      setMovies(response.data);
    } catch (error) {
      alert("Error fetching movies from the server.");
      console.error("Error fetching movies:", error);
    }
  };

  const fetchTVShows = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "engagements" + "/tvshows";
      const response = await axios.get(URL);
      setTVShows(response.data);
    } catch (error) {
      alert("Error fetching TV shows from the server.");
      console.error("Error fetching TV shows:", error);
    }
  };

  const deleteRow = async () => {

    const formData = {
      favorite: 0,
      rating: "",
      view: 0,
      user_id: "",
      movie_id: "",
      television_id: "",
      movie_total_view: "",
      television_total_view: ""
    };

    let id = "";
    let total_view = "";
    let movie = 0;
    let television = 0;
    engagementsIDs.map((val, i) => {
      if (val.engagement_id === engagement.engagement_id && val.movie_id !== null){id = val.movie_id; movie = 1};
      if (val.engagement_id === engagement.engagement_id && val.television_id !== null){id = val.television_id; television = 1}
}
)
    if(movie === 1){
    Movies.map((val, i) => {
                if (val.movie_id === id){total_view = val.movie_total_view}
      }
    )
    total_view = total_view - 1;

    formData.movie_id = id;
    formData.movie_total_view = total_view;

    try {
      const URL = import.meta.env.VITE_API_URL + "engagements/" + "movieviews/" + formData.movie_id;
      const response = await axios.put(URL, formData);
      if (response.status !== 200) {
        alert("Error updating movie total views");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log("Error updating movie total views:", err);
    }

    };

    if(television === 1){
      TVShows.map((val, i) => {
                  if (val.television_id === id){total_view = val.television_total_view}
        }
      )
      total_view = total_view - 1;
  
      formData.television_id = id;
      formData.television_total_view = total_view;

      try {
        const URL = import.meta.env.VITE_API_URL + "engagements/" + "televisionviews/" + formData.television_id;
        const response = await axios.put(URL, formData);
        if (response.status !== 200) {
          alert("Error updating television total views");
        } else {
          alert(response.data.message);
        }
      } catch (err) {
        console.log("Error updating television total views:", err);
      }

      };


    try {
      const URL = import.meta.env.VITE_API_URL + "engagements/" + engagement.engagement_id;
      const response = await axios.delete(URL);
      // Ensure that the engagement was deleted successfully
      if (response.status === 204) {
        alert("Engagement deleted successfully");
      }
    } catch (err) {
      alert(err.response.data.error || "Error deleting Engagement");
      console.log(err);
    }
    fetchEngagements();
  };

  useEffect(() => {
    setEngagementsIDs(), fetchEngagementsIDs(), fetchMovies(), fetchTVShows();
  }, []);

  return (
    <tr key={engagement.engagement_id}>
      <td>{engagement.engagement_id}</td>
      <td>{engagement.favorite}</td>
      <td>{engagement.rating}</td>
      <td>{engagement.view}</td>
      <td>{engagement.user_id}</td>
      <td>{engagement.movie_title}</td>
      <td>{engagement.television_title}</td>

      <td>
        <BsTrash onClick={deleteRow} size={25} style={{ cursor: "pointer" }} />
      </td>
    </tr>
  );
};

export default TableRow;
