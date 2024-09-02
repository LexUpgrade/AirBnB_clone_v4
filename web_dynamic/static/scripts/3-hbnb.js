$(document).ready( function () {
  const check_list = {};

  $("div.amenities input").change( function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');

    if ( $(this).is(':checked') ) {
      check_list[id] = name;
    } else {
      delete check_list[id];
    }

    const checkedItems = Object.values(check_list).join(', ');
    if (checkedItems.length > 0) {
      $('div.amenities h4').text(checkedItems);
    } else {
      $('div.amenities h4').html('&nbsp;');
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
    console.log(places);
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
  });
});
