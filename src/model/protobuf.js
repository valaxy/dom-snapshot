define(function (require, exports) {
	var protobuf = require('protobuf')
	var $ = require('jquery')
	var snapshotProto = require('text!./snapshot.proto')


	exports.init = function (done) {
		var me = this

		// mlgb de
		// 貌似用loadText的版本不行

		var builder = protobuf.loadProto(snapshotProto)

		me.NodeData = builder.build('NodeData')
		//me.TextNodeData = builder.build('TextNodeData')
		//me.ElementNodeData = builder.build('ElementNodeData')
		done()

	}
})