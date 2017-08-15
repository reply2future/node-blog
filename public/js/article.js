var quill = new Quill('#editor', {
		theme: 'bubble',
		readOnly: true
	});
var text = $('#hidden-text').text();
quill.setContents(JSON.parse(text));
		

