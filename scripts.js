let starwarsRepository = (function () {
	let repository = [];
	let apiUrl = 'https://swapi.co/api/people/';

function add (item) {
	repository.push(item)
}

function catchAll() {
	return repository;
}

function addListItem (people) {
	let starwars = $('.starwars-list');
	//add a li and append to Ul
	let listItem = $('<li></li>');
	$(starwars).append(listItem);
	//add a button and class
	let listButton = $('<button class= "button-style"></button>');
	$(listButton).text(people.name);
	$(listItem).append (listButton);
	//add Event Listner to display showDetails funcion
	listButton.on('click', function() {
		showDetails(people);
	});
}
function showDetails(item) {
    starwarsRepository.loadDetails(item).then(function() {
      showModal(item);
    });



})();