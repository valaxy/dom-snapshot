const deepFirst = require('algorithm-data-structure/dest/search/deep-first')
const IdGenerator = require('./idGenerator')
const utility = require('./utility')


// 如何获得一个元素所有css style的最小集:
// 在getComputedStyle里面筛选, 用数字作为序号的属性是最小集合, 其他属性有总属性所以会有重复


// get computed style of a element, returns a object
// key is the css property(naming as camelCase)
// value is the css value
// for example: { marginBottom: '10px' }
const getCss = function (element, includeRules) {
	// three things in getComputedStyle
	// - 0,1,2,3:      animation-delay, etc...
	// - alignContent: start, etc...
	// - not css:      parentRule, length, cssText, etc...
	let declaration = getComputedStyle(element)
	let css = {}
	for (let i = 0; i < declaration.length; i++) {
		let key = utility.antiNormalizeCssProperty(declaration[i])
		if (includeRules !== null && includeRules.indexOf(key) < 0) continue
		css[key] = declaration[key]
	}
	return css
}


// get attributes as a object
const getAttributes = function (element) {
	let attrs = {}
	let attributes = element.attributes
	for (let i = 0; i < attributes.length; i++) {
		let attNode = attributes[i]
		attrs[attNode.name] = attNode.value
	}
	return attrs
}


// filter element, true is valid, false is invalid
const elementFilter = function (dom) {
	if (['SCRIPT'].indexOf(dom.tagName) >= 0) {
		return false
	} else {
		return true
	}
}

const createElementNodeModel = function (elementNode, g, includeRules) {
	return {
		domNode: elementNode, // is a DOM Element Node, will be removed on the end
		json   : {
			children  : [],
			id        : g.generate(),
			tagName   : elementNode.tagName.toLowerCase(),
			css       : getCss(elementNode, includeRules),
			attributes: getAttributes(elementNode),
			vom       : { // view object model
				offsetLeft  : elementNode.offsetLeft,
				offsetTop   : elementNode.offsetTop,
				offsetWidth : elementNode.offsetWidth,
				offsetHeight: elementNode.offsetHeight
			}
		}
	}
}

const createTextNodeModel = function (textNode, g) {
	return {
		domNode: textNode, // is a DOM Text Node, will be removed on the end
		json   : {
			id  : g.generate(),
			text: textNode.textContent
		}
	}
}


const capture = function (root = document.documentElement, includeRules = null) {
	let g = new IdGenerator() // used to create ID
	let rootModel = createElementNodeModel(root, g, includeRules)

	// Model: ElementNodeModel or TextNodeModel
	// Node:  DOM node, ElementNode or TextNode
	// JSON:  ElementNodeJSON or TextNodeJSON

	deepFirst({
		initial: rootModel,
		next   : (parentModel, push) => {
			let childNode = parentModel.domNode.firstChild
			while (true) {
				if (childNode) {
					if (childNode.nodeType == Node.ELEMENT_NODE && elementFilter(childNode)) { // Element Node
						let element = createElementNodeModel(childNode, g, includeRules)
						parentModel.json.children.push(element.json)
						push(element) // push for deep searching
					} else if (childNode.nodeType == Node.TEXT_NODE) { // Text Node
						let text = createTextNodeModel(childNode, g)
						parentModel.json.children.push(text.json)
					}
					childNode = childNode.nextSibling
				} else {
					break
				}
			}
		}
	})

	return rootModel.json // ElementNodeJSON
}


// convenient for test
capture._getCss = getCss
capture._getAttributes = getAttributes

module.exports = capture


//const createElementNodeJSON = function (elementDomNode, g) {
//	return {
//		domNode: elementDomNode, // is a DOM Element Node
//		data   : new ElementNodeData({
//			id        : g.generate(),
//			tagName   : elementDomNode.tagName.toLowerCase(),
//			css       : getCss(elementDomNode),
//			attributes: getAttributes(elementDomNode),
//			vom       : {
//				offsetLeft  : elementDomNode.offsetLeft,
//				offsetTop   : elementDomNode.offsetTop,
//				offsetWidth : elementDomNode.offsetWidth,
//				offsetHeight: elementDomNode.offsetHeight
//			}
//		})
//	}
//}
//
//
//const createTextNodeJSON = function (textDomNode, g) {
//	return {
//		domNode: textDomNode, // is a DOM Text Node
//		data   : new TextNodeData({
//			id  : g.generate(),
//			text: textDomNode.textContent
//		})
//	}
//}