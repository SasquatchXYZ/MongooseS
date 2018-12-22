/*
$.getJSON('/articles', function(data) {
  console.log(data);
  for (let k = 0; k < data.length; k++) {
    $('#articles').append(`<p data-id="${data[k]._id}">${data[k].title}<br/>${data[k].link}</p>`)
  }
});

$(document).on('click', 'p', function () {
  $('#notes').empty();
  const thisId = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: `/articles/${thisId}`
  })
    .then(data => {
      console.log(data);
      $('#notes').append(`<h2>${data.title}</h2>`);
      $('#notes').append("<input id='title-input' name='title'>");
      $('#notes').append("<textarea id='body-input' name='body'></textarea>");
      $('#notes').append(`<button data-id='${data._id}' id='save-note'>Save Note</button>`);

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

  $('#title-input').val();
  $('#body-input').val()
});*/
