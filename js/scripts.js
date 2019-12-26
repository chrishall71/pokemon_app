var pokemonRepository = (function() {
	var repository = [];
	var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	//var modalContainer = $('#modal-container');
	
	function addListItem(pokemon) {
		var pokemonList = $('.pokemon-list'); 
	//JQuery List Item & Button Tags Together with CSS-Class Styles 
var listItem = $('<button type="button" id="button-style" class="btn btn-primary" data-toggle="modal"  data-target="#pokemon-modal"></button>');
	pokemonList.append(listItem);
	listItem.text(pokemon.name);
	listItem.on('click', function() {
    showDetails(pokemon);
  	});
}

  /*function addListItem(pokemon) {
    var pokemonList = $('.pokemon-list'); 
    //JQuery List Item & Button Tags Together with CSS-Class Styles 
    var listItem = $('<li></li>');
    var listButton = $('<button class="button-style"></button>');
    $(listButton).text(pokemon.name);
    $(listItem).append(listButton);
    $(pokemonList).append(listItem);
    listButton.on('click', function() {
      showDetails(pokemon);
    });
  }*/

//Function used to show details of each Pokemon
	function showDetails(item) {
		pokemonRepository.loadDetails(item).then(function() {
		showModal(item);
	});
}
   //adds new Pokemon to var repository
	function add(item) {   
		repository.push(item);
	}

	//Function Used To Return Pokedex Object Array
	function catchAll() {
		return repository;
	}

  // Function to load Pokemon list from API
	function loadList() {
		return $.ajax(apiUrl, {dataType: 'json'})
		.then (function (item) {  
			$.each(item.results, function(index, item) {
			var pokemon = {
				name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
				detailsUrl: item.url
			};
			add (pokemon);
			});
		})  
		.catch (function (e) {
			console.error(e);
		});
	}

	function loadDetails(item) {
		var url = item.detailsUrl;
		return $.ajax(url).then(function(details) {
			/* Replaced Fectch With Ajax*/
			item.imageUrl = details.sprites.front_default;
			item.height = details.height;
			item.types = Object.keys(details.types);
			if (details.types.length === 2){
			item.types = [details.types[0].type.name, details.types[1].type.name];
			} else {
			item.types = [details.types[0].type.name];
			}
		}).catch(function(error) {
			document.write(error);
		});
  	}
  
	function showModal (item){
		//modalContainer.html ('');
		//var closeButtonElement = $ ('<button class="modal-close"></button>');
		//closeButtonElement.html ('Close');
		//closeButtonElement.on('click', hideModal);

		var name = $('h4');
		name.html(item.name.charAt(0).toUpperCase() + item.name.slice(1));
		
		//var modal = $('.modal-body');
		
		var image = $('<img src="' + item.imageUrl + '" class="modal-img">');
		$('div.pokemon-img').html(image)
		//image.attr('src', item.imageUrl);

		var height = $('div.pokemon-height');
		height.html('Height: ' + item.height);

		var elements = $('div.pokemon-elements');
		elements.html ('Element(s): ' + item.types);
	
		
		//modal.append(closeButtonElement);
		/*modal.append(name);
		modal.append(height);
		modal.append(image);
		modal.append(types);
		modalContainer.append(modal);
		
		modalContainer.addClass ('is-visible');*/
	}




	//Funciont to close the modal
	/*unction hideModal () {
	modalContainer.removeClass('is-visible');
	} */
	// Press escape key to close modal
	/*$(window).on('keydown', function (event) {
	if (event.key === 'Escape' && modalContainer.hasClass('is-visible')) {
		hideModal();
		}
	});

	// Click outside of the modal to close the modal
	modalContainer.on('click', function (event) {
	// Since this is also triggered when clicking INSIDE the modal
	// I only want the modal to close if the user clicks directly on the overlay

	if (event.target === this) {
	hideModal();
	}
	});*/

	return {
	add: add,
	catchAll: catchAll,
	addListItem: addListItem,
	loadList: loadList,
	loadDetails: loadDetails,
	showDetails: showDetails,
	showModal: showModal,
	};
})(); 

	pokemonRepository.loadList().then(function() {
	// Now the data is loaded!
	pokemonRepository.catchAll().forEach(function(pokemon){
	pokemonRepository.addListItem(pokemon);
	});
	});

