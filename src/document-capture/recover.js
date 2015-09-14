define(function (require) {
	var ElementNodeData = require('../model/element-node-data')
	var utility = require('./utility')


	// it's needed to set the base url, or network requests may break
	var addBaseTag = function (baseUrl, doc) {
		var head = doc.getElementsByTagName('head')[0]
		var base = doc.createElement('base')
		base.setAttribute('href', baseUrl)
		head.appendChild(base)
	}

	
	// there must be has a `<link>`
	var addCss = function (elementData, doc) {
		doc.head.appendChild(doc.createElement('style')) // add a styleSheets
		var css = '.' + elementData.id + '{'
		for (var key in elementData.css) {
			var newKey = utility.normalizeCssProperty(key)
			css += newKey + ':' + elementData.css[key] + ';\n'
		}
		css += '}\n'
		doc.styleSheets[0].insertRule(css, 0)
	}

	var addAttributes = function (element, attr) {
		for (var key in attr) {
			var value = attr[key]
			element.setAttribute(key, value)
		}
	}

	var fillElement = function (element, elementData, doc) {
		addCss(elementData, doc) // inner stylesheet
		addAttributes(element, elementData.attributes)

		// use the `class` to handle identity, must after addAttributes
		element.className = (element.className ? element.className + ' ' : '') + elementData.id

		// add child text or element
		elementData.eachChild(function (childData) {
			if (childData instanceof ElementNodeData) {
				var elementChildNode = createElement(childData, doc)
				element.appendChild(elementChildNode)
			} else { // Text
				var textNode = doc.createTextNode(childData.text)
				element.appendChild(textNode)
			}
		})
		return element
	}

	var createElement = function (elementData, doc) {
		var element = doc.createElement(elementData.tagName)
		fillElement(element, elementData, doc)
		return element
	}


	/** Recover the page from snapshot, returns html */
	var recover = function (snapshot, doc) {
		addBaseTag(snapshot.url, doc)

		//var body = doc.getElementsByTagName('body')[0] // the body is automatically generated, so just fill it not create it
		var docRoot = createElement(snapshot.root, doc)
		fillElement(docRoot, snapshot.root, doc)
		return docRoot.outerHTML
	}

	return recover
})