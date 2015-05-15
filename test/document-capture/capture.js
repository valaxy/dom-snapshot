define(function (require) {
	var $ = require('jquery')
	var _ = require('underscore')
	var capture = require('src/document-capture/capture')

	QUnit.module('capture')

	QUnit.test('_getCss()', function (assert) {
		var div = $('<div>')[0]
		$('body').append(div)

		// before
		var css = capture._getCss(div)
		assert.equal(_.keys(css).length, 360) // 360 rules, test in 2015/5/15
		assert.equal(css['backgroundColor'], 'rgba(0, 0, 0, 0)')

		// after
		$(div).css('background-color', 'red')
		css = capture._getCss(div)
		assert.equal(css['backgroundColor'], 'rgb(255, 0, 0)')

		// hide
		$(div).hide()
		css = capture._getCss(div)
		assert.equal(css['backgroundColor'], 'rgb(255, 0, 0)')
	})


	QUnit.test('_getAttributes()', function (assert) {
		var div = $('<div id="a" class="c1 c2" data="my-data">abc</div>')[0]
		var attrs = capture._getAttributes(div)
		assert.deepEqual(attrs, {
			id   : 'a',
			class: 'c1 c2',
			data : 'my-data'
		})
	})


	//QUnit.test('capture()', function (assert) {
	//	assert.ok(true)
	//	console.log(capture(document))
	//})

})