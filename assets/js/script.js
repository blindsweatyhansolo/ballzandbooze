$(document).ready(function(){
    renderSavedBars();
});

// current date using moment.js
var currentDate = moment().format("YYYY-MM-DD");
var scheduleContainer = $("#schedule-container");
var scheduleContent = $("#schedule-content");
var barContainer = $("#bar-container");
var gameDate = $("#game-date");
var citySearch = $("#city-search");
var cityInput = $("#city-input");
var searchBtn = $("#search-button");
var gameSearchBtn = $("#game-search-btn");
var datePicker = $("#date-picker");
var todayGameBtn = $("#today-game");
// modal variables
var gameModal = $("#modal-game-error");
var barModal = $("#modal-bar-error");
var closeModalBtn = $(".close");

// function to render game schedules from inputed date
var getSchedules = function(inputDate) {
    // parse the stringified date, did this since I was having errors when trying to read implemented inputDate value
    var inputDate = JSON.parse(inputDate);
    // console.log(inputDate);

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

    fetch(apiUrl, requestOptions).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        // if results = 0, there are no games for selected date
        if (data.results === 0) {
            // console.log("NO GAMES");
            // make this a modal message!!
            // alert("No Games Scheduled on " + inputDate);
            gameModal.addClass("is-clipped is-active");
        } else {
            // else render game card for each in array
            for (var i = 0; i < data.response.length; i++) {
                // home team
                var homeTeam = data.response[i].teams.home.name;
                var homeTeamLogo = data.response[i].teams.home.logo;
                
                // away team
                var awayTeam = data.response[i].teams.visitors.name;
                var awayTeamLogo = data.response[i].teams.visitors.logo;
                
                // game status
                var gameStatus = data.response[i].status.long;
                // console.log(gameStatus);
                
                // pass city name as parameter for brewery call? [keep in, but may not work]
                var gameCity = data.response[i].arena.city;
                // console.log(gameCity);
    
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
        }
        }).catch(error => console.log('error', error));
};

