const Chance = require('chance')

module.exports = class IDGenerator {
	constructor() {
		let random = new Chance()
		this._guid = 'x-' + random.guid() // guid head may be number
		this._number = 0
	}

	generate() {
		return this._guid + '-' + this._number++
	}
}
