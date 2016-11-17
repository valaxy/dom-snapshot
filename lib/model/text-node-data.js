const TreeNode = require('algorithm-data-structure/dest/tree/ordered/linked-ordered-node')


/** options:
 **     id:   only one in the whole dom
 **     text: text content
 */
var TextNodeData = function (options) {
	TreeNode.call(this)
	this.id = options.id
	this.text = options.text
}


TreeNode.extend(TextNodeData)


// to protobuf JSON
TextNodeData.prototype.toProtobufJSON = function () {
	return { // pass it to NodeData
		id         : this.id,
		elementData: null,
		textData   : {
			text: this.text
		}
	}
}

// from `new model(JSON)`
TextNodeData._fromProtobufModel = function (proto) {
	return new TextNodeData({
		id  : proto.id,
		text: proto.textData.text
	})
}

module.exports = TextNodeData
