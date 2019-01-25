require("dotenv").config();
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var params = process.argv[3];

for (var i = 4; i < process.argv.length; i++) {
  params += " " + process.argv[i];
}

App(command, params);

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
  if (params === undefined || params === " ") {
    params = "Rancid";
  }

  let queryURL = "https://rest.bandsintown.com/artists/" + params + "/events?app_id=codingbootcamp"

  axios.get(queryURL)
    .then(function (response) {
      let rd = response.data;
      for (let i = 0; i < rd.length; i++) {
        console.log("\n===== "  + params +  " =====");
        console.log("Name: ", rd[i].venue.name);
        console.log("City: ", rd[i].venue.city);
        console.log("Country: ", rd[i].venue.country);
        console.log("Date: ", moment(rd[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));
        console.log("==============================\n");
      }
    })
    .catch(function (err) {
      console.log(err);
    })
};

function getSpotify(params) {
  if (params === undefined || params === " ") {
    params = "Fake Plastic Trees";
  }

  spotify
    .search({
      type: 'track',
      query: params
    })
    .then(function (response) {

      let sd = response.tracks.items;
      for (let i = 0; i < sd.length; i++) {
        console.log("\n==============================");
        console.log("Artist(s): " + sd[i].artists[0].name);
        console.log("Song Name: " + sd[i].name);
        console.log("Preview Link: " + sd[i].preview_url);
        console.log("Album: " + sd[i].album.name);
        console.log("==============================\n");
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};

function getMovie(params) {
  if (params === undefined || params === " ") {
    params = "Sideways";
  }

  let queryURL = "http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=trilogy";

  axios.get(queryURL)
    .then(function (response) {
      let rd = response.data;
      console.log("\n==============================");
      console.log("Title: ", rd.Title);
      console.log("Year: ", rd.Year);
      console.log("Rated: ", rd.Rated);
      console.log("IMDB Rating: ", rd.imdbRating);
      console.log("Country: ", rd.Country);
      console.log("Language: ", rd.Language);
      console.log("Plot: ", rd.Plot);
      console.log("Actors: ", rd.Actors);
      console.log("==============================\n");

      if (rd.Ratings[1]) {
        console.log("Rotten tomatoes rating: ", rd.Ratings[1].Value);
        console.log("==============================\n");
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