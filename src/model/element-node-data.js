define(function (require) {
	var TreeNode = require('bower_components/algorithm-data-structure/src/tree/ordered/linked-ordered-node')
	var protobuf = require('protobuf')
	var TextNodeData = require('./text-node-data')
	var ByteBuffer = require('ByteBuffer')
	var _ = require('underscore')
	var $ = require('jquery')


	var ElementNodeData = function (options) {
		TreeNode.call(this)
		this.id = options.id                                        // identity
		this.tagName = options.tagName                              // tag name
		this.css = options.css                                      // computed css
		this.attributes = options.attributes                        // key-value of attribute nodes
		this.vom = options.vom
		if (options.children) {
			for (var i in options.children) {
				this.addChildLast(options.children[i])              // children dom
			}
		}
	}

	TreeNode.extend(ElementNodeData)


	// pass the json to constructor
	ElementNodeData.prototype._toProtobufJSON = function () {
		var children = []
		this.eachChild(function (child) {
			children.push(child._toProtobufJSON())
		})
		var attributes = _.pairs(this.attributes).map(function (keyValue) {
			var key = keyValue[0]
			var value = keyValue[1]
			return {
				key  : key,
				value: value
			}
		})
		return {
			id         : this.id,
			elementData: {
				tagName   : this.tagName,
				css       : this.css,
				attributes: attributes,
				children  : children
			},
			textData   : null
		}
	}

	ElementNodeData.prototype.save = function (done) {
		var me = this
		var data = me.toProtobuf()
		$.post('http://127.0.0.1:12345/snapshot', data, function (res) {
			console.log('save success')
			done()
		}, 'text')
	}

	ElementNodeData.prototype.toProtobuf = function () {
		var model = new protobuf.NodeData(this._toProtobufJSON())
		return model.encode().toBase64()
	}

	ElementNodeData.fromProtobuf = function (data) {
		var encode = ByteBuffer.fromBase64(data)
		var protoModel = protobuf.NodeData.decode(encode)
		return this._fromProtobufModel(protoModel)
	}

	ElementNodeData._fromProtobufModel = function (proto) {
		// create css model
		var css = {}
		var cssModel = proto.elementData.css
		for (var key in cssModel) {
			if (cssModel.hasOwnProperty(key)) {
				var value = cssModel[key]
				css[key] = value
			}
		}

		// create attribute
		var attrs = {}
		var attrsModel = proto.elementData.attributes
		for (var i in attrsModel) {
			var att = attrsModel[i]
			attrs[att.key] = att.value
		}

		// create children first
		var children = _.map(proto.elementData.children, function (child) {
			if (child.elementData) {
				return ElementNodeData._fromProtobufModel(child)
			} else {
				return TextNodeData._fromProtobufModel(child)
			}
		})

		// then create the model
		var model = new ElementNodeData({
			id        : proto.id,
			tagName   : proto.elementData.tagName,
			css       : css,
			attributes: attrs,
			children  : children
		})
		return model
	}

	return ElementNodeData
})