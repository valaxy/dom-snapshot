define(function (require) {
	var ElementNodeData = require('src/model/element-node-data')
	var TextNodeData = require('src/model/text-node-data')
	var protobuf = require('src/model/protobuf')

	module('ElementNodeData')

	test('_toProtobufJSON()', function (assert) {
		var done = assert.async()
		protobuf.init(function () {
			assert.ok(protobuf.NodeData)

			var node = new ElementNodeData({
				id: 'abc',
				tagName: '123',
				css: {
					backgroundColor: '#333'
				},
				attributes: {
					href: '#'
				}
			})
			var model = new protobuf.NodeData(node._toProtobufJSON())
			assert.deepEqual({
				id: model.id,
				elementData: {
					tagName: model.elementData.tagName,
					children: model.elementData.children
				},
				textData: model.textData
			}, {
				id: 'abc',
				elementData: {
					tagName: '123',
					children: []
				},
				textData: null
			})
			assert.equal(model.elementData.css['backgroundColor'], '#333')
			assert.equal(model.elementData.attributes.length, 1)
			assert.equal(model.elementData.attributes[0].key, 'href')
			assert.equal(model.elementData.attributes[0].value, '#')
			done()
		})
	})

	//test('_fromProtobufModel()', function (assert) {
	//	var done = assert.async()
	//	protobuf.init(function () {
	//		var node = new ElementNodeData({
	//			id: '111',
	//			tagName: 'aaa',
	//			css: {
	//				background: '222'
	//			},
	//			attributes: {
	//				y: '333'
	//			}
	//		})
	//		var proto = new protobuf.NodeData(node._toProtobufJSON())
	//		var json1 = ElementNodeData._fromProtobufModel(proto)._toProtobufJSON()
	//		var json2 = node._toProtobufJSON()
	//		delete json1.elementData.css
	//		delete json2.elementData.css
	//		assert.deepEqual(json1, json2)
	//		done()
	//	})
	//})
	//
	//
	//test('toProtobuf()/fromProtobuf(): single case', function (assert) {
	//	var done = assert.async()
	//	protobuf.init(function () {
	//		// build the protobuf
	//		var data = new ElementNodeData({
	//			id: 'xyz',
	//			tagName: 'div',
	//			css: {
	//				background: '#333',
	//				webkitMask: 'none',
	//				zIndex: '123'
	//			},
	//			attributes: {
	//				a: 'abc',
	//				b: '123'
	//			}
	//		})
	//		var protoEncode = data.toProtobuf()
	//
	//		// parse the data
	//		var proto = ElementNodeData.fromProtobuf(protoEncode)
	//		assert.equal(data.id, proto.id)
	//		assert.equal(data.tagName, proto.tagName)
	//		assert.equal(data.css.background, proto.css.background)
	//		assert.equal(data.css.webkitMask, proto.css.webkitMask)
	//		assert.equal(data.css.zIndex, proto.css.zIndex)
	//		assert.deepEqual(data.attributes, proto.attributes)
	//
	//		done()
	//	})
	//})

	//
	//test('toProtobuf()/fromProtobuf(): tree case', function (assert) {
	//	var done = assert.async()
	//	protobuf.init(function () {
	//		var root = new ElementNodeData({
	//			id: 'a1',
	//			tagName: 'body',
	//			css: {color: 'red'},
	//			children: [
	//				new ElementNodeData({
	//					id: 'a2',
	//					tagName: 'div',
	//					css: {color: 'blue'},
	//					children: [
	//						new ElementNodeData({
	//							id: 'a3',
	//							tagName: 'p',
	//							css: {color: 'black'},
	//							children: []
	//						})
	//					]
	//				}),
	//				new TextNodeData({
	//					id: 'text-abc',
	//					text: '123'
	//				})
	//			]
	//		})
	//		var protoEncode = root.toProtobuf()
	//
	//		var data = ElementNodeData.fromProtobuf(protoEncode)
	//		assert.equal(root.tagName, data.tagName)
	//		assert.equal(root.childrenCount(), 2)
	//		assert.equal(root.leftmostChild().tagName, data.leftmostChild().tagName)
	//		assert.equal(root.leftmostChild().leftmostChild().tagName, data.leftmostChild().leftmostChild().tagName)
	//		assert.equal(root.leftmostChild().rightSibling().id, 'text-abc')
	//
	//		done()
	//	})
	//})
})