define(function (require) {
	var IdGenerator = require('src/document-capture/id-generator')

	QUnit.module('IdGenerator')

	QUnit.test('generate()', function (assert) {
		var g = new IdGenerator()
		var a = g.generate()
		var b = g.generate()
		assert.notEqual(a, b)
		assert.equal(a.length, 40)
	})
})