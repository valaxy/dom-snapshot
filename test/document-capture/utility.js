define(function (require) {
	var utility = require('src/document-capture/utility')

	QUnit.module('utility')

	QUnit.test('antiNormalizeCssProperty()', function (assert) {
		assert.equal(utility.antiNormalizeCssProperty('-webkit-clip-path'), 'webkitClipPath')
		assert.equal(utility.antiNormalizeCssProperty('top'), 'top')
		assert.equal(utility.antiNormalizeCssProperty('text-align'), 'textAlign')
	})

	QUnit.test('normalizeCssProperty()', function (assert) {
		assert.equal(utility.normalizeCssProperty('zIndex'), 'z-index')
		assert.equal(utility.normalizeCssProperty('color'), 'color')
		assert.equal(utility.normalizeCssProperty('webkitFilter'), '-webkit-filter')
	})

})