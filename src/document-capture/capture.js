define(function (require) {
	var deepFirst = require('deep-first-search')
	var ElementNodeData = require('../model/element-node-data')
	var TextNodeData = require('../model/text-node-data')
	var IdGenerator = require('./id-generator')


	// get computed css as a object
	var getCss = function (element) {
		var declaration = getComputedStyle(element)
		var css = {}
		for (var key in declaration) {
			if (!/\d+/.test(key)                                          // remote repeat rules
				&& declaration.hasOwnProperty(key)                         // remote prototype property
				&& ['parentRule', 'length', 'cssText'].indexOf(key) < 0) { // remove no css rule
				css[key] = declaration[key]
			}
		}
		return css
	}


	// get attributes as a object
	var getAttributes = function (element) {
		var attrs = {}
		var attributes = element.attributes
		for (var i = 0; i < attributes.length; i++) {
			var attNode = attributes[i]
			attrs[attNode.name] = attNode.value
		}
		return attrs
	}


	var createElementNodeData = function (elementDomNode, g) {
		return {
			domNode: elementDomNode, // is a DOM Element Node
			data   : new ElementNodeData({
				id        : g.generate(),
				tagName   : elementDomNode.tagName,
				css       : getCss(elementDomNode),
				attributes: getAttributes(elementDomNode),
				vom       : {
					offsetLeft: elementDomNode.offsetLeft,
					offsetTop : elementDomNode.offsetTop
				}
			})
		}
	}


	var createTextNodeData = function (textDomNode, g) {
		return {
			domNode: textDomNode, // is a DOM Text Node
			data   : new TextNodeData({
				id  : g.generate(),
				text: textDomNode.textContent
			})
		}
	}


	// filter element
	var elementFilter = function (elementDomNode) {
		if (['SCRIPT'].indexOf(elementDomNode.tagName) >= 0) {
			return false
		} else {
			return true
		}
	}


	// search 可以重构
	var capture = function (document) {
		var g = new IdGenerator() // used to create ID
		var rootData = createElementNodeData(document.getElementsByTagName('body')[0], g) // TODO: always grab begin in 'body'?

		// Data: ElementNodeData or TextNodeData
		// Node: DOM node, ElementNode or TextNode

		deepFirst({
			initial: rootData,
			next   : function (parentData, push) {
				var childNode = parentData.domNode.firstChild
				while (true) {
					if (childNode) {
						if (childNode.nodeType == Node.ELEMENT_NODE && elementFilter(childNode)) { // Element Node
							var element = createElementNodeData(childNode, g)
							parentData.data.addChildLast(element.data)
							push(element) // push for deep searching
						} else if (childNode.nodeType == Node.TEXT_NODE) { // Text Node
							var text = createTextNodeData(childNode, g)
							parentData.data.addChildLast(text.data)
						}
						childNode = childNode.nextSibling
					} else {
						break
					}
				}
			}
		})

		return rootData.data // ElementNodeData
	}


	// convenient for test
	capture._getCss = getCss
	capture._getAttributes = getAttributes

	return capture
})