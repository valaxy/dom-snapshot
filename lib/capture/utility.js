/** -webkit-filter --> webkitFilter */
exports.antiNormalizeCssProperty = function (property) {
	var blocks = property.split('-')
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

/** zIndex       -> z-index
 ** webkitFilter -> -webkit-Filter
 */
exports.normalizeCssProperty = function (property) {
	property = property[0].toUpperCase() + property.slice(1)
	var matches = property.match(/[A-Z][a-z]*/g)
	var key = matches[0] == 'Webkit' ? '-webkit' : matches[0].toLowerCase()
	for (var i = 1; i < matches.length; i++) {
		key += '-' + matches[i].toLowerCase()
	}
	return key
}