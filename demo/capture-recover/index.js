define(function (require) {
	var protobuf = require('src/model/protobuf')
	var recover = require('src/document-capture/recover')
	var capture = require('src/document-capture/capture')
	var $ = require('jquery')

	var $old = $('.old')
	var $new = $('.new')

	var snapshot = capture($old[0].contentWindow.document)
	var html = recover({
		root: snapshot
	}, $new[0].contentWindow.document)
	console.log(html)
})