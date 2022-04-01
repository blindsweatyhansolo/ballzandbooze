// var apyKey = "d94a3deae8mshddff40e63fbd519p190b9cjsna5832c849eab"; 
// date using moment.js
var inputDate = moment().format("YYYY-MM-DD");
console.log(inputDate);
var scheduleContainer = $("#schedule-container");
var scheduleContent = $("#schedule-content");
var gameDate = $("#game-date");

var getSchedules = function() {
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
        for (var i = 0; i < data.response.length; i++) {
            
            
            var homeTeam = data.response[i].teams.home.name;
            var homeTeamLogo = data.response[i].teams.home.logo;
            
            // console.log(homeTeam);
            // console.log(homeTeamLogo);
            
            var awayTeam = data.response[i].teams.visitors.name;
            var awayTeamLogo = data.response[i].teams.visitors.logo;
            // console.log(awayTeam);
            // console.log(awayTeamLogo);

            
            var gameStatus = data.response[i].status.long;
            // console.log(gameStatus);
            
            // pass city name as parameter for brewery call
            var gameCity = data.response[i].arena.city;
            // console.log(gameCity);
            
            // console.log(data);

            var gameCard = $("<div class='columns card is-flex is-justify-content-space-around is-v-centered'>");
            scheduleContent.append(gameCard);

            var homeCard = $("<div class='card-image mx-3'>");
            var versusText = $("<div class='mx-3'>");
            var awayCard = $("<div class='card-image mx-3'>");
            var gameStatusCard = $("<div class='card is-shadowless'>");


            var homeTeamName = $("<p class='has-text-weight-bold mx-2'>");
            homeTeamName.text(homeTeam);
            var homeTeamLogoImg = $("<img class='image is-48x48 is-inline-block mt-2'>");
            homeTeamLogoImg.attr("src", "" + homeTeamLogo + "");

            homeCard.append(homeTeamLogoImg);
            homeCard.append(homeTeamName);

            gameCard.append(homeCard);

            versusText = $("<p class='has-text-weight-bold mt-4 pt-4 my-4'>");
            versusText.text("VS");
            gameCard.append(versusText);

            var awayTeamName = $("<p class='has-text-weight-bold mx-2'>");
            awayTeamName.text(awayTeam);
            var awayTeamLogoImg = $("<img class='image is-48x48 is-inline-block mt-2'>");
            awayTeamLogoImg.attr("src", "" + awayTeamLogo + "");

            awayCard.append(awayTeamLogoImg);
            awayCard.append(awayTeamName);

            gameCard.append(awayCard);

            var gameStatusText = $("<p class='has-text-weight-bold mt-4 pt-4 mr-2'>");
            gameStatusText.text(gameStatus);

            gameStatusCard.append(gameStatusText)

            gameCard.append(gameStatusCard);
        } 
    }).catch(error => console.log('error', error));;

}

var getBars = function(){
    // brewery api start
    // var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_city=san_diego";
    // var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_postal=21144&by_type=micro";
    var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_city=springfield";
    
    fetch(breweryApiUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].brewery_type);
        }
    })
}


getSchedules();
getBars();