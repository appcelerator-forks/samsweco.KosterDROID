exports.definition = {
	config: {

		adapter: {
			type: "sql",
			collection_name: "infospotCoordinatesModel",
			db_file : "/dbKostervandring.sqlite"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};