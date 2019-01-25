require("dotenv").config();
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);

App(process.argv[2], process.argv[3]);

function App(command, params) {

  switch (command) {
    case "concert-this":
      getConcert(params)
      break;
    case "spotify-this-song":
      getSpotify(params)
      break;
    case "movie-this":
      getMovie(params)
      break;
    case "do-what-it-says":
      getDoIt()
      break;

    default:
      "Liri doesn't know that command, please try again.";
      break;
  }
};


function getConcert(params) {

  let queryURL = "https://rest.bandsintown.com/artists/" + params + "/events?app_id=codingbootcamp"

  axios.get(queryURL)
    .then(function (response) {
      data = response.data;
      for (let i = 0; i < data.length; i++) {

        console.log("Name: ",data[i].venue.name);
        console.log("City: ",data[i].venue.city);
        console.log("Country: ",data[i].venue.country);
        console.log("Date: ",moment(data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));
        console.log("====================================")
      }

    })
    .catch(function (err) {
      console.log(err);
    })
};

function getSpotify(params) {
  if (params === undefined || params === " ") {
    params = "Welcome to The Jungle";
  } 

  spotify
    .search({ type: 'track', query: params })
    .then(function(response) {

      var songData = response.tracks.items;
      console.log("Artist(s): " + songData[0].artists[0].name);
	    console.log("Song Name: " + songData[0].name);
	    console.log("Preview Link: " + songData[0].preview_url);
      console.log("Album: " + songData[0].album.name);
      console.log("===========================");
    })
    .catch(function(err) {
      console.log(err);
    });

};

function getMovie(params) {

  let queryURL = "http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=trilogy";

  axios.get(queryURL)
    .then(function (response) {
      console.log("Title: ", response.data.Title);
      console.log("Year: ", response.data.Year);
      console.log("Rated: ", response.data.Rated);
      console.log("IMDB Rating: ", response.data.imdbRating);
      console.log("Country: ", response.data.Country);
      console.log("Language: ", response.data.Language);
      console.log("Plot: ", response.data.Plot);
      console.log("Actors: ", response.data.Actors);

      if (response.data.Ratings[1]) {
        console.log("Rotten tomatoes rating: ", response.data.Ratings[1].Value);
        console.log("================");
      }
    })
    .catch(function (err) {
      console.log(err);
    })
}

function getDoIt() {
  let commands;
  let params;

  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    const dataArr = data.split(",");

    for (let i = 0; i < dataArr.length; i++) {
      commands = dataArr[i];
      i++;
      params = dataArr[i];
      App(commands, params);
    }
  });
};