const deepFirst = require('algorithm-data-structure/dest/search/deep-first')
const ElementNodeData = require('../model/element-node-data')
const TextNodeData = require('../model/text-node-data')
const IdGenerator = require('./idGenerator')
const utility = require('./utility')


// 如何获得一个元素所有css style的最小集:
// 在getComputedStyle里面筛选, 用数字作为序号的属性是最小集合, 其他属性有总属性所以会有重复


// get computed style of a element
// returns a object
// key is the css property(naming as camelCase)
// value is the css value
// for example, marginBottom: '10px'
const getCss = function (element) {
	// three things in getComputedStyle
	// - 0: animation-delay, etc...
	// - alignContent: start, etc...
	// - parentRule, length, cssText, etc...
	var declaration = getComputedStyle(element)
	var css = {}
	for (var i = 0; i < declaration.length; i++) {
		var key = utility.antiNormalizeCssProperty(declaration[i])
		css[key] = declaration[key]
	}
	return css
}


// get attributes as a object
const getAttributes = function (element) {
	var attrs = {}
	var attributes = element.attributes
	for (var i = 0; i < attributes.length; i++) {
		var attNode = attributes[i]
		attrs[attNode.name] = attNode.value
	}
	return attrs
}


const createElementNodeJSON = function (elementDomNode, g) {
	return {
		domNode: elementDomNode, // is a DOM Element Node
		data   : new ElementNodeData({
			id        : g.generate(),
			tagName   : elementDomNode.tagName.toLowerCase(),
			css       : getCss(elementDomNode),
			attributes: getAttributes(elementDomNode),
			vom       : {
				offsetLeft  : elementDomNode.offsetLeft,
				offsetTop   : elementDomNode.offsetTop,
				offsetWidth : elementDomNode.offsetWidth,
				offsetHeight: elementDomNode.offsetHeight
			}
		})
	}
}


const createTextNodeJSON = function (textDomNode, g) {
	return {
		domNode: textDomNode, // is a DOM Text Node
		data   : new TextNodeData({
			id  : g.generate(),
			text: textDomNode.textContent
		})
	}
}


// filter element, true is valid, false is invalid
const elementFilter = function (dom) {
	if (['SCRIPT'].indexOf(dom.tagName) >= 0) {
		return false
	} else {
		return true
	}
}


const capture = function (root = document.documentElement) {
	let g = new IdGenerator() // used to create ID
	let rootData = createElementNodeJSON(root, g)

	// Data: ElementNodeJSON or TextNodeJSON
	// Node: DOM node, ElementNode or TextNode

	deepFirst({
		initial: rootData,
		next   : (parentData, push) => {
			let childNode = parentData.domNode.firstChild
			while (true) {
				if (childNode) {
					if (childNode.nodeType == Node.ELEMENT_NODE && elementFilter(childNode)) { // Element Node
						let element = createElementNodeJSON(childNode, g)
						parentData.data.addChildLast(element.data)
						push(element) // push for deep searching
					} else if (childNode.nodeType == Node.TEXT_NODE) { // Text Node
						let text = createTextNodeJSON(childNode, g)
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

module.exports = capture