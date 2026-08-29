// @ts-check
/* For any item that has a colour_combat tag, set it to 0 if that item ever gets its own combat sprites.

Warmth checklist:
	Base: 0
	Covers mouth: +1
	Covers eyes: +1

	Materials
	Thin: -1
	Normal: 0
	Thick: +1

	Max warmth: 3
*/
function initAccessoryHair() {
	/** @type {AccessoryItem[]} */
	const clothing = [
		new AccessoryItem({
			index: 0,
			name: "little doll ribbons",
			variable: "little doll",
			word: "n",
			plural: 1,
			colour_options: ["black", "blue", "brown", "green", "pink", "purple", "red", "tangerine", "teal", "white", "yellow", "custom"],
			cost: 900,
			description: "Large ribbons to wear with the little doll hairstyle",
			shop: ["cosmetics"],
		}),
		new AccessoryItem({
			index: 1,
			name: "magical ribbons ribbons",
			variable: "magical ribbons",
			word: "n",
			plural: 1,
			colour_options: ["black", "blue", "brown", "green", "pink", "purple", "red", "tangerine", "teal", "white", "yellow", "custom"],
			cost: 1500,
			description: "Cosplay ribbons to wear with the magical ribbons hairstyle",
			shop: ["cosmetics"],
		}),
	];
	setup.accessories.hair = clothing;

	/*
		Clothes that modders add go into this array. This should be empty in the base game at all times.
		These items should have a `modder` variable with the modder's name in a short string.
	*/
	setup.moddedAccessories.hair = [];

	setup.accessories.hair.push(...setup.moddedAccessories.hair);
}
window.initAccessoryHair = initAccessoryHair;
