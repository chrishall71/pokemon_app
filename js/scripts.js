var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function addListItem(pokemon) {
    var pokemonList = $('.pokemon-list');
    //JQuery List Item & Button Tags Together with CSS-Class Styles
    var listItem = $(
      '<button type="button" id="button-style" class="btn btn-primary" data-toggle="modal"  data-target="#pokemon-modal"></button>'
    );
    pokemonList.append(listItem);
    listItem.text(pokemon.name);
    listItem.on('click', function() {
      showDetails(pokemon);
    });
  }

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
    return $.ajax(apiUrl, { dataType: 'json' })
      .then(function(item) {
        $.each(item.results, function(index, item) {
          var pokemon = {
            name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function(details) {
        /* Replaced Fectch With Ajax*/
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = Object.keys(details.types);
        if (details.types.length === 2) {
          item.types = [details.types[0].type.name, details.types[1].type.name];
        } else {
          item.types = [details.types[0].type.name];
        }
      })
      .catch(function(error) {
        document.write(error);
      });
  }

  function showModal(item) {
    var name = $('h4');
    name.html(item.name.charAt(0).toUpperCase() + item.name.slice(1));
    var image = $('<img src="' + item.imageUrl + '" class="modal-img">');
    $('div.pokemon-img').html(image);
    var height = $('div.pokemon-height');
    height.html('Height: ' + item.height);
    var elements = $('div.pokemon-elements');
    elements.html('Element(s): ' + item.types);
  }

  //Search for Pokemon by Name
  $(document).ready(function() {
    $('.search').on('keyup', function() {
      var value = $(this)
        .val()
        .toLowerCase();
      $('.pokemon-list button').filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
  });

  return {
    add: add,
    catchAll: catchAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal
  };
})();

pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.catchAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
