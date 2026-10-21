/* global removeAccessories, wearAccessory */

function createPresetHairObject() {
	const preset = {
		hairtype: V.hairtype,
		fringetype: V.fringetype,
		hairposition: V.hairposition,
	};

	const originalSides = setup.hairstyles.sides.find(h => h.variable === V.hairtype);

	if (originalSides.type.includes("ribbon")) {
		if (V.wornAccessories.sides.length === 0) throw new Error(`hairPresetSave: missing worn accessory for hairstyle that requires it`);
		preset.sidesAccessory = V.wornAccessories.sides[0];
	}

	return preset;
}

function loadPresetHairObject(hairPreset) {
	const originalSides = setup.hairstyles.sides.find(h => h.variable === hairPreset.hairtype);
	removeAccessories("sides");

	if (originalSides.type.includes("ribbon")) {
		const originalAccessory = setup.accessories.sides.find(h => h.variable === originalSides.variable);
		let accessory = V.accessories.sides.find(a => a.index === originalAccessory.index && a.colour === hairPreset.sidesAccessoryColour);

		if (!accessory) {
			accessory = V.accessories.sides.find(a => a.index === originalSides.index);
		}

		if (!accessory) {
			throw new Error(`hairPresetWear: preset ${name} is missing required accessories`);
		}

		wearAccessory(accessory);
	}

	V.hairtype = hairPreset.hairtype;
	V.fringetype = hairPreset.fringetype;
	V.hairposition = hairPreset.hairposition;
	V.ruffledisable = "f";
}

function hairPresetSave(name) {
	name = name.replace(/[^a-zA-Z\u4e00-\u9fa50-9_-]+/g, "").substring(0, 30);
	V.savedHairStyles[name] = createPresetHairObject();
}

DefineMacro("hairPresetSave", hairPresetSave);

function hairPresetDelete(name) {
	V.outfit.forEach(o => {
		if (o.hairStyle === name) {
			o.hairStyle = undefined;
		}
	});

	delete V.savedHairStyles[name];
}

DefineMacro("hairPresetDelete", hairPresetDelete);

function hairPresetOverwrite(name) {
	hairPresetDelete(name);
	hairPresetSave(name);
}

DefineMacro("hairPresetOverwrite", hairPresetOverwrite);

function hairPresetWear(name) {
	loadPresetHairObject(V.savedHairStyles[name]);
}

DefineMacro("hairPresetWear", hairPresetWear);

function saveTempHairStyle() {
	V.tempSavedHairStyles = createPresetHairObject();
}

DefineMacro("saveTempHairStyle", saveTempHairStyle);

function loadTempHairStyle() {
	if (V.tempSavedHairStyles) loadPresetHairObject(V.tempSavedHairStyles);
}

DefineMacro("loadTempHairStyle", loadTempHairStyle);
