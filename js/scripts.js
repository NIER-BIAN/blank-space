/* 0. IIFE  */
let songRepository = (function () {
    
    let songList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    // apiUrl = 'https://api.lyrics.ovh/v1/Coldplay'

    //----- loading message for loadSongsFromAPI() & loadDetailsFromAPI() --------//
    
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
    // which in turns calls songModalDisplay.showModal (songTitle, songText)
    
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
	    songModalDisplay.showModal(song.name, song.height, song.imageUrl);
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

/* 2. Modals */

let songModalDisplay = (function () {

    let modalContainer = document.querySelector('.modal-container');

    function showModal(SongTitle, SongText, SongImageUrl) {
	modalContainer.classList.add('is-visible');

	// Clear all existing html in container
	// note the .innerHTML call
	// modalContainer is the big shaded area when modal is open
	modalContainer.innerHTML = '';

	// Create modal-content div
	// modalContent is the small window that the actual modal
	let modalContent = document.createElement('div');
	modalContent.classList.add('modal-content');
	modalContainer.appendChild(modalContent);
	
	// Add other modal elements as children to modalContent
	
	// 1 of 4: close button
	let modalCloseButton = document.createElement('button');
	modalCloseButton.classList.add('modal-close-button');
	modalCloseButton.innerText = 'Close';
	//Event listener for exiting modal
	modalCloseButton.addEventListener('click', hideModal);
	modalContent.appendChild(modalCloseButton);

	// 2 of 4: title
	let modalTitle = document.createElement('h1');
	
	//tweak name cos PokeAPI didn't capitalise first letter
	tweakedName = SongTitle.charAt(0).toUpperCase() + SongTitle.slice(1);
	
	modalTitle.innerText = tweakedName;
	modalContent.appendChild(modalTitle);

	// 3 of 4: text
	let modalText = document.createElement('p');
	modalText.innerText = `Height: ${SongText}`;
	modalContent.appendChild(modalText);

	// 4 of 4: image
	let modalImage = document.createElement('img');
	modalImage.src = SongImageUrl;
	modalContent.appendChild(modalImage);
    }

    let takePromiseOutOfLimbo;
    // when the confirm button calls hideModal this will be set to false
    // whenever hideModal is called any other way (by pressing the cancel button
    // by clicking event, by esc keydown event, by the close button
    // this will be true, and the promise will be rejeced
    
    function hideModal() {
	modalContainer.classList.remove('is-visible');
	
	// the promise taken out of limbo and rejected
	if (takePromiseOutOfLimbo) {
	    takePromiseOutOfLimbo(); // this var was the reject function of the promise
	    takePromiseOutOfLimbo = null;
	}
    }

    // also call hideModal if ESC is pressed when modal is visible
    window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
	    hideModal();
	}
    });
    
    // also call hideModal if user clicks outside of modal while modal open
    modalContainer.addEventListener('click', (event) => {
	let target = event.target;
	// console.log(target);
	if (target === modalContainer) {
	    hideModal();
	}
    });

    function showDialog(header, message, imageUrl) {

	// Borrows showModal's container html div
	// as well as its functions to add title, message, and close button
	// as well as all 3 closing methods since keydown and click event listeners were added to .modal-container

	let dialogContainer = document.querySelector('.modal-container');

	// Add confirm and cancel button
	let dialogContent = modalContainer.querySelector('.modal-content');

	let confirmButton = document.createElement('button');
	confirmButton.classList.add('dialog-confirm');
	confirmButton.innerText = 'Confirm';
	dialogContent.appendChild(confirmButton);

	let cancelButton = document.createElement('button');
	cancelButton.classList.add('modal-cancel');
	cancelButton.innerText = 'Cancel';
	dialogContent.appendChild(cancelButton);

	// showDialog returns a promise that resolves when confirmed
	// Rejects when the user exits the dialog or clicks "Cancel"
	return new Promise((resolve, reject) => {
	    
	    cancelButton.addEventListener('click', hideModal); //hideModal will do the rejecting of the promise

	    confirmButton.addEventListener('click', () => {
		takePromiseOutOfLimbo = null; // Make sure to reset this from previous runs
		hideModal();
		resolve();
	    });

	    // If user closes the modal without confirming or canceling
	    // i.e. exit with an ESC keydown or close-button click
	    // the promise need to be taken out of limbo and rejected
	    // The reject function of the promise is saved in  variable
	    takePromiseOutOfLimbo = reject;
	});
    }

    return {
	showModal : showModal,
	showDialog : showDialog,

	// not exposed: hideModal()
    };
})();

//Event-listener for showing modal

document.querySelector('.show-modal-button').addEventListener('click', () => {
    songModalDisplay.showModal('Bejeweled', 'Putting someone first only works when you\'re in their top five.');
});

document.querySelector('.show-dialog-button').addEventListener('click', () => {
    //showDialog returns a promise
    songModalDisplay.showDialog('Bejeweled', 'Putting someone first only works when you\'re in their top five.').then(function() {
	alert('confirmed');
    }, () => {
	alert('not confirmed');
    });
});
