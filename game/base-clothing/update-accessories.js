function updateAccessories() {
	if (!V.accessories) {
		V.accessories = {};
		V.wornAccessories = {};
	}

	for (const accessoryType of setup.accessoriesAllTypes) {
		if (accessoryType in V.accessories) continue;

		V.accessories[accessoryType] = [];
		V.wornAccessories[accessoryType] = [];
	}
}
DefineMacro("updateAccessories", updateAccessories);
