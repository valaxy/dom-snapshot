define(function (require, exports) {
	var sync = require('../../src/sync/sync')
	var Case = require('../../src/model/case')
	var Snapshot = require('../../src/model/snapshot')
	var Chance = require('chance')
	var $ = require('jquery')
	var documentGrab = require('../../src/document-grab/grab')


	var inspectScript = function (document, url) {
		var script = document.createElement('script')
		script.src = url
		var head = document.getElementsByTagName('head')[0]
		document.documentElement.appendChild(script)
	}

	exports.init = function () {
		sync.init()
		sync.grab("http://www.12306.cn/mormhweb/", function () {
			console.log('grab success')
		})

		//var random = new Chance


		//var c = new Case({
		//	_id: random.guid(),
		//	name: '1234',
		//	snapshots: [
		//		new Snapshot({
		//			dom: '123'
		//		})
		//	]
		//})
		//c.save()
		//console.log(c.toJSON())
	}
})