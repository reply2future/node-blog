var toolbarOptions = [
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

	['bold', 'italic', 'underline', 'strike'],        // toggled buttons
	['blockquote', 'code-block'],

	[{ 'header': 1 }, { 'header': 2 }],               // custom button values
	[{ 'list': 'ordered'}, { 'list': 'bullet' }],
	[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
	[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
	[{ 'direction': 'rtl' }],                         // text direction

	[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
	[{ 'font': [] }],
	[{ 'align': [] }],

	['clean']                                         // remove formatting button
];
var quill = new Quill('#editor', {
	theme: 'snow',
	placeholder: 'Compose an epic...',
	modules: {
		toolbar: toolbarOptions
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
