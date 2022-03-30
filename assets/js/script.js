// var apyKey = "d94a3deae8mshddff40e63fbd519p190b9cjsna5832c849eab"; 
// date using moment.js
var inputDate = moment().format("YYYY-MM-DD");
console.log(inputDate);

// nba api api header variables
var myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "d94a3deae8mshddff40e63fbd519p190b9cjsna5832c849eab");
myHeaders.append("x-rapidapi-host", "api-nba-v1.p.rapidapi.com");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

var apiUrl = "https://api-nba-v1.p.rapidapi.com/games?date=" + inputDate;

//   https://api-nba-v1.p.rapidapi.com/games?date=2022-03-29

fetch(apiUrl, requestOptions).then(function (response) {
    return response.json();
}).then(function (data) {

    console.log(data);

    var homeTeam = data.response[0].teams.home.name;
    var homeTeamLogo = data.response[0].teams.home.logo;

    console.log(homeTeam);

    var awayTeam = data.response[0].teams.visitors.name;
    var awayTeamLogo = data.response[0].teams.visitors.logo;
    console.log(awayTeam);

    var gameStatus = data.response[0].status.long;
    console.log(gameStatus);

    // pass city name as parameter for brewery call
    var gameCity = data.response[0].arena.city;
    console.log(gameCity);

    // for (var i = 0; i < response.length; i++) {
    //     console.log(response[i]);
    // }

}).catch(error => console.log('error', error));;

// brewery api start
// var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_city=san_diego";
// var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_postal=21144&by_type=micro";
var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_city=springfield"

fetch(breweryApiUrl).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
})