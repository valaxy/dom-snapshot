define(function (require) {
	var $ = require('jquery')
	var _ = require('underscore')
	var capture = require('src/document-capture/capture')
	var protobuf = require('src/model/protobuf')

	QUnit.module('capture')

	QUnit.test('_getCss()', function (assert) {
		var div = $('<div>')[0]
		$('body').append(div)

		// before
		var css = capture._getCss(div)
		assert.equal(_.keys(css).length, getComputedStyle(document.body).length)
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

	QUnit.test('_normalizeName()', function (assert) {
		assert.equal(capture._normalizeName('-webkit-clip-path'), 'webkitClipPath')
		assert.equal(capture._normalizeName('top'), 'top')
		assert.equal(capture._normalizeName('text-align'), 'textAlign')
	})


	QUnit.test('capture()', function (assert) {
		var calcMB = function (str) {
			return (str.length * 2 / 1024 / 1024).toFixed(2) + 'MB'
		}

		var done = assert.async()
		protobuf.init(function () {
			var root = capture(document)
			console.log(root)
			console.log('protobufJSON: ' + calcMB(JSON.stringify(root.toProtobufJSON())))
			console.log('protobufBase64: ' + calcMB(root.toProtobufBase64()))

			assert.ok(true)
			done()
		})
	})

})