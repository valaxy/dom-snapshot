define(function (require) {
	var ElementNodeData = require('../model/element-node-data')


	// it's need to set the base url, or network requests may break
	var addBaseTag = function (baseUrl) {
		var head = document.getElementsByTagName('head')[0]
		var base = document.createElement('base')
		base.setAttribute('href', baseUrl)
		head.appendChild(base)
	}


	// zIndex -> z-index
	var getKey = function (key) {
		key = key[0].toUpperCase() + key.slice(1)
		var matches = key.match(/[A-Z][a-z]*/g)
		var newKey = matches[0]
		for (var i = 1; i < matches.length; i++) {
			newKey += '-' + matches[i].toLowerCase()
		}
		return newKey
	}


	// webkitMaskColor -> -webkit-mask-color
	var getKeyHasWebkit = function (key) {
		if (key.slice(0, 6) == 'webkit') {
			return '-webkit-' + getKey(key.slice(6))
		}
		return getKey(key)
	}


	// there must be has a `<link>`
	var addCss = function (elementData) {
		var css = '.' + elementData.id + '{'
		for (var key in elementData.css) {
			var newKey = getKeyHasWebkit(key)
			css += newKey + ':' + elementData.css[key] + ';'
		}
		css += '}\n'
		document.styleSheets[0].insertRule(css, 0)
	}

	var addAttributes = function (element, attr) {
		for (var key in attr) {
			var value = attr[key]
			element.setAttribute(key, value)
		}
	}

	var fillElement = function (element, elementData) {
		addCss(elementData) // inner stylesheet
		addAttributes(element, elementData.attributes)

		// use the `class` to handle identity, must after addAttributes
		element.className = element.className + ' ' + elementData.id

		// add child text or element
		for (var i in elementData.children) {
			var childData = elementData.children[i]
			if (childData.constructor == ElementNodeData) {
				var elementChildNode = createElement(childData)
				element.appendChild(elementChildNode)
			} else { // Text
				var textNode = document.createTextNode(childData.text)
				element.appendChild(textNode)
			}
		}
		return element
	}

	var createElement = function (elementData) {
		var element = document.createElement(elementData.tagName)
		fillElement(element, elementData)
		return element
	}


	var recover = function (snapshot) {
		addBaseTag(snapshot.url)
		var body = document.getElementsByTagName('body')[0] // the body is automatically generated, so just fill it not create it
		fillElement(body, snapshot.root)
	}

	return recover
})