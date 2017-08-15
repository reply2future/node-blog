var quill = new Quill('#editor', {
	theme: 'snow',
	placeholder: 'Compose an epic...',
	modules: {
		toolbar: [
			['bold', 'italic'],
			['link', 'blockquote', 'code-block', 'image'],
			[{ list: 'ordered' }, { list: 'bullet' }]
		]
	}
});
$('#article-form').submit(function(event){
	// stop form from  submitting normally
	event.preventDefault();

	// get values
	var $form = $(this),
		url = $form.attr('action'),
		titleValue = $form.find('input[name=title]').val(),
		slugValue = $form.find('input[name=slug]').val(),
		tagsValue = $form.find('input[name=tags]').val().split(',');

	var sendData = {
		title: titleValue,
		slug: slugValue,
		tags: tagsValue,
		text: quill.getContents()
	};

	let alert = $('#info-alert');
	$.ajax({
		url: '/articles',
		type: 'POST',
		data: JSON.stringify(sendData), 
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
	}).done(function(doneData, doneStatus, doneXHR){
		if(doneXHR.status == 201){
			// create successfully
			alert.addClass('alert alert-success');
		} else {
			// TODO: other status
			alert.addClass('alert alert-warning');
		}
		alert.append(doneData.message);
	}).fail(function(failXHR, failStatus, errorThrow){
		alert.addClass('alert alert-danger').append(failXHR.responseJSON.message);
	}).always(function(){
		alert.show();
	});
});
