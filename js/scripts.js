/* 0. IIFE  */
let songRepository = (function () {
    
    let songList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    // apiUrl = 'https://api.lyrics.ovh/v1/Coldplay'

    //--- loading message for loadSongsFromAPI() & loadDetailsFromAPI() ----------//
    
    function showLoadingMessage() {
	
	let loadingMessage = document.createElement('p');
	let container = document.querySelector('.loading-message-wrapper');
	
	loadingMessage.innerText = 'Loading. Please wait!';
	loadingMessage.classList.add('loading-message');
	
	container.appendChild(loadingMessage);
    }

    function hideLoadingMessage() {
	let container = document.querySelector('.loading-message-wrapper');
	let loadingMessage = document.querySelector('.loading-message');;
	
	container.removeChild(loadingMessage);
    }
    
    //------------- loadSongsFromAPI calls pushToSongList -------------------//
    
    function pushToSongList(song) {
	
	/* Check if object*/
	if (typeof(song) !== 'object') {
	    return 'Added item must be object.';
	}

	/* Check if contains right fields*/
	// expectedFields = ['name', 'album', 'year', 'category'].toString();
	// songKeys = Object.keys(song).toString();
	// if (songKeys !== expectedFields) {
	//    return 'Added item must contain the fields name, album, year, and category.';
	//}

	songList.push(song);
    }
    
    function loadSongsFromAPI() {

	showLoadingMessage();
	
	//fetch returns promise
	return fetch(apiUrl).then(function (response) {

	    return response.json();
	    
	}).then(function (json) {

	    hideLoadingMessage();
	    json.results.forEach(function (item) {

		//create song
		let song = {
		    name: item.name,
		    //loadDetailsFromAPI() will take detailsUrl as arg
		    detailsUrl: item.url
		};

		// push to songList
		pushToSongList(song);
	    });
	    
	}).catch(function (errorMessage) {

	    hideLoadingMessage();
	    console.error(errorMessage);
	    
	})
    }

    //-------------------------------- find ------------------------------//
    
    function find(searchTerm) {
	
	// anonymous arrow function
	// takes in parameter 'song' and returns true if name matches searchterm
	// filter() method of Array instances then shallow copies that portion
	result = songList.filter((song) => song.name == searchTerm);

	if (result.length === 0) {
	    return 'We found nothing.';
	}
	
	return result;
    }

    //------------------------------ getAllSongs ---------------------------//
    
    // getAllSongs() calls showSongButton() in main logic
    // which calls addButtonEventHandler()
    // which calls showDetails() which calls loadDetailsFromAPI
    
    function loadDetailsFromAPI(item) {

	showLoadingMessage();
	
	let url = item.detailsUrl;

	//fetch returns promise
	return fetch(url).then(function (response) {
	    
	    return response.json();
	    
	}).then(function (details) {

	    hideLoadingMessage();

	    // Now we add the details to the song
	    item.imageUrl = details.sprites.front_default;
	    item.height = details.height;
	    item.types = details.types;
	    
	}).catch(function (errorMessage) {

	    hideLoadingMessage();
	    console.error(errorMessage);
	    
	});
    }
    
    function showDetails(song) {

	// loadDetailsFromAPI returns a promise
	// the console.log(song) statement is placed inside the .then() method to ensure
	// details have been loaded before logging i.e. wait for asynchronous operation of fetch
	
	loadDetailsFromAPI(song).then(function () {
	    console.log(song);
	})
    }

    // function to be passed to addListItem
    function addButtonEventHandler(button, song) {
	button.addEventListener('click', function() {
	    showDetails(song);
	})
    }

    function showSongButton(song) {
	
	let container = document.querySelector('.song-list');
	let listItem = document.createElement('li');

	// Button
	let button = document.createElement('button');
	button.innerText = song.name;
	listItem.appendChild(button);
	container.appendChild(listItem);

	// Button event handler
	addButtonEventHandler(button, song);
    }

    function getAllSongs() {
	return songList;
    }

    return {
	
	pushToSongList: pushToSongList,
	loadSongsFromAPI: loadSongsFromAPI,
	find: find,
	showSongButton: showSongButton,
	getAllSongs: getAllSongs,

	//not exposed: addButtonEventHandler(), loadDetailsFromAPI(), and  showDetails()
    };

})();

/* 1. List out all songs */

//loadSongsFromAPI() contacts API and pushes to songList
songRepository.loadSongsFromAPI().then(function() {
    
    // getAllSongs() returns songList
    songRepository.getAllSongs().forEach(function(pokemon){
	// for each song in songList, a button is created
	songRepository.showSongButton(pokemon);
    });
});
