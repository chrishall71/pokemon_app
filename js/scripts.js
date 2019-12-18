var pokemonRepository = (function () { 
	var repository = [];
	var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	var $modalContainer = document.querySelector('#modal-container');
	
	//adds new Pokemon to var repository
	function add(item) {
		repository.push(item)
	}

	//Function used to return Pokemon object array
	function getAll() {
		return repository;
	}

	function addListItem (pokemon) {
		var $pokemonList = document.querySelector('.pokemon-list');
		var $listItem = document.createElement ('li'); 
		var $listButton = document.createElement('button'); 
		//adds pokemon name to text within button
		$listButton.innerText = pokemon.name; 
		//Adds a CSS class to button using classList.add metod
		$listButton.classList.add('button-style'); 
		//Adds bottom element to the 'li'
		$listItem.appendChild($listButton);
		//Adds the 'li' to 'ul' with pokemonList class in index file
		$pokemonList.appendChild($listItem); 
		//Calls showDetails function when botton is clicked
		$listButton.addEventListener('click', function() {
			showDetails(pokemon); //creatning the button as function
		});
	}
	
	// Function to load Pokemon list from API
	function loadList() {
		return fetch(apiUrl).then(function (response) {
			return response.json();
		}).then(function (json) {
			json.results.forEach(function (item) {
				var pokemon = {
					name:  item.name.charAt(0).toUpperCase() + item.name.slice(1),
					detailsUrl: item.url
				};
				add(pokemon);
			});
		}).catch(function (e) {
			console.error(e);
		})
	}

	// Load details of each Pokemon that is clicked
	function loadDetails(item) {
		var url = item.detailsUrl;
		return fetch(url).then(function (response) {
		  return response.json();
		}).then(function (details) {
		  // Now we add the details to the item
		  item.imageUrl = details.sprites.front_default;
		  item.height = details.height;
		  //item.types = Object.keys(details.types);
		  if (details.types.length === 2 ) {
					item.types = [details.types[0].type.name, details.types[1].type.name];
				} else {
					item.types = [details.types[0].type.name];
				}
		}).catch(function (e) {
		  console.error(e);
		});
	 }

	//Function to show details of each Pokemon
	 function showDetails(item) {
		pokemonRepository.loadDetails(item).then(function() {
		showModal (item);
		});
	}


	//function to show modal for Pokemon data & add classList
	function showModal (item) {
		//Clear all existing modal content
		$modalContainer.innerHTML ='';

		var modal = document.createElement('div');
		modal.classList.add('modal');

		var closeButtonElement = document.createElement('button');
		closeButtonElement.classList.add('modal-close');
		closeButtonElement.innerText = 'Close';
		closeButtonElement.addEventListener('click', hideModal);

		var nameElement =document.createElement('h1');
		nameElement.innerText = item.name.charAt(0).toUpperCase() + item.name.slice(1);

		var imageElement = document.createElement('img');
		imageElement.src = item.imageUrl;
		imageElement.classList.add('modal-img');

		var heightElement = document.createElement('p');
		heightElement.innerText = 'Height: ' + item.height + 'm';

		var typesElement = document.createElement('p');
		typesElement.innerText = 'Type(s): ' + item.types;

		modal.appendChild(closeButtonElement);
		modal.appendChild(nameElement);
		modal.appendChild(heightElement);
		modal.appendChild(imageElement);
		modal.appendChild(typesElement);
		$modalContainer.appendChild(modal);

		$modalContainer.classList.add('is-visible');
	}

	// Function to close the modal
	function hideModal() {
		$modalContainer.classList.remove('is-visible');
	}

// Press escape key to close modal
 window.addEventListener('keydown', (e) => {
   if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
       hideModal();
     }
   });

// Click outside of the modal to close the modal
$modalContainer.addEventListener('click', (e) => {
  // Since this is also triggered when clicking INSIDE the modal
  // I only want the modal to close if the user clicks directly on the overlay
  var target = e.target;
  if (target === $modalContainer) {
    hideModal();
  }
});



	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		loadList: loadList,
		loadDetails: loadDetails,
		showDetails: showDetails,
		showModal: showModal,
	};
})();

pokemonRepository.loadList().then(function() {
	// Now the data is loaded!
	pokemonRepository.getAll().forEach(function(pokemon){
	  pokemonRepository.addListItem(pokemon);
	});
 });
