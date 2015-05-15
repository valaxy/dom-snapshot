define(function (require) {
	var protobuf = require('src/model/protobuf')
	var TextNodeData = require('src/model/text-node-data')


	QUnit.module('TextNodeData')


	QUnit.test('_toProtobufJSON()', function (assert) {
		var done = assert.async()
		protobuf.init(function () {
			assert.ok(protobuf.NodeData)
			var textNode = new TextNodeData({
				id  : 'abc',
				text: '123'
			})
			var protoModel = new protobuf.NodeData(textNode._toProtobufJSON())
			assert.deepEqual({
				id         : protoModel.id,
				elementData: protoModel.elementData,
				textData   : {
					text: protoModel.textData.text
				}
			}, {
				id         : 'abc',
				elementData: null,
				textData   : {
					text: '123'
				}
			})

			done()
		})
	})


	QUnit.test('_fromProtobufModel()', function (assert) {
		var done = assert.async()
		protobuf.init(function () {
			var textNode = new TextNodeData({
				id  : '111',
				text: 'aaa'
			})
			var proto = new protobuf.NodeData(textNode._toProtobufJSON())
			assert.deepEqual(TextNodeData._fromProtobufModel(proto)._toProtobufJSON(), textNode._toProtobufJSON())
			done()
		})
	})

})