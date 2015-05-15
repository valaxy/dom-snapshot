define(function (require, exports) {
	var protobuf = require('src/sync/protobuf')
	var sync = require('src/sync/sync')
	var SnapshotDom = require('src/model/snapshot-dom')
	var recover = require('src/document-grab/recover')

	exports.init = function () {
		protobuf.init(function () {
			sync.grab(function () {
				//sync.getSnapshotDom('xx', function (data) {
				//	var frame =
				//})

				var frame = document.getElementsByClassName('new')[0]
				frame.src = '../../src/new-page/index.html'
			})
		})
	}
})