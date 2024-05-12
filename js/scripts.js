/* Part 2: IIFE */
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

    return {
	add: add,
	getAll: getAll,
	find: find,
    };

})();

songRepository.add(
    {
	name: 'You\'re On Your Own, Kid',
	album: 'Midnights',
	year: 2022,
	category: ['happy', 'break up'],
    }
)

/* Part 1: forEach() Loops */

songRepository.getAll().forEach(function(song) {
    document.write(`<p/>The song \"${song.name}\" is from the album \"${song.album}\" which came out in ${song.year}.</p>`)
});

/*
for (let i = 0; i < songList.length; i++) {
    output = `${songList[i].name} (${songList[i].year})`;
    let exclamation = songList[i].year < 2020 ? ' <-- Wow! This song is from The Great Before Times!' : '';
    document.write("<p>" + output + exclamation + "</p>");
}

function printArrayDetails(){
    for (let i = 0; i < songList.length; i++){
	output = `${songList[i].name} (${songList[i].year})`;
	let exclamation = songList[i].year < 2020 ? ' <-- Wow! This song is from The Great Before Times!' : '';
	document.write("<p>" + output + exclamation + "</p>");
    }
}

printArrayDetails();

*/
