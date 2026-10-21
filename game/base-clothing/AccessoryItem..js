class AccessoryItem {
	/* Index of the array of the specific type of accessories | REQUIRED | INT */
	setupIndex;

	/* Type of the accessory | REQUIRED | STRING */
	type;

	/* Accessory name for variable purpose | REQUIRED | MUST BE UNIQUE TO type | MUST MATCH OTHER OUTFIT PARTS | STRING */
	variable;

	/* Colour name | AUTOFILL | string */
	colour = "white";

	/* Custom colour filter, used if colour is "custom" | STRING */
	colourCustom;

	/* Custom name to make the accessory uniquely identifiable when the colour is custom */
	customName;

	constructor(props) {
		/* parses passed object and populates class properties */
		Object.keys(props).forEach(prop => {
			this[prop] = props[prop];
		});

		/* cleans up unused properties */
		Object.keys(this).forEach(key => {
			if ([null, undefined].includes(this[key])) delete this[key];
		});
	}
}

window.AccessoryItem = AccessoryItem;
