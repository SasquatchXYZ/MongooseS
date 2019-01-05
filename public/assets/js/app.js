$(function () {

  // Scrape Articles Button --------------------------------------------------------------------------------------------
  $("#scrape-articles").on('click', () => {

    $.ajax({
      method: 'GET',
      url: '/api/scrape'
    })
      .then(message => {
        console.log(message);
      });

     location.reload();
  });

  // Submit Note Button ------------------------------------------------------------------------------------------------
  $('#submit-note').on('click', function (event) {
    event.preventDefault();
    const thisId = $(this).attr('data-id');

    const newNote = {
      title: $('#note-title').val(),
      body: $('#note-body').val(),
      articleId: thisId,
      // updated: moment().format('HH:mm ddd D MMM YY')
    };
    // console.log(newNote);

    if (newNote.title === '' || newNote.body === '') {
      alert('Please include all fields for the note.')
    } else {
      $.ajax({
        method: 'POST',
        url: `/articles/${thisId}`,
        data: newNote
      })
        .then(data => console.log(data));

      $('#note-title').val('');
      $('#note-body').val('');

      location.reload()
    }
  });

  // Delete Note Button ------------------------------------------------------------------------------------------------
  $('.delete-note').on('click', function () {
    const noteId = $(this).attr('data-id');
    const articleId = $(this).attr('data-article');

    $.ajax({
      method: 'DELETE',
      url: `/articles/${articleId}/${noteId}`
    })
      .then(data => console.log(data));

    location.reload()
  });

  // Edit Note Button --------------------------------------------------------------------------------------------------
  $('.edit-note').on('click', function () {
    const noteId = $(this).attr('data-id');

    $.ajax({
      method: 'GET',
      url: `/notes/${noteId}`
    })
      .then(note => {
        $('.modal-body #update-title').val(note.title);
        $('.modal-body #update-body').val(note.body);
        $('.modal-footer #update-note')
          .attr({
            'data-id': note._id,
            'data-article': note.articleId
          });
        $('.modal').modal('show')
      });

  });

  // Update Note Button (Modal) ----------------------------------------------------------------------------------------
  $('#update-note').on('click', function () {
    const noteId = $(this).attr('data-id');
    const articleId = $(this).attr('data-article');

    const updatedNote = {
      title: $('#update-title').val(),
      body: $('#update-body').val(),
      articleId: articleId
    };
    // console.log(updatedNote);

    $.ajax({
      method: 'POST',
      url: `/notes/${noteId}`,
      data: updatedNote
    })
      .then(note => console.log(note));

    location.reload()
  })

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
