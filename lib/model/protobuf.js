var protobuf = require('protobuf')
var $ = require('jquery')
var snapshotProto = require('text!./snapshot.proto')

exports.init = function (done) {
	var me = this

	// mlgb de
	// ò����loadText�İ汾����

	var builder = protobuf.loadProto(snapshotProto)

	me.NodeData = builder.build('NodeData')
	//me.TextNodeData = builder.build('TextNodeData')
	//me.ElementNodeData = builder.build('ElementNodeData')
	done()

}
