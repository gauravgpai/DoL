class AccessoryItem {
	/* Index of Accessories | REQUIRED | MUST BE UNIQUE TO SLOT | INT */
	index;

	/* Lowercase name of accessory | REQUIRED | STRING */
	name;

	/* Capitalized name of accessory | AUTOFILL | STRING */
	name_cap;

	variable;

	type;

	/* */
	word;

	/* indicated if the accessory is a singular or plural item. 0 for singular, 1 for plural | REQUIRED| AUTOFILL | INT */
	plural;

	/* Filter storage, always 0 | AUTOFILL | INT */
	colour = 0;

	/* Filter options | REQUIRED | AUTOFILL | ARRAY */
	colour_options;

	/* Accessory cost | INT */
	cost = 0;

	/* Accessory description | REQUIRED | STRING */
	description;

	/* The shops the accessory can be found in | REQUIRED | AUTOFILL | ARRAY */
	shop;

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

window.AccessoryItem = AccessoryItem;
