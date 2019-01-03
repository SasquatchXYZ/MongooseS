$(function () {
  const articlesArray = [];

  // Scrape Articles Button --------------------------------------------------------------------------------------------
  $("#scrape-articles").on('click', () => {

    /*    $.ajax({
          method: 'GET',
          url: '/api/articles'
        })
          .then(data => console.log(data))
      })*/

    $.ajax({
      method: 'GET',
      url: '/api/scrape'
    })
      .then(message => console.log(message))
  });

  // Submit Note Button ------------------------------------------------------------------------------------------------
  $('#submit-note').on('click', function (event) {
    event.preventDefault();
    const thisId = $(this).attr('data-id');
    console.log(thisId);

    const newNote = {
      title: $('#note-title').val(),
      body: $('#note-body').val()
  };

  console.log(newNote);

  $.ajax({
    method: 'POST',
    url: `/articles/${thisId}`,
    data: newNote
  })
    .then(data => console.log(data))
  });

  $('#note-title').val('');
  $('#note-body').val('');

});

/*$(document).on('click', '#scrape-articles', function() {
  console.log('button clicked')
});*/

/*$.getJSON('/articles', function(data) {
  console.log(data);
  for (let k = 0; k < data.length; k++) {
    $('#articles').append(`<p data-id="${data[k]._id}">${data[k].title}<br/>${data[k].link}</p>`)
  }
});
$(document).on('click', '#show-articles', () => {
  $.ajax({
    method: 'GET'
  })
});

$(document).on('click', 'h5', function () {
  $('#notes').empty();
  const thisId = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: `/articles/${thisId}`
  })
    .then(data => {
      console.log(data);
      $('#notes').append(`<h2>${data.title}</h2>`)
        .append("<input id='title-input' name='title'>")
        .append("<textarea id='body-input' name='body'></textarea>")
        .append(`<button data-id='${data._id}' id='save-note'>Save Note</button>`);

      if (data.note) {
        $('#title-input').val(data.note.title);
        $('#body-input').val(data.note.body)
      }
    });
});

$(document).on('click', '#save-note', function() {
  const thisID = $(this).attr('data-id');

  $.ajax({
    method: 'POST',
    url: `/articles/${thisID}`,
    data: {
      title: $('#title-input').val(),
      body: $('#body-input').val()
    }
  })
    .then(data => {
      console.log(data);
      $('#notes').empty()
    });

  $('#title-input').val('');
  $('#body-input').val('')
});*/
