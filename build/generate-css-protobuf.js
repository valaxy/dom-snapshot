// generate the css protobuf
// copy to browser to execute and copy back output string in console
(function () {

	// convert -webkit-filter to webkitFilter
	var normalizeName = function (name) {
		var blocks = name.split('-')
		if (blocks[0] == '') { // head is '-'
			blocks.splice(0, 1)
		}
		var firstName = blocks[0]
		var lastName = ''
		for (var i = 1; i < blocks.length; i++) {
			lastName += blocks[i][0].toUpperCase() + blocks[i].substr(1)
		}
		return firstName + lastName
	}


	var code = 'message ElementCss {\n'
	var declaration = getComputedStyle(document.body)
	for (var i = 0; i < declaration.length; i++) {
		var key = normalizeName(declaration[i])
		code += '    optional string ' + key + ' = ' + (i + 1) + ';\n'
	}
	code += '}'
	return code
})()