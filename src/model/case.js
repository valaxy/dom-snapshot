define(function (require) {
	var Backbone = require('backbone')
	require('backbone-relational')
	var Snapshot = require('./snapshot')

	var Case = Backbone.RelationalModel.extend({
		defaults: function () {
			return {
				name: '',
				code: '',
				state: 'undefined',
				on: false,
				active: false
			}
		},

		relations: [{
			type: Backbone.HasMany,
			key: 'snapshots',
			relatedModel: Snapshot,
			reverseRelation: {
				key: 'case'
			}
		}],


		idAttribute: '_id'
	})

	return Case
})

