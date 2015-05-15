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
			domNode: elementDomNode,
			data   : new ElementNodeData({
				id        : g.generate(),
				tagName   : elementDomNode.tagName,
				css       : getCss(elementDomNode),
				attributes: getAttributes(elementDomNode)
			})
		}
	}


	var createTextNodeData = function (textDomNode, g) {
		return {
			domNode: textDomNode,
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
	var grab = function (document) {
		var g = new IdGenerator() // used to create ID
		var root = createElementNodeData(document.getElementsByTagName('body')[0], g) // TODO: always grab begin in 'body'?

		deepFirst({
			initial: root,
			next   : function (parent, push) {
				var child = parent.domNode.firstChild
				while (true) {
					if (child) {
						if (child.nodeType == Node.ELEMENT_NODE && elementFilter(child)) { // Element Node
							var element = createElementNodeData(child, g)
							parent.data.addChildLast(element.data)
							push(element)
						} else if (child.nodeType == Node.TEXT_NODE) { // Text Node
							var text = createTextNodeData(child, g)
							parent.data.addChildLast(text.data)
						}
						child = child.nextSibling
					} else {
						break
					}
				}
			}
		})

		return root.data
	}


	// convenient for test
	grab._getCss = getCss
	grab._getAttributes = getAttributes

	return grab
})