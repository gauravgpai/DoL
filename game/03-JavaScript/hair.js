/* global AccessoryTypes, Hairstyle */

/**
 * @param {AccessoryTypes} accessoryType
 * @param {Hairstyle} hairstyle
 */
function haveHairAccessoryFor(accessoryType, hairstyle) {
	const originalAccessory = setup.accessories[accessoryType].find(h => h.variable === hairstyle.variable);
	if (originalAccessory) return V.accessories[accessoryType].filter(a => a.index === originalAccessory.index).length > 0;

	return false;
}

window.haveHairAccessoryFor = haveHairAccessoryFor;
