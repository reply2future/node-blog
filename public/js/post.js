var toolbarOptions = [
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

	['bold', 'italic', 'underline', 'strike'],        // toggled buttons
	['blockquote', 'code-block', 'link', 'image'],

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

// Get text object if it have
var rawText = $('#editor').attr('value');
if(rawText){
	quill.setContents(JSON.parse(rawText));
}

$('#article-form').submit(function(event){
	// stop form from  submitting normally
	event.preventDefault();

	// get values
	var $form = $(this),
		formUrl = $form.attr('action'),
		formMethod = $form.attr('method'),
		titleValue = $form.find('input[name=title]').val(),
		slugValue = $form.find('input[name=slug]').val(),
		tagsValue = $form.find('input[name=tags]').val().split(',');

	var sendData = {
		title: titleValue,
		slug: slugValue,
		tags: tagsValue,
		text: quill.getContents(),
		lastModified: Date.now()
	};

	let alert = $('#info-alert');
	$.ajax({
		url: formUrl,
		type: formMethod,
		data: JSON.stringify(sendData), 
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
	}).done(function(doneData, doneStatus, doneXHR){
		if((doneXHR.status == 201 && formMethod == 'POST') ||
				(doneXHR.status == 200 && formMethod == 'PUT')){
			// create successfully
			alert.addClass('alert alert-success');
		} else {
			alert.addClass('alert alert-warning');
		}
		alert.append(doneData.message);
	}).fail(function(failXHR, failStatus, errorThrow){
		alert.addClass('alert alert-danger').append(errorThrow);
	}).always(function(){
		alert.show();
	});
});
