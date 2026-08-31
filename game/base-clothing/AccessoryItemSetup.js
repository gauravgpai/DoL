class AccessoryItemSetup {
	/* Index of accessory | REQUIRED | MUST BE UNIQUE TO TYPE | INT */
	index;

	/* Lowercase name of accessory | REQUIRED | STRING */
	name;

	/* Capitalized name of accessory | AUTOFILL | STRING */
	name_cap;

	/* Accessory name for variable purpose | REQUIRED | MUST BE UNIQUE TO type | MUST MATCH OTHER OUTFIT PARTS | STRING */
	variable;

	/* Type of the accessory | REQUIRED | STRING */
	type;

	/* */
	word;

	/* indicated if the accessory is a singular or plural item. 0 for singular, 1 for plural | REQUIRED| AUTOFILL | INT */
	plural;

	/* Accessory cost | INT */
	cost = 0;

	/* Accessory description | REQUIRED | STRING */
	description;

	/* The shops the accessory can be found in | REQUIRED | AUTOFILL | ARRAY */
	shop;

	/* Filter options | REQUIRED | AUTOFILL | ARRAY */
	colour_options = [];

	constructor(props) {
		/* parses passed object and populates class properties */
		Object.keys(props).forEach(prop => {
			this[prop] = props[prop];
		});

		if (this.name && !this.name_cap) this.name_cap = this.name.substring(0, 1).toUpperCase() + this.name.slice(1);

		/* cleans up unused properties */
		Object.keys(this).forEach(key => {
			if (this[key] === undefined) delete this[key];
		});
	}
}

window.AccessoryItemSetup = AccessoryItemSetup;
