define(function (require) {
	var recover = require('src/document-capture/recover')
	var ElementNodeData = require('src/model/element-node-data')


	QUnit.module('recover')


	QUnit.test('_addStyle', function (assert) {
		var style = document.createElement('style')
		var data = new ElementNodeData({
			id     : 'xxx',
			tagName: 'div',
			css    : {
				color       : '#333',
				marginBottom: '10px'
			}
		})
		recover._addStyle(data, style)

		assert.equal(style.innerText, '.xxx {\ncolor: #333;\nmargin-bottom: 10px;\n}\n')
	})

})