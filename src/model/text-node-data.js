define(function (require) {
	var TreeNode = require('bower_components/algorithm-data-structure/src/tree/ordered/linked-ordered-node')

	var TextNodeData = function (options) {
		TreeNode.call(this)
		this.id = options.id
		this.text = options.text
	}


	TreeNode.extend(TextNodeData)


	// to JSON
	TextNodeData.prototype._toProtobufJSON = function () {
		return { // pass it to NodeData
			id: this.id,
			elementData: null,
			textData: {
				text: this.text
			}
		}
	}

	// from `new model(JSON)`
	TextNodeData._fromProtobufModel = function (proto) {
		return new TextNodeData({
			id: proto.id,
			text: proto.textData.text
		})
	}

	return TextNodeData
})