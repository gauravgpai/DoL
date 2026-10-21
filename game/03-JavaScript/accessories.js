/* global AccessoryTypes, Hairstyle */

/**
 * @param {AccessoryTypes} accessoryType
 * @param {Hairstyle} hairstyle
 */
function haveSidesAccessoryFor(accessoryType, hairstyle) {
	const originalAccessory = setup.accessories[accessoryType].find(h => h.variable === hairstyle.variable);
	if (originalAccessory) return V.accessories[accessoryType].filter(a => a.setupIndex === originalAccessory.index).length > 0;

	return false;
}

window.haveSidesAccessoryFor = haveSidesAccessoryFor;

/**
 * @param {AccessoryItem} accessory
 */
function discardSidesAccessory(accessory) {
	const worn = V.wornAccessories.sides.find(
		a => a.type === accessory.type && a.colour === accessory.colour && (accessory.colour !== "custom" || a.customName === accessory.customName)
	);

	if (worn) {
		const newAccessory = V.accessories.sides.find(
			a => a.setupIndex === accessory.setupIndex && ((a.colour === "custom" && a.customName !== accessory.customName) || a.colour !== accessory.colour)
		);

		if (newAccessory) {
			removeAccessory(worn);
			wearAccessory(newAccessory);
		} else {
			V.wornAccessories.sides = [];
			V.hairtype = "default";
		}
	}

	const item = V.accessories[accessory.type].find(
		a => a.type === accessory.type && a.colour === accessory.colour && (accessory.colour !== "custom" || a.customName === accessory.customName)
	);
	const index = V.accessories[accessory.type].indexOf(item);
	V.accessories[accessory.type].splice(index, 1);
}

DefineMacro("discardSidesAccessory", discardSidesAccessory);
window.discardSidesAccessory = discardSidesAccessory;

/**
 * @param {AccessoryItem} accessory
 */
function wearAccessory(accessory) {
	V.wornAccessories[accessory.type].push(accessory);
}

DefineMacro("wearAccessory", wearAccessory);
window.wearAccessory = wearAccessory;

/**
 * @param {AccessoryItem} accessory
 */
function removeAccessory(accessory) {
	const index = V.wornAccessories[accessory.type].indexOf(accessory);
	V.wornAccessories[accessory.type].splice(index, 1);
}

DefineMacro("removeAccessory", removeAccessory);
window.removeAccessory = removeAccessory;

/**
 * @param {AccessoryTypes} type
 */
function removeAccessories(type) {
	V.wornAccessories[type] = [];
}

DefineMacro("removeAccessories", removeAccessories);
window.removeAccessories = removeAccessories;

/**
 * @param {AccessoryItem} accessory
 */
function discardAccessory(accessory) {
	const index = V.accessories[accessory.type].indexOf(accessory);
	V.accessories[accessory.type].splice(index, 1);
}

DefineMacro("discardAccessory", discardAccessory);
window.discardAccessory = discardAccessory;

/**
 * @param {AccessoryItemSetup} accessory
 * @param {object} fields
 */
function addAccessoryToInventory(accessory, fields) {
	const result = new AccessoryItem({
		setupIndex: accessory.index,
		type: accessory.type,
		variable: accessory.variable,
		colour: fields.colour ?? null,
		colourCustom: fields.colourCustom ?? null,
		customName: fields.customName ?? null,
	});

	V.accessories[accessory.type].push(result);
}

window.addAccessoryToInventory = addAccessoryToInventory;
