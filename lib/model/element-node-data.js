const TreeNode = require('algorithm-data-structure/dest/tree/ordered/linked-ordered-node')
const protobuf = require('./protobuf')
const TextNodeData = require('./text-node-data')
const ByteBuffer = require('ByteBuffer')
const _ = require('underscore')
const $ = require('jquery')


/** options:
 **     id:         the only identity in dom
 **     tagName:    tag name lower case
 **     css:        a object, contains the computed style
 **     attributes: html attributes
 **     vom:        a object
 **     [children]: a array
 */
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


ElementNodeData.prototype.save = function (done) {
	var me = this
	var data = me.toProtobufBase64()
	$.post('http://127.0.0.1:12345/snapshot', data, function (res) {
		console.log('save success')
		done()
	}, 'text')
}


/** Build from protobuf serialization string
 */
ElementNodeData.fromProtobuf = function (protobufData) {
	var encode = ByteBuffer.fromBase64(protobufData)
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


/** Convert to pure JSON which can pass to protobuf */
ElementNodeData.prototype.toProtobufJSON = function () {
	var children = []
	this.eachChild(function (child) {
		children.push(child.toProtobufJSON())
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


/** Convert to protobuf and return the serialization string of base64 */
ElementNodeData.prototype.toProtobufBase64 = function () {
	var model = new protobuf.NodeData(this.toProtobufJSON())
	return model.encode().toBase64()
}


module.exports = ElementNodeData
