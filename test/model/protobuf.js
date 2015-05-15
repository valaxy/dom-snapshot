define(function (require) {
	var protobuf = require('src/model/protobuf')

	QUnit.module('protobuf')

	QUnit.test('init()', function (assert) {
		var done = assert.async()
		protobuf.init(function () {
			assert.ok(protobuf.NodeData)
			done()
		})
	})
})