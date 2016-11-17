var ElementNodeData = require('../model/element-node-data')
var utility = require('./utility')


var addBaseTag = function (baseUrl, doc, head) {
	var base = doc.createElement('base')
	base.setAttribute('href', baseUrl)
	head.appendChild(base)
}


// add styles of node into one <style>
var addStyle = function (elementData, style) {
	var css = '.' + elementData.id + ' {\n'
	for (var key in elementData.css) {
		var newKey = utility.normalizeCssProperty(key)
		css += newKey + ': ' + elementData.css[key] + ';\n'
	}
	css += '}\n'
	style.innerHTML += css
}


var addAttributes = function (element, attr) {
	for (var key in attr) {
		var value = attr[key]
		element.setAttribute(key, value)
	}
}


var fillElement = function (element, elementData, doc, style) {
	addStyle(elementData, style) // inner stylesheet
	addAttributes(element, elementData.attributes)

	// use the `class` to handle identity, must after addAttributes
	element.className = (element.className ? element.className + ' ' : '') + elementData.id

	// add child text or element
	elementData.eachChild(function (childData) {
		if (childData instanceof ElementNodeData) {
			var elementChildNode = createElement(childData, doc, style)
			element.appendChild(elementChildNode)
		} else { // Text
			var textNode = doc.createTextNode(childData.text)
			element.appendChild(textNode)
		}
	})
	return element
}

var createElement = function (elementData, doc, style) {
	var element = doc.createElement(elementData.tagName)
	fillElement(element, elementData, doc, style)
	return element
}


/** Recover the page from snapshot, returns html
 ** snapshot:
 **     root: document root(html tag)
 **     url:  base url
 */
var recover = function (snapshot, doc) {
	var style = doc.createElement('style') // collect styleSheets

	var root = createElement(snapshot.root, doc, style)
	var head = root.querySelector('head')

	// it's needed to set the base url, or network requests may break
	snapshot.url && addBaseTag(snapshot.url, doc, head)

	// there always be a <head>
	head.appendChild(style)

	return root.outerHTML
}


// convenient for test
recover._addStyle = addStyle

module.exports = recover
