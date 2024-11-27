/*

  Main logic calls:
  
  - songRepository.loadSongsFromAPI()
  - songRepository.getAllSongs()
  - songRepository.showSongButton()
  
  further calls from here:
  showSongButton ->  addButtonEventHandler() -> showDetails -> loadDetailsFromAPI & showModal() -> loadDetailsFromAPI

*/

//==================================================================================

/* 1. tweak name cos PokeAPI didn't capitalise first letter */

/**
 * Tweaks the name by capitalizing the first letter.
 * 
 * Called by loadSongsFromAPI and showModal.
 * @param {string} name - The name to tweak.
 * @returns {string} The tweaked name with the first letter capitalized.
 */
function nameTweaker (name) {
    tweakedName = name.charAt(0).toUpperCase() + name.slice(1);
    return tweakedName;
}

//==================================================================================

/* 2. songRepository IIFE  */

/**
 * Song repository IIFE. Manages the list of songs and provides methods to interact with them.
 * @module songRepository
 */
let songRepository = (function () {
    
    let songList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    
    //---------------------------------------------------------------------------
    // hide loading message for loadSongsFromAPI()
    
    /**
     * Hides the loading message.
     * @function hideLoadingMessage
     */
    function hideLoadingMessage() {
	let container = document.querySelector('.loading-message-wrapper');
	let loadingMessage = document.querySelector('.lds-dual-ring');
	container.removeChild(loadingMessage);	
    }
    
    /**
     * Shows the loading message in the modal.
     * @function showModalLoadingMessage
     */
    function showModalLoadingMessage() {
	let loadingMessage = document.createElement('h3');
	let container = document.querySelector('.modal-loading-message-wrapper');
	loadingMessage.innerText = 'Loading. Please wait!';
	loadingMessage.classList.add('loading-message');
	container.appendChild(loadingMessage);
    }

    /**
     * Hides the loading message in the modal.
     * @function hideModalLoadingMessage
     */
    function hideModalLoadingMessage() {
	let container = document.querySelector('.modal-loading-message-wrapper');
	let loadingMessage = document.querySelector('.loading-message');
	container.removeChild(loadingMessage);	
    }

    //---------------------------------------------------------------------------
    // find
    
    /**
     * Finds a song by its name.
     * @param {string} searchTerm - The name of the song to search for.
     * @returns {Array<object>|string} An array of songs matching the search term, or a message if no songs are found.
     */
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
    
    //---------------------------------------------------------------------------
    // Func called by main logic 3 of 3: songRepository.showSongButton()

    /**
     * Loads details for a song from the API.
     * @param {object} item - The song object containing the details URL.
     * @returns {Promise<void>} A promise that resolves when the details are loaded.
     */
    function loadDetailsFromAPI(item) {
		
	let url = item.detailsUrl;

	//fetch returns promise
	return fetch(url).then(function (response) {
	    
	    return response.json();
	    
	}).then(function (details) {
	    
	    hideModalLoadingMessage();

	    // Now we add the details to the song
	    item.imageUrl = details.sprites.front_default;
	    item.height = details.height;
	    item.weight = details.weight;
	    item.types = details.types;
	    
	}).catch(function (errorMessage) {

	    hideModalLoadingMessage();
	    console.error(errorMessage);
	    
	});
    }

    /**
     * Displays song details in a modal.
     * @param {object} song - The song object containing the details to display.
     */
    function showModal(song) {

	// query for appropriate space to fill in DOM
	let modalTitle = $('.modal-title');
	let modalBody = $('.modal-body');

	let name = $('<h1>' + song.name + '</h1>');
	modalTitle.append(name);
	
	let image = $('<img class="modal-img" style="width:100%">');
	image.attr('src', song.imageUrl);
	modalBody.append(image);
	
	let height = $('<p>' + 'Height: ' + song.height + '</p>');
	modalBody.append(height);
	
	let weight = $('<p>' + 'Weight: ' + song.weight + '</p>');
	modalBody.append(weight);

	let typesArray = song.types.map((type) => type.type.name).join(', ')
	let types = $('<p>' + 'Types: ' + typesArray + '</p>');
	modalBody.append(types);
    }

    /**
     * Shows the details of a song.
     * @param {object} song - The song to show details for.
     */
    function showDetails(song) {

	// loadDetailsFromAPI returns a promise
	// the console.log(song) statement is placed inside the .then() method to ensure
	// details have been loaded before logging i.e. wait for asynchronous operation of fetch
	loadDetailsFromAPI(song).then(function () {
	    showModal(song);
	})
    }
    
    /**
     * Adds an event handler to a button to show song details.
     * @param {HTMLButtonElement} button - The button element.
     * @param {object} song - The song object.
     */
    function addButtonEventHandler(button, song) {
	button.addEventListener('click', function() {

	    showModalLoadingMessage();
	    
	    // Get a head start on empty old modal
	    // query for appropriate space to fill in DOM
	    let modalTitle = $('.modal-title');
	    let modalBody = $('.modal-body');
	    // empty what's been there before
	    modalTitle.empty();
	    modalBody.empty();
	    
	    showDetails(song);
	})
    }
    
     /**
     * Shows a button for a song in the song list.
     * @param {object} song - The song object.
     */
    function showSongButton(song) {
	
	let container = document.querySelector('.song-list');
	let listItem = document.createElement('li');
	listItem.classList.add('col-10');
	listItem.classList.add('col-sm-5');
	listItem.classList.add('col-md-3');
	listItem.classList.add('col-lg-2');
	listItem.classList.add('col-xlg-1');
	
	// Button
	let button = document.createElement('button');
	button.innerText = song.name;
	button.setAttribute('data-toggle', "modal");
	button.setAttribute('data-target', "#exampleModal");
	
	listItem.appendChild(button);
	container.appendChild(listItem);

	// Button event handler
	addButtonEventHandler(button, song);
    }
    
    //---------------------------------------------------------------------------
    // Func called by main logic 2 of 3: songRepository.getAllSongs()

    /**
     * Gets all songs in the song list.
     * @returns {Array<object>} The array of songs.
     */
    function getAllSongs() {
	return songList;
    }

    //---------------------------------------------------------------------------
    // Func called by main logic 1 of 3: songRepository.loadSongsFromAPI()

    /**
     * Pushes a song to the song list.
     * @param {object} song - The song object to push.
     * @returns {string|undefined} An error message if the input is invalid, otherwise undefined.
     */
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
    
    /**
     * Loads songs from the API.
     * @returns {Promise<void>} A promise that resolves when the songs are loaded.
     */
    function loadSongsFromAPI() {
	
	//fetch returns promise
	return fetch(apiUrl).then(function (response) {

	    return response.json();
	    
	}).then(function (json) {

	    hideLoadingMessage();
	    json.results.forEach(function (item) {

		//create song
		let song = {
		    name: nameTweaker(item.name),
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
    
    //---------------------------------------------------------------------------
    
    return {

	// Called in main logic
	loadSongsFromAPI: loadSongsFromAPI,
	getAllSongs: getAllSongs,
	showSongButton: showSongButton,
	
	find: find

    };

})();

//==================================================================================

/* 3. Main logic: List out all songs */

//loadSongsFromAPI() contacts API and pushes to songList
songRepository.loadSongsFromAPI().then(function() {
    
    // getAllSongs() returns songList
    songRepository.getAllSongs().forEach(function(pokemon){
	// for each song in songList, a button is created
	songRepository.showSongButton(pokemon);
    });
});
