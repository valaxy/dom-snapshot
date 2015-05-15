define(function (require) {
	var Chance = require('chance')

	var IdGenerator = function () {
		var random = new Chance()
		this._guid = 'x-' + random.guid() // guid head may be number
		this._number = 0

	}

	IdGenerator.prototype.generate = function () {
		return this._guid + '-' + this._number++
	}

	return IdGenerator
})