// function to render bars from city search
var getBars = function(city){
    // brewery api start
    var cityName = city;

    // format api url using city name and display max 10 items
    var breweryApiUrl = "https://api.openbrewerydb.org/breweries?by_city=" + cityName + "&per_page=10";
    
    fetch(breweryApiUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        // IF no bars are found for specified city display modal
        if (data.length === 0) {
            // !!make this a modal message!!
            // alert("No bars found. Please try widening your search!");
            barModal.addClass("is-clipped is-active");
        } else {
            // ELSE render bars from data
            // console.log(data[0].city);
            for (var i = 0; i < data.length; i++) {
                // console.log(data[i].brewery_type);
                var breweryType = data[i].brewery_type;

                // conditional to exclude non-visitable bars
                if (breweryType === "planning" || breweryType === "nano" || breweryType === "contract" || breweryType === "large") {
                    console.log("breweries hidden");
                } else {
                    // ELSE populate list from remaining array data
                    var breweryName = data[i].name;
                    var barStreetAddress = data[i].street;
                    var barCity = data[i].city;
                    var barUrl = data[i].website_url;
        
                    var barInfoContainer = $("<div class='is-flex is-flex-direction-row'>");
        
                    //add container to make cards even width - center text or keep text left?
                    var barCard = $("<div class='card mb-1 px-1 container'>");
                    var barCardContent = $("<div class='card-content'>");
                    var barCardFooter = $("<footer class='card-footer'>");
        
                    var barName = $("<h3 class='barname has-text-weight-semibold has-text-left'>");
                    // barName.attr("id", breweryName);
                    barName.text(breweryName);
        
                    var barAddress = $("<address class='baraddress has-text-left'>");
                    // barAddress.attr("id", barStreetAddress);
                    barAddress.append(barStreetAddress);
                    // barAddress.append(barCity);
        
                    var barWebsite = $("<a>");
                    // barWebsite.attr("id", barUrl);
                    barWebsite.attr("href", barUrl);
                    barWebsite.text("website");
        
                    var footerWebsite = $("<p class='card-footer-item'>");
                    var footerWebsiteSpan = $("<span>");
                    footerWebsiteSpan.text("View ");
                    footerWebsiteSpan.append(barWebsite);
                    footerWebsite.append(footerWebsiteSpan);
        
                    var footerFavorite = $("<p class='favorite card-footer-item is-clickable'>");
                    // footerFavorite.attr("id", "favorite");

                    var footerFavoriteSpan = $("<span>");
                    footerFavorite.text("Favorite");
                    footerFavorite.append(footerFavoriteSpan);

                    footerFavorite.on("click", faveBar);
        
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
};

var faveBar = function(event) {
    var barName = $(this).parent().siblings().children()[0].textContent;
    console.log(barName);

    var barAddress = $(this).parent().siblings().children()[1].textContent;
    console.log(barAddress);

    var barStorage = {
        name: barName,
        address: barAddress
    };

    var faveBarsArr = localStorage.getItem("faveBars");

    if(faveBarsArr === null) {
        faveBarsArr = [];
    } else {
        faveBarsArr = JSON.parse(faveBarsArr);
        renderSavedBars();
    }

    // faveBarsArr.push(barStorage);

    localStorage.setItem("faveBars", JSON.stringify(barStorage));
    renderSavedBars();
    // var newFaveBar = JSON.stringify(faveBarsArr);
    // console.log(faveBarsArr);
};

// create new elements from favorited bars that persist on refresh
var renderSavedBars = function() {
    var faveBarsArr = localStorage.getItem("faveBars");
    faveBarsArr = JSON.parse(faveBarsArr);
    // console.log(faveBarsArr);

    var savedBarInfoContainer = $("<div class='is-flex is-flex-direction-row fave-bar-card'>");
    var barCard = $("<div class='card mb-1 px-1 container fave-card-bg'>");

    var barCardContent = $("<div class='card-content'>");
    var barCardFooter = $("<footer class='card-footer'>");
    var footerUnFavorite = $("<p class='card-footer-item is-clickable'>");


    var footerUnFavoriteSpan = $("<span>");
    footerUnFavorite.text("Remove Favorite");
    footerUnFavorite.append(footerUnFavoriteSpan);
    barCardFooter.append(footerUnFavorite);
    footerUnFavorite.on("click", removeBar);

    var barName = $("<h3 class='barname has-text-weight-semibold has-text-left' id='" + faveBarsArr.name + "'>");
    barName.text(faveBarsArr.name);

    var barAddress = $("<address class='baraddress has-text-left'>");
    // barAddress.attr("id", barStreetAddress);
    barAddress.text(faveBarsArr.address);
    barCardContent.append(barName);
    barCardContent.append(barAddress);

    barCard.append(barCardContent);
    barCard.append(barCardFooter);
    savedBarInfoContainer.append(barCard);
    barContainer.append(savedBarInfoContainer);
};

// remove favorite with button click function

var removeBar = function(event) {
    // grab locally stored array, parse
    var getItem = JSON.parse(localStorage.getItem("faveBars"));

    console.log("button clicked");


    console.log(getItem);

    // grab id from selected card, parse
    // var faveCardIndex = $(this).parent().siblings().children().attr("id");
    // faveCardIndex = JSON.parse(faveCardIndex);
    // console.log(typeof faveCardId);

    // var matchedObject = $(this).parent().siblings().children().attr("id");
    // console.log(matchedObject);

    // // var matchedObject = getItem[i];
    
    // for (var i=0; getItem.length; i++){
    //     var barName = getItem[i].name;
    //     console.log(barName);
    //     // check against array for matching name
    //     // if (matchedObject === barName){
    //     //     console.log("match");
    //     //     var indexOf = getItem.indexOf(barName);
    //     //     console.log(indexOf);
    //     // };

    // }



    //     // if (faveCardId === getItem[i]) {
    //     //     console.log("match found");
    //     // }
    // } 

    // // grab the bar name of clicked element
    // var removeBarName = $(this).parent().siblings().children()[0].textContent;
    // console.log(removeBarName);

    // for (var i=0; getItem.length; i++){
    //     if (removeBarName === getItem[i].name) {
    //         console.log("match found");
    //         console.log(removeBarName);
    //         console.log(getItem[i].name);


    //         var matchedObj = getItem[i];
    //         console.log(matchedObj);

    //         var indexOfObject = getItem.indexOf(matchedObj);
    //         console.log(indexOfObject);

    //         getItem.faveBars = getItem.faveBars.splice((indexOfObject), 1);

    //         console.log(getItem);
            
    //     }
    // }


    // var removeBarAddress = $(this).parent().siblings().children()[1].textContent;
    // console.log(removeBarAddress);

};

// function to get value from city search, pass to getBars()
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

// function to get value from datepicker, send to getSchedules()
var gameFormHandler = function(event) {
    // event.preventDefault();
    // clear old content
    scheduleContent.html("");

    // stringify value, was having issues when passing to function, this seemed to work
    var inputDate = JSON.stringify(datePicker.val());
    // console.log(inputDate);

    // send value as parameter to getSchedules
    getSchedules(inputDate);
};

// EVENT HANDLERS SECTION //

// event handler for city search input
citySearch.on("submit", formHandler);
searchBtn.on("click", formHandler);

// event handler for datepicker
gameSearchBtn.on("click", gameFormHandler);
todayGameBtn.on("click", function(){
    // use currentDate value set with moment.js
    var inputDate = JSON.stringify(currentDate);

    // clear old content
    scheduleContent.html("");

    // send value as parameter to getSchedules()
    getSchedules(inputDate);
});

// click event for closing a modal
closeModalBtn.on("click", function(){
    // console.log("close clicked");
    gameModal.removeClass("is-clipped is-active");
    barModal.removeClass("is-clipped is-active");
});

// getSchedules();
// getBars();