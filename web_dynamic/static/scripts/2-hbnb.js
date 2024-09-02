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

  $.get('http://localhost:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });
});
