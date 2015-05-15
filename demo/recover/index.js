define(function (require, exports) {
	var sync = require('src/sync/sync')
	var protobuf = require('src/sync/protobuf')
	var SnapshotDom = require('src/model/element-node-data')
	var recover = require('src/document-grab/recover')

	exports.init = function () {
		protobuf.init(function () {
			sync.getSnapshotDom('xx', function (data) {
				var snapshot = SnapshotDom.fromProtobuf(data)
				console.log(snapshot)

				recover({
					url: "http://www.12306.cn/mormhweb/",
					root: snapshot
				})
			})
		})
	}
})