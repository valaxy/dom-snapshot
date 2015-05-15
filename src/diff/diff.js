define(function (require) {
	var diff = require('tree-diff')

	var addCost = function (node) {
		return 1
	}

	var deleteCost = function (node) {
		return 1
	}

	var editCost = function (nodeA, nodeB) {
		if (nodeA.tagName == nodeB.tagName) {
			return 0
		} else {
			return 1
		}
	}

	var compare = function (nodeA, nodeB) {
		return nodeA.tagName == nodeB.tagName
	}

	var displayDiff = function (nodeDataA, nodeDataB) {
		return diff({
			root1: nodeDataA,
			root2: nodeDataB,
			addCost: addCost,
			deleteCost: deleteCost,
			editCost: editCost
		}).steps // value is not important
	}

	return displayDiff
})