// var apyKey = "d94a3deae8mshddff40e63fbd519p190b9cjsna5832c849eab"; 
// date using moment.js
var inputDate = moment().format("YYYY-MM-DD");
console.log(inputDate);
var scheduleContainer = $("#schedule-container");
var scheduleContent = $("#schedule-content");
var barContainer = $("#bar-container");
var gameDate = $("#game-date");
var citySearch = $("#city-search");
var cityInput = $("#city-input");
var searchBtn = $("#search-button");

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

            var gameCard = $("<div class='columns card is-flex is-justify-content-space-around'>");
            scheduleContent.append(gameCard);

            var homeCard = $("<div class='card-image mx-3'>");
            var versusText = $("<div class='mx-3'>");
            var awayCard = $("<div class='card-image mx-3'>");
            var gameStatusCard = $("<div class='card'>");


            var homeTeamName = $("<p class='has-text-weight-bold'>");
            homeTeamName.text(homeTeam);
            var homeTeamLogoImg = $("<img class='image is-64x64'>");
            homeTeamLogoImg.attr("src", "" + homeTeamLogo + "");

            homeCard.append(homeTeamLogoImg);
            homeCard.append(homeTeamName);

            gameCard.append(homeCard);

            versusText = $("<p class='has-text-weight-bold'>");
            versusText.text("VS");
            gameCard.append(versusText);

            var awayTeamName = $("<p class='has-text-weight-bold'>");
            awayTeamName.text(awayTeam);
            var awayTeamLogoImg = $("<img class='image is-64x64'>");
            awayTeamLogoImg.attr("src", "" + awayTeamLogo + "");

            awayCard.append(awayTeamLogoImg);
            awayCard.append(awayTeamName);

            gameCard.append(awayCard);

            var gameStatusText = $("<p class='has-text-weight-bold'>");
            gameStatusText.text(gameStatus);

            gameStatusCard.append(gameStatusText)

            gameCard.append(gameStatusCard);
        } 
    }).catch(error => console.log('error', error));

}

var getBars = function(city){
    // brewery api start
    var cityName = city;

    // format api url using city name and display max 10 items
    var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_city=" + cityName + "&per_page=10";
    
    fetch(breweryApiUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        // if no bars are found for specified city, else render bars
        if (data.length === 0) {
            // !!make this a modal message!!
            console.log("No bars found. Please try widening your search!");
        } else {
            // console.log(data[0].city);
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].brewery_type);
                var breweryType = data[i].brewery_type;

                // conditional to exclude non-visitable bars
                if (breweryType === "planning" || breweryType === "nano" || breweryType === "contract" || breweryType === "large") {
                    console.log("breweries hidden");
                    // else - populate list from remaining array data
                } else {

                    var breweryName = data[i].name;
                    var barStreetAddress = data[i].street;
                    var barCity = data[i].city;
                    var barUrl = data[i].website_url;
        
                    var barInfoContainer = $("<div class='is-flex is-flex-direction-row'>");
        
                    var barCard = $("<div class='card mb-1 px-1'>");
                    var barCardContent = $("<div class='card-content'>");
                    var barCardFooter = $("<footer class='card-footer'>");
        
                    var barName = $("<h3 class='has-text-weight-semibold has-text-left'>");
                    barName.text(breweryName);
        
                    var barAddress = $("<address class='has-text-left'>");
                    barAddress.append(barStreetAddress + ", ");
                    barAddress.append(barCity);
        
                    var barWebsite = $("<a>");
                    barWebsite.attr("href", barUrl);
                    barWebsite.text("website");
        
                    var footerWebsite = $("<p class='card-footer-item'>");
                    var footerWebsiteSpan = $("<span>");
                    footerWebsiteSpan.text("View ");
                    footerWebsiteSpan.append(barWebsite);
                    footerWebsite.append(footerWebsiteSpan);
        
                    var footerFavorite = $("<p class='card-footer-item'>");
                    var footerFavoriteSpan = $("<span>");
                    footerFavorite.text("Favorite");
                    footerFavorite.append(footerFavoriteSpan);
        
                    barCardFooter.append(footerWebsite);
                    barCardFooter.append(footerFavorite);
        
                    barCardContent.append(barName);
                    barCardContent.append(barAddress);
                    barCardContent.append(barCardFooter);
        
                    barCard.append(barCardContent);
                    barCard.append(barCardFooter);
                    barInfoContainer.append(barCard);
                    barContainer.append(barInfoContainer);
                }
            }
        }
        // console.log(data);
    }).catch(error => console.log("error", error));

}

var formHandler = function(event) {
    event.preventDefault();

    // clear old unsaved content from container
    barContainer.html("");

    // grab value from input
    var city = cityInput.val().trim();
    // console.log(city);

    // send city as parameter to getBars
    getBars(city);
};

// event handler for city search input
citySearch.on("submit", formHandler);
searchBtn.on("click", formHandler);

// getSchedules();
// getBars();