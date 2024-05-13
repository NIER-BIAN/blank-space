/* 0. IIFE  */
let songRepository = (function () {
    
    let songList = [
	{
	    name: 'Blank Space',
	    album: '1989',
	    year: 2023,
	    category: ['happy', 'breakup'],
	},
	{
	    name: 'You Need To Calm Down',
	    album: 'Lover',
	    year: 2019,
	    category: ['happy'],
	},
	{
	    name: 'Death By A Thousand Cuts',
	    album: 'Lover',
	    year: 2019,
	    category: ['sad', 'breakup'],
	}
    ];

    function add(song) {
	
	/* Check if object*/
	if (typeof(song) !== 'object') {
	    return 'Added item must be object.';
	}

	/* Check if contains right fields*/
	expectedFields = ['name', 'album', 'year', 'category'].toString();
	songKeys = Object.keys(song).toString();
	if (songKeys !== expectedFields) {
	    return 'Added item must contain the fields name, album, year, and category.';
	}

	songList.push(song);
	
    }
    
    function getAll() {
	return songList;
    }

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

    // function to be passed to addButtonEventHandler in addListItem
    function showDetails(song) {
	console.log(song);
    }

    // function to be passed to addListItem
    function addButtonEventHandler(button, song) {
	button.addEventListener('click', function() {
	    showDetails(song);
	})
    }

    function addListItem(song) {
	
	let container = document.querySelector('.song-list');
	let listItem = document.createElement('li');

	// Button
	let button = document.createElement('button');
	button.innerText = song.name;
	button.classList.add('button__secondary');
	listItem.appendChild(button);
	container.appendChild(listItem);

	// Button event handler
	addButtonEventHandler(button, song);
    }

    return {
	
	add: add,
	getAll: getAll,
	find: find,
	addListItem: addListItem,

	//not exposed: addButtonEventHandler() and showDetails()
    };

})();

/* 1. List out all songs */

// getAll() calls addListItem(), which calls addButtonEventHandler(), which calls showDetails()
// out of chain at the time: find() and add()

songRepository.getAll().forEach(function(song) {
    songRepository.addListItem(song);
});
