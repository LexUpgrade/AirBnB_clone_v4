$(document).ready( function () {
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};
  const checkedLocations = {};

  $("div.amenities > div.popover > ul > li > input[type='checkbox']").change( function () {
    const id = this.getAttribute('data-id');
    const name = this.getAttribute('data-name');

    if (this.checked) {
      checkedAmenities[id] = name;
    } else {
      delete checkedAmenities[id];
    }

    const amenities = Object.values(checkedAmenities).join(', ');
    if (amenities.length > 0) {
      $('div.amenities h4').text(amenities);
    } else {
      $('div.amenities h4').html('&nbsp;');
    }
  });

  $("div.locations > div.popover > ul > li > h2 > input[type='checkbox']").change( function () {
    const id = this.getAttribute('data-id');
    const name = this.getAttribute('data-name');

    if (this.checked) {
      checkedStates[id] = name;
      checkedLocations[id] = name;
    } else {
      delete checkedStates[id];
      delete checkedLocations[id];
    }

    const locations = Object.values(checkedLocations).join(', ');
    if (locations.length > 0) {
      $('div.locations h4').text(locations);
    } else {
      $('div.locations h4').html('&nbsp;');
    }
  });

  $("div.locations > div.popover > ul > li > ul > li >input[type='checkbox']").change( function () {
    const id = this.getAttribute('data-id');
    const name = this.getAttribute('data-name');

    if (this.checked) {
      checkedCities[id] = name;
      checkedLocations[id] = name;
    } else {
      delete checkedCities[id];
      delete checkedLocations[id];
    }

    const locations = Object.values(checkedLocations).join(', ');
    if (locations.length > 0) {
      $('div.locations h4').text(locations);
    } else {
      $('div.locations h4').html('&nbsp;');
    }
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    type: 'POST',
    dataType: 'json',
    headers: { 'Content-Type': 'application/json'}
  }).done( function (places) {
    createPlaceArticle(places);
  });

  $('button').click( function () {
    $('section.places > article').remove();
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify({'amenities': Object.keys(checkedAmenities), 'states': Object.keys(checkedStates), 'cities': Object.keys(checkedCities)}),
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json'
    }).done( function (places) {
      createPlaceArticle(places); 
    });
  });
});

function createPlaceArticle(places) {
  $.each( places, function (index, place) {
    const article = $('<article/>').appendTo('section.places');

    const titleBox = $('<div/>', {'class': 'title_box' }).appendTo(article);
    $('<h2/>').text(place.name).appendTo(titleBox);
    $('<div/>', {'class': 'price_by_night'}).text('$' + place.price_by_night).appendTo(titleBox);

    const information = $('<div/>', {'class': 'information'}).appendTo($('article'));
    $('<div/>', {'class': 'max_guest'}).text(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`).appendTo(information);
    $('<div/>', {'class': 'number_rooms'}).text(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`).appendTo(information);
    $('<div/>', {'class': 'number_bathrooms'}).text(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`).appendTo(information);
  });
}
