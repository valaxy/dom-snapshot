const capture = require('../../lib/capture/capture')
console.log(capture(document.querySelector('.demo')))
console.log(capture(document.querySelector('.demo'), [
	'fontSize',
	'color',
	'backgroundColor'
]))