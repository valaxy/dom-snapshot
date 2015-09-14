define(function (require) {
	var protobuf = require('src/model/protobuf')
	var recover = require('src/document-capture/recover')
	var capture = require('src/document-capture/capture')
	var $ = require('jquery')

	var $old = $('.old')
	var $new = $('.new')
	var url = 'http://www.15yan.com/story/2K6nSpZuRRL/'

	// wait to load finish
	$old.on('load', function () {
		console.log('loaded')
		var startTime = +new Date

		var snapshot = capture($old[0].contentWindow.document)
		var html = recover({
			root: snapshot,
			url : url
		}, $new[0].contentDocument)
		$new[0].contentDocument.write(html)

		var endTime = +new Date

		console.log('time: ' + (endTime - startTime))
	})

	$old.attr('src', url)

	// @日志, 各个页面recover时间
	// 'http://www.12306.cn'                      11s
	// 'http://www.qq.com'                        卡死
	// 'http://www.15yan.com/story/2K6nSpZuRRL/'  3s
})