// @ts-check
/* For any item that has a colour_combat tag, set it to 0 if that item ever gets its own combat sprites.
 */
function initAccessoryFringes() {
	/** @type {AccessoryItemSetup[]} */
	const accessories = [];
	setup.accessories.fringes = accessories;

	/*
		Accessories that modders add go into this array. This should be empty in the base game at all times.
		These items should have a `modder` variable with the modder's name in a short string.
	*/
	setup.moddedAccessories.fringes = [];

	setup.accessories.fringes.push(...setup.moddedAccessories.fringes);
}
window.initAccessoryFringes = initAccessoryFringes;
