define(function (require) {
	var deepFirst = require('deep-first-search')
	var ElementNodeData = require('../model/element-node-data')
	var TextNodeData = require('../model/text-node-data')
	var IdGenerator = require('./id-generator')

	// @日志, 如何获得一个元素所有css的最小集
	// 在getComputedStyle里面筛选, 用数字作为序号的属性是最小集合, 其他属性有总属性所以会有重复


	// get computed style of a element
	// returns a object
	// key is the css property(naming as camelCase)
	// value is the css value
	// for example, marginBottom: '10px'
	var getCss = function (element) {
		// three things in getComputedStyle
		// - 0: animation-delay, etc...
		// - alignContent: start, etc...
		// - parentRule, length, cssText, etc...
		var declaration = getComputedStyle(element)
		var css = {}
		for (var i = 0; i < declaration.length; i++) {
			var key = normalizeName(declaration[i])
			css[key] = declaration[key]
		}
		return css
	}


	// convert -webkit-filter to webkitFilter
	var normalizeName = function (name) {
		var blocks = name.split('-')
		if (blocks[0] == '') { // head is '-'
			blocks.splice(0, 1)
		}
		var firstName = blocks[0]
		var lastName = ''
		for (var i = 1; i < blocks.length; i++) {
			lastName += blocks[i][0].toUpperCase() + blocks[i].substr(1)
		}
		return firstName + lastName
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


	var createElementNodeJSON = function (elementDomNode, g) {
		return {
			domNode: elementDomNode, // is a DOM Element Node
			data   : new ElementNodeData({
				id        : g.generate(),
				tagName   : elementDomNode.tagName.toLowerCase(),
				css       : getCss(elementDomNode),
				attributes: getAttributes(elementDomNode),
				vom       : {
					offsetLeft: elementDomNode.offsetLeft,
					offsetTop : elementDomNode.offsetTop
				}
			})
		}
	}


	var createTextNodeJSON = function (textDomNode, g) {
		return {
			domNode: textDomNode, // is a DOM Text Node
			data   : new TextNodeData({
				id  : g.generate(),
				text: textDomNode.textContent
			})
		}
	}


	// filter element, true is valid, false is invalid
	var elementFilter = function (dom) {
		if (['SCRIPT'].indexOf(dom.tagName) >= 0) {
			return false
		} else {
			return true
		}
	}


	// search 可以重构
	var capture = function (document) {
		var g = new IdGenerator() // used to create ID
		var rootData = createElementNodeJSON(document.documentElement, g)

		// Data: ElementNodeJSON or TextNodeJSON
		// Node: DOM node, ElementNode or TextNode

		deepFirst({
			initial: rootData,
			next   : function (parentData, push) {
				var childNode = parentData.domNode.firstChild
				while (true) {
					if (childNode) {
						if (childNode.nodeType == Node.ELEMENT_NODE && elementFilter(childNode)) { // Element Node
							var element = createElementNodeJSON(childNode, g)
							parentData.data.addChildLast(element.data)
							push(element) // push for deep searching
						} else if (childNode.nodeType == Node.TEXT_NODE) { // Text Node
							var text = createTextNodeJSON(childNode, g)
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
	capture._normalizeName = normalizeName

	return capture
})