/* global playerAwareTheyCanBePregnant */

/**
 * Character State Stats
 *
 * arousal
 * control
 * drugged
 * drunk
 * tiredness
 * hallucinogen
 * pain
 * stress
 * trauma
 *
 * +++
 *
 * Core Characteristic Stats
 *
 * awareness
 * beauty
 * deviancy
 * exhibitionism
 * physique - The player's body can currently be 1 of 4 sizes: Tiny, Small, Normal, and Large
 * promiscuity
 * purity
 * willpower
 *
 * +++
 *
 * Core Skill Stats
 *
 * athletics
 * danceskill
 * housekeeping
 * skulduggery
 * swimmingskill
 * tending
 *
 * +++
 *
 * School Skill Stats
 *
 * english
 * history
 * maths
 * science
 *
 * +++
 *
 * Sex Skill Stats
 *
 * analskill
 * bottomskill
 * chestskill
 * feetskill
 * handskill
 * oralskill
 * penileskill
 * seductionskill
 * thighskill
 * vaginalskill
 *
 * +++
 *
 * Weapon Skill Stats
 *
 * batonskill
 * netskill
 * sprayskill
 * whipskill
 * pickaxeskill
 */

const ModType = {
	Additive: "ADDITIVE",
	Multiplicative: "MULTIPLICATIVE",
};

const Mods = {
	/**
	 * Increase the PC's analskill to 1.0-1.2x if they're in heat and can be anally pregnant. Scales based on the PC's minimum arousal.
	 *
	 * @returns {number}
	 */
	analHeat() {
		if (playerHeatMinArousal() && playerCanCarryAnally()) {
			return 1 + 0.2 * Math.clamp(playerHeatMinArousal() / 4000, 0, 1);
		}
		return 1;
	},

	/**
	 * Increase the PC's physique to 1.1x, if they possess the Auriga Artefact.
	 *
	 * @returns {number}
	 */
	aurigaArtifact() {
		if (V.auriga_artefact === "pc") return 1.1;
		return 1;
	},

	/**
	 * Increase the PC's danceskill to 1.05x, if they're wearing dance clothes.
	 *
	 * @returns {number}
	 */
	danceClothes() {
		if (
			V.worn.under_upper.type.includes("dance") &&
			V.worn.under_lower.type.includes("dance") &&
			V.worn.upper.type.includes("dance") &&
			V.worn.lower.type.includes("dance")
		) {
			return 1.05;
		}
		return 1;
	},

	/**
	 * Increase the PC's danceskill to 1.05x, if they are naked.
	 *
	 * @returns {number}
	 */
	danceNaked() {
		if (
			V.worn.under_upper.type.includes("naked") &&
			V.worn.under_lower.type.includes("naked") &&
			V.worn.upper.type.includes("naked") &&
			V.worn.lower.type.includes("naked")
		) {
			return 1.05;
		}
		return 1;
	},

	/**
	 * Increase the PC's analskill to 1.0-1.2x if they don't have a vagina and their Ear Slime has the "Pregnancy" focus. Scales based on Ear Slime Growth.
	 *
	 * @returns {number}
	 */
	earSlimeAnal() {
		if (!V.player.vaginaExist && V.earSlime.growth > 100 && V.earSlime.focus === "pregnancy") {
			return 1 + 0.2 * ((V.earSlime.growth - 100) / 100);
		}
		return 1;
	},

	/**
	 * Change the PC's penileskill based on their Ear Slime's focus. Scales based on Ear Slime growth.
	 * - Increase the result to 1.0-1.2x if their Ear Slime has the "Impregnation" focus.
	 * - Otherwise, decrease the result to 1.0-0.75x if their Ear Slime has the "Pregnancy" focus.
	 *
	 * @returns {number}
	 */
	earSlimePenile() {
		if (V.earSlime.growth > 100) {
			if (V.earSlime.focus === "impregnation") {
				return 1 + 0.2 * ((V.earSlime.growth - 100) / 100);
			} else if (V.earSlime.focus === "pregnancy") {
				return 1 - 0.25 * ((V.earSlime.growth - 100) / 100);
			}
		}
		return 1;
	},

	/**
	 * Increase the PC's seductionskill to 1.0-1.25x if their Ear Slime Defy isn't on cooldown. Scales based on Ear Slime Growth.
	 *
	 * @returns {number}
	 */
	earSlimeSeduction() {
		if (V.earSlime.growth > 50 && !V.earSlime.defyCooldown) {
			return 1 + 0.25 * ((V.earSlime.growth - 50) / 150);
		}
		return 1;
	},

	/**
	 * Change the PC's vaginalskill based on their Ear Slime's focus. Scales based on Ear Slime growth.
	 * - Increase the result to 1.0-1.2x if their Ear Slime has the "Pregnancy" focus.
	 * - Otherwise, decrease the result to 1.0-0.75x if their Ear Slime has the "Impregnation" focus.
	 *
	 * @returns {number}
	 */
	earSlimeVaginal() {
		if (V.earSlime.growth > 100) {
			if (V.earSlime.focus === "pregnancy") {
				return 1 + 0.2 * ((V.earSlime.growth - 100) / 100);
			} else if (V.earSlime.focus === "impregnation") {
				return 1 - 0.25 * ((V.earSlime.growth - 100) / 100);
			}
		}

		return 1;
	},

	/**
	 * Decrease the PC's willpower to 0.9-0.8x, if they have 2 or more Ear Slimes. Scales based on Ear Slime growth.
	 *
	 * @returns {number}
	 */
	earSlimeWillpower() {
		if (numberOfEarSlime() >= 2) {
			return 0.9 - 0.1 * Math.clamp((V.earSlime.growth - 50) / 100, 0, 1);
		}
		return 1;
	},

	/**
	 * Increase the PC's sex stat based on their heat / rut cycle and their minimum arousal.
	 *
	 * "deviancy" is affected at 100% strength.
	 * "exhibitionism" is affected at 0% strength.
	 * "promiscuity" is affected at 75% strength.
	 *
	 * @param {string} statName Can be "deviancy", "exhibitionism", or "promiscuity".
	 * @returns {number}
	 */
	heatRutSexBoost(statName) {
		if (statName === "exhibitionism") {
			return 0;
		} else if (statName !== "deviancy" && statName !== "promiscuity") {
			Errors.report(`[Mods.heatRutSexBoost]: input '${statName}' is invalid.`, {
				Stacktrace: Utils.GetStack(),
				statName,
			});
			return 0;
		}

		/**
		 * While the PC's minimum arousal can technically go higher than 2500, a PC with only a penis has this arousal max out at 1500, and a PC with only a vagina has this arousal max out at 2500 (when risk = 0 and taking fertility pills). This also assumes the PC does not have ear slimes and anal pregnancy is disabled.
		 *
		 * To account for this, the PC's Sex Stat mods will have their boosts max out at 2,500 minimum arousal to make the effects more noticeable.
		 *
		 * The PC's actual maximum minimum arousal threshold, meanwhile, is handled in a separate function.
		 */
		const maxMinArousal = 2500; // Maximum value for minArousal.
		const minArousal = Math.clamp(playerHeatMinArousal() + playerRutMinArousal(), 0, maxMinArousal);
		if (minArousal === 0) return 0;

		const maxHeatRutSexBoostModifier = 30; // Maximum modifier for sexStat() from minArousal.
		const heatRutSexBoostExponent = 0.6; // Lower to raise the final modifier at lower levels of minArousal.
		const heatRutSexBoostModifier = (maxHeatRutSexBoostModifier / maxMinArousal ** heatRutSexBoostExponent) * minArousal ** heatRutSexBoostExponent;

		if (statName === "promiscuity") {
			return Math.floor(heatRutSexBoostModifier * 0.75);
		} else {
			return Math.floor(heatRutSexBoostModifier);
		}
	},

	/**
	 * Decrease the PC's result based on the strength, if their upper or lower clothing has the "Heavy" trait. Scales based on physique.
	 * - athletics scales from 0-(2 / 3)x.
	 * - danceskill scales from 0-(1 / 3)x.
	 * - swimmingskill scales from 0-(1 / 3)x.
	 *
	 * @param {number} strength 1.0 = 100% decrease.
	 * @returns {number}
	 */
	heavyClothes(strength) {
		if (isNaN(strength)) {
			Errors.report(`[Mods.heavyClothes]: strength '${strength}' is not a number.`, {
				Stacktrace: Utils.GetStack(),
				strength,
			});
			return 1;
		}

		if (V.worn.upper.type.includes("heavy") || V.worn.lower.type.includes("heavy")) {
			return (1 - strength) * (V.physique / V.physiquesize);
		}
		return 1;
	},

	/**
	 * Increase the PC's housekeeping by 1.05x for each "Maid" clothing item they are wearing.
	 *
	 * Applies to the PC's upper clothes, lower clothes, and headwear.
	 *
	 * @returns {number}
	 */
	maidClothes() {
		let result = 1;
		// The PC's upper clothing has the "Maid" trait.
		if (V.worn.upper.type.includes("maid")) {
			result *= 1.05;
		}
		// The PC's lower clothing has the "Maid" trait.
		if (V.worn.lower.type.includes("maid")) {
			result *= 1.05;
		}
		// The PC's headwear has the "Maid" trait.
		if (V.worn.head.type.includes("maid")) {
			result *= 1.05;
		}
		return result;
	},

	/**
	 * Increase the PC's housekeeping by 1.05x, if they have a holding an item with the "Maid" trait.
	 *
	 * @returns {number}
	 */
	maidHandheld() {
		if (V.worn.handheld.type.includes("maid")) {
			return 1.05;
		}
		return 1;
	},

	/**
	 * Increase the PC's result by 1% per point of Moor Luck.
	 *
	 * Affected Skills:
	 * - physique
	 * - willpower
	 * - athletics
	 * - danceskill
	 * - housekeeping
	 * - skulduggery
	 * - swimmingskill
	 * - tending
	 * - english
	 * - history
	 * - maths
	 * - science
	 *
	 * @returns {number}
	 */
	moorLuck() {
		return 1 + 0.01 * V.moorLuck;
	},

	/**
	 * Increase the PC's penileskill to 1.0-1.2x if they're in rut. Scales based on the PC's minimum arousal.
	 *
	 * @returns {number}
	 */
	penileRut() {
		if (playerRutMinArousal()) {
			return 1 + 0.2 * Math.clamp(playerRutMinArousal() / 4000, 0, 1);
		}
		return 1;
	},

	/**
	 * Increase the PC's tending to 1.0-1.5x, if they have the "Dendrophile" / "Plant Lover" trait. Scales based on trauma.
	 *
	 * @returns {number}
	 */
	plantTrauma() {
		if (V.backgroundTraits.includes("plantlover")) {
			return 1 + 0.5 * (V.trauma / V.traumamax);
		}
		return 1;
	},

	/**
	 * Decrease the PC's result while they are pregnant. Scales based on the PC's belly size and the number of times they've given birth. No decrease if the PC has the "Gaia" trait (>= 20 births).
	 * - Decrease the result to 1.0-0.8x, if they have the "Broodmother" trait.
	 * - Otherwise, decrease the result to 1.0-0.75x, if they have the "Mother" trait.
	 * - Otherwise, decrease the result to 1.0-0.6x, if they have the "Second Time Mother" trait.
	 * - Otherwise, decrease the result to 1.0-0.5x, if they have the "First Time Mother" trait.
	 * - Otherwise, decrease the result to 1.0-0.33x.
	 *
	 * Affected Skills:
	 * - physique
	 * - athletics
	 * - danceskill
	 * - swimmingskill
	 *
	 * @returns {number}
	 */
	pregnant() {
		if (playerBellySize() >= 10 && playerNormalPregnancyTotal() < 20) {
			let birthMod;
			if (playerNormalPregnancyTotal() >= 8) {
				birthMod = 0.2;
			} else if (playerNormalPregnancyTotal() >= 3) {
				birthMod = 0.25;
			} else if (playerNormalPregnancyTotal() >= 2) {
				birthMod = 0.4;
			} else if (playerNormalPregnancyTotal() >= 1) {
				birthMod = 0.5;
			} else {
				birthMod = 2 / 3;
			}

			const bellyMod = playerBellySize() / 24;
			return 1 - bellyMod * birthMod;
		}
		return 1;
	},

	/**
	 * Increase the result to 1.0-1.1x, if the PC is in the Forest, Moor, Farmlands, or Alex's Farm, and is wearing footwear with the "Rugged" trait. Scales based on feet skill.
	 *
	 * Affected Skills:
	 * - physique
	 * - athletics
	 *
	 * @returns {number}
	 */
	ruggedBoots() {
		if (["forest", "moor", "farm", "alex_farm"].includes(V.location) && V.worn.feet.type.includes("rugged")) {
			return 1 + 0.1 * (PC.feetskill / 1000);
		}
		return 1;
	},

	/**
	 * Decrease the result to 1.0-0.8x, if the PC is in the Forest, Moor, Farmlands, or Alex's Farm, and is wearing footwear with the "Heels" trait. Scales based on heel reveal.
	 *
	 * Affected Skills:
	 * - physique
	 * - athletics
	 *
	 * @returns {number}
	 */
	ruggedHeels() {
		if (["forest", "moor", "farm", "alex_farm"].includes(V.location) && V.worn.feet.type.includes("heels")) {
			return 1 - 0.2 * (V.worn.feet.reveal / 1000);
		}
		return 1;
	},

	/**
	 * Decrease the PC's result based on the strength, if their footwear has the "Shackle" trait.
	 * - athletics decreases to 0.1x.
	 * - danceskill decreases to 0.5x.
	 * - swimmingskill decreases to 0.5x.
	 *
	 * @param {number} strength 1.0 = 100% decrease.
	 * @returns {number}
	 */
	shackled(strength) {
		if (isNaN(strength)) {
			Errors.report(`[Mods.shackled]: strength '${strength}' is not a number.`, {
				Stacktrace: Utils.GetStack(),
				strength,
			});
			return 1;
		}

		if (V.worn.feet.type.includes("shackle")) return 1 - strength;
		return 1;
	},

	/**
	 * Increase the PC's Skulduggery to 1.05x, if they have the "Sharp Eyes" trait.
	 *
	 * @returns {number}
	 */
	sharpEyes() {
		if (V.transformationParts.traits.sharpEyes !== "disabled") return 1.05;
		return 1;
	},

	/**
	 * Increase the PC's Skulduggery to 1.05x, if their hand item has the "Sticky Fingers" trait.
	 *
	 * @returns {number}
	 */
	stickyFingers() {
		if (V.worn.hands.type.includes("sticky_fingers")) return 1.05;
		return 1;
	},

	/**
	 * Increase the PC's swimmingskill to 1.05x, if they're wearing swimming clothes.
	 *
	 * @returns {number}
	 */
	swimmingClothes() {
		if (
			V.worn.under_upper.type.includes("swim") &&
			V.worn.under_lower.type.includes("swim") &&
			V.worn.upper.type.includes("swim") &&
			V.worn.lower.type.includes("swim")
		) {
			return 1.05;
		}
		return 1;
	},

	/**
	 * Increase the PC's swimmingskill to 1.05x, if they're naked.
	 *
	 * @returns {number}
	 */
	swimmingNaked() {
		if (
			V.worn.under_upper.type.includes("naked") &&
			V.worn.under_lower.type.includes("naked") &&
			V.worn.upper.type.includes("naked") &&
			V.worn.lower.type.includes("naked")
		) {
			return 1.05;
		}
		return 1;
	},

	/**
	 * Increase the PC's swimmingskill to 1.0-1.1x, if their footwear has the "Swim" trait. Scales based on feet skill.
	 *
	 * @returns {number}
	 */
	swimmingFlippers() {
		if (V.worn.feet.type.includes("swim")) {
			return 1 + 0.1 * (PC.feetskill / 1000);
		}

		return 1;
	},

	/**
	 * Decrease the PC's swimmingskill to 0.8-0.9x, if their footwear has the "Heels" trait. Scales based on feet skill.
	 *
	 * @returns {number}
	 */
	swimmingHeels() {
		if (V.worn.feet.type.includes("heels")) {
			return 0.8 + 0.1 * (PC.feetskill / 1000);
		}

		return 1;
	},

	/**
	 * Decrease the PC's swimmingskill to 0.9-1.0x, if their footwear doesn't have the "Swim", "Heels", or "Naked" trait. Scales based on feet skill.
	 *
	 * @returns {number}
	 */
	swimmingShoes() {
		if (!V.worn.feet.type.includes("swim") && !V.worn.feet.type.includes("heels") && !V.worn.feet.type.includes("naked")) {
			return 0.9 + 0.1 * (PC.feetskill / 1000);
		}

		return 1;
	},

	/**
	 * Increase the PC's athletics to 1.1x, if they have the "Thrill of the Chase" trait.
	 *
	 * @returns {number}
	 */
	thrillOfTheChase() {
		if (V.transformationParts.traits.chase !== "disabled") return 1.1;
		return 1;
	},

	/**
	 * Increase the PC's vaginalskill to 1.0-1.2x if they're in heat. Scales based on the PC's minimum arousal.
	 *
	 * @returns {number}
	 */
	vaginalHeat() {
		if (playerHeatMinArousal()) {
			return 1 + 0.2 * Math.clamp(playerHeatMinArousal() / 4000, 0, 1);
		}
		return 1;
	},
};

const Base = {
	get arousal() {
		return V.arousal;
	},

	set arousal(value) {
		V.arousal = value;
	},

	get control() {
		return V.control;
	},

	set control(value) {
		V.control = value;
	},

	get drugged() {
		return V.drugged;
	},

	set drugged(value) {
		V.drugged = value;
	},

	get drunk() {
		return V.drunk;
	},

	set drunk(value) {
		V.drunk = value;
	},

	get tiredness() {
		return V.tiredness;
	},

	set tiredness(value) {
		V.tiredness = value;
	},

	get hallucinogen() {
		return V.hallucinogen;
	},

	set hallucinogen(value) {
		V.hallucinogen = value;
	},

	get pain() {
		return V.pain;
	},

	set pain(value) {
		V.pain = value;
	},

	get stress() {
		return V.stress;
	},

	set stress(value) {
		V.stress = value;
	},

	get trauma() {
		return V.trauma;
	},

	set trauma(value) {
		V.trauma = value;
	},

	// Core Characteristic Stats

	get awareness() {
		return V.awareness;
	},

	set awareness(value) {
		V.awareness = value;
	},

	get beauty() {
		return V.beauty;
	},

	set beauty(value) {
		V.beauty = value;
	},

	get deviancy() {
		return V.deviancy;
	},

	set deviancy(value) {
		V.deviancy = value;
	},

	get exhibitionism() {
		return V.exhibitionism;
	},

	set exhibitionism(value) {
		V.exhibitionism = value;
	},

	get physique() {
		return V.physique;
	},

	set physique(value) {
		V.physique = value;
	},

	get promiscuity() {
		return V.promiscuity;
	},

	set promiscuity(value) {
		V.promiscuity = value;
	},

	get purity() {
		return V.purity;
	},

	set purity(value) {
		V.purity = value;
	},

	get willpower() {
		return V.willpower;
	},

	set willpower(value) {
		V.willpower = value;
	},

	// Core Skill Stats

	get athletics() {
		return V.athletics;
	},

	set athletics(value) {
		V.athletics = value;
	},

	get danceskill() {
		return V.danceskill;
	},

	set danceskill(value) {
		V.danceskill = value;
	},

	get housekeeping() {
		return V.housekeeping;
	},

	set housekeeping(value) {
		V.housekeeping = value;
	},

	get skulduggery() {
		return V.skulduggery;
	},

	set skulduggery(value) {
		V.skulduggery = value;
	},

	get swimmingskill() {
		return V.swimmingskill;
	},

	set swimmingskill(value) {
		V.swimmingskill = value;
	},

	get tending() {
		return V.tending;
	},

	set tending(value) {
		V.tending = value;
	},

	// School Skill Stats

	get english() {
		return V.english;
	},

	set english(value) {
		V.english = value;
	},

	get history() {
		return V.history;
	},

	set history(value) {
		V.history = value;
	},

	get maths() {
		return V.maths;
	},

	set maths(value) {
		V.maths = value;
	},

	get science() {
		return V.science;
	},

	set science(value) {
		V.science = value;
	},

	// Sex Skill Stats

	get analskill() {
		return V.analskill;
	},

	set analskill(value) {
		V.analskill = value;
	},

	get bottomskill() {
		return V.bottomskill;
	},

	set bottomskill(value) {
		V.bottomskill = value;
	},

	get chestskill() {
		return V.chestskill;
	},

	set chestskill(value) {
		V.chestskill = value;
	},

	get feetskill() {
		return V.feetskill;
	},

	set feetskill(value) {
		V.feetskill = value;
	},

	get handskill() {
		return V.handskill;
	},

	set handskill(value) {
		V.handskill = value;
	},

	get oralskill() {
		return V.oralskill;
	},

	set oralskill(value) {
		V.oralskill = value;
	},

	get penileskill() {
		return V.penileskill;
	},

	set penileskill(value) {
		V.penileskill = value;
	},

	get seductionskill() {
		return V.seductionskill;
	},

	set seductionskill(value) {
		V.seductionskill = value;
	},

	get thighskill() {
		return V.thighskill;
	},

	set thighskill(value) {
		V.thighskill = value;
	},

	get vaginalskill() {
		return V.vaginalskill;
	},

	set vaginalskill(value) {
		V.vaginalskill = value;
	},

	// Weapon Skill Stats

	get batonskill() {
		return V.prof.baton;
	},

	set batonskill(value) {
		V.prof.baton = value;
	},

	get netskill() {
		return V.prof.net;
	},

	set netskill(value) {
		V.prof.net = value;
	},

	get sprayskill() {
		return V.prof.spray;
	},

	set sprayskill(value) {
		V.prof.spray = value;
	},

	get whipskill() {
		return V.prof.whip;
	},

	set whipskill(value) {
		V.prof.whip = value;
	},

	get pickaxeskill() {
		return V.prof.pickaxe;
	},

	set pickaxeskill(value) {
		V.prof.pickaxe = value;
	},
};

const PC = {
	appliedModifiers: {
		arousal: [],

		control: [],

		drugged: [],

		drunk: [],

		tiredness: [],

		hallucinogen: [],

		pain: [],

		stress: [],

		trauma: [],

		// Core Characteristic Stats
		awareness: [],

		beauty: [],

		deviancy: [
			{
				modName: "drunkSexBoost",
				modifier: () => Mods.drunkSexBoost(V.deviancy),
				type: ModType.Additive,
				label: () => {
					return "drunk";
				},
			},
			{
				modName: "heatRutSexBoost",
				modifier: () => Mods.heatRutSexBoost(1),
				type: ModType.Additive,
				label: () => {
					const labels = [];
					if (playerHeatMinArousal()) {
						labels.push("in heat");
					}
					if (playerRutMinArousal()) {
						labels.push("in rut");
					}
					return labels;
				},
			},
		],

		exhibitionism: [
			{
				modName: "drunkSexBoost",
				modifier: () => Mods.drunkSexBoost(V.exhibitionism),
				type: ModType.Additive,
				label: () => {
					return "drunk";
				},
			},
		],

		physique: [
			{
				modName: "aurigaArtifact",
				modifier: () => Mods.aurigaArtifact(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>a white so pale</i>";
				},
			},
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
			{
				modName: "pregnant",
				modifier: () => Mods.pregnant(),
				type: ModType.Multiplicative,
				label: () => {
					return playerAwareTheyArePregnant() ? "pregnant" : "large belly";
				},
			},
			{
				modName: "ruggedBoots",
				modifier: () => Mods.ruggedBoots(),
				type: ModType.Multiplicative,
				label: () => {
					return "rugged";
				},
			},
			{
				modName: "ruggedHeels",
				modifier: () => Mods.ruggedHeels(),
				type: ModType.Multiplicative,
				label: () => {
					return "heels";
				},
			},
		],

		promiscuity: [
			{
				modName: "drunkSexBoost",
				modifier: () => Mods.drunkSexBoost(V.promiscuity),
				type: ModType.Additive,
				label: () => {
					return "drunk";
				},
			},
			{
				modName: "heatRutSexBoost",
				modifier: () => Mods.heatRutSexBoost(0.75),
				type: ModType.Additive,
				label: () => {
					const labels = [];
					if (playerHeatMinArousal()) {
						labels.push("in heat");
					}
					if (playerRutMinArousal()) {
						labels.push("in rut");
					}
					return labels;
				},
			},
		],

		purity: [],

		willpower: [
			{
				modName: "earSlimeWillpower",
				modifier: () => Mods.earSlimeWillpower(),
				type: ModType.Multiplicative,
				label: () => {
					return "ear slimes";
				},
			},
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
		],

		// Core Skill Stats
		athletics: [
			{
				modName: "heavyClothes",
				modifier: () => Mods.heavyClothes(1 / 3),
				type: ModType.Multiplicative,
				label: () => {
					return "<b>armoured</b>";
				},
			},
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
			{
				modName: "pregnant",
				modifier: () => Mods.pregnant(),
				type: ModType.Multiplicative,
				label: () => {
					return playerAwareTheyArePregnant() ? "pregnant" : "large belly";
				},
			},
			{
				modName: "ruggedBoots",
				modifier: () => Mods.ruggedBoots(),
				type: ModType.Multiplicative,
				label: () => {
					return "rugged";
				},
			},
			{
				modName: "ruggedHeels",
				modifier: () => Mods.ruggedHeels(),
				type: ModType.Multiplicative,
				label: () => {
					return "heels";
				},
			},
			{
				modName: "shackled",
				modifier: () => Mods.shackled(0.9),
				type: ModType.Multiplicative,
				label: () => {
					return "<b>shackled</b>";
				},
			},
			{
				modName: "thrillOfTheChase",
				modifier: () => Mods.thrillOfTheChase(),
				type: ModType.Multiplicative,
				label: () => {
					return "thrill of the chase";
				},
			},
		],

		danceskill: [
			{
				modName: "danceClothes",
				modifier: () => Mods.danceClothes(),
				type: ModType.Multiplicative,
				label: () => {
					return "dancing attire";
				},
			},
			{
				modName: "danceNaked",
				modifier: () => Mods.danceNaked(),
				type: ModType.Multiplicative,
				label: () => {
					return "naked";
				},
			},
			{
				modName: "heavyClothes",
				modifier: () => Mods.heavyClothes(2 / 3),
				type: ModType.Multiplicative,
				label: () => {
					return "<b>armoured</b>";
				},
			},
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
			{
				modName: "pregnant",
				modifier: () => Mods.pregnant(),
				type: ModType.Multiplicative,
				label: () => {
					return playerAwareTheyArePregnant() ? "pregnant" : "large belly";
				},
			},
			{
				modName: "shackled",
				modifier: () => Mods.shackled(0.5),
				type: ModType.Multiplicative,
				label: () => {
					return "<b>shackled</b>";
				},
			},
		],

		housekeeping: [
			{
				modName: "maidClothes",
				modifier: () => Mods.maidClothes(),
				type: ModType.Multiplicative,
				label: () => {
					return "maid outfit";
				},
			},
			{
				modName: "maidHandheld",
				modifier: () => Mods.maidHandheld(),
				type: ModType.Multiplicative,
				label: () => {
					return "cleaning supplies";
				},
			},
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
		],

		skulduggery: [
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
			{
				modName: "sharpEyes",
				modifier: () => Mods.sharpEyes(),
				type: ModType.Multiplicative,
				label: () => {
					return "sharp eyes";
				},
			},
			{
				modName: "stickyFingers",
				modifier: () => Mods.stickyFingers(),
				type: ModType.Multiplicative,
				label: () => {
					return "sticky fingers";
				},
			},
		],

		swimmingskill: [
			{
				modName: "heavyClothes",
				modifier: () => Mods.heavyClothes(2 / 3),
				type: ModType.Multiplicative,
				label: () => {
					return "<b>armoured</b>";
				},
			},
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
			{
				modName: "pregnant",
				modifier: () => Mods.pregnant(),
				type: ModType.Multiplicative,
				label: () => {
					return playerAwareTheyArePregnant() ? "pregnant" : "large belly";
				},
			},
			{
				modName: "shackled",
				modifier: () => Mods.shackled(0.5),
				type: ModType.Multiplicative,
				label: () => {
					return "<b>shackled</b>";
				},
			},
			{
				modName: "swimmingClothes",
				modifier: () => Mods.swimmingClothes(),
				type: ModType.Multiplicative,
				label: () => {
					return "swimwear";
				},
			},
			{
				modName: "swimmingNaked",
				modifier: () => Mods.swimmingNaked(),
				type: ModType.Multiplicative,
				label: () => {
					return "naked";
				},
			},
			{
				modName: "swimmingFlippers",
				modifier: () => Mods.swimmingFlippers(),
				type: ModType.Multiplicative,
				label: () => {
					return "flippers";
				},
			},
			{
				modName: "swimmingHeels",
				modifier: () => Mods.swimmingHeels(),
				type: ModType.Multiplicative,
				label: () => {
					return "heels";
				},
			},
			{
				modName: "swimmingShoes",
				modifier: () => Mods.swimmingShoes(),
				type: ModType.Multiplicative,
				label: () => {
					return "shoes";
				},
			},
		],

		tending: [
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
			{
				modName: "plantTrauma",
				modifier: () => Mods.plantTrauma(),
				type: ModType.Multiplicative,
				label: () => {
					return V.submissive <= 850 ? "dendrophile" : "plant lover";
				},
			},
		],

		// School Skill Stats
		english: [
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
		],

		history: [
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
		],

		maths: [
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
		],

		science: [
			{
				modName: "moorLuck",
				modifier: () => Mods.moorLuck(),
				type: ModType.Multiplicative,
				label: () => {
					return "<i>????</i>";
				},
			},
		],

		// Sex Skill Stats
		analskill: [
			{
				modName: "analHeat",
				modifier: () => Mods.analHeat(),
				type: ModType.Multiplicative,
				label: () => {
					return !V.player.vaginaExist && playerAwareTheyCanBePregnant() ? "in heat" : "<i>????</i>";
				},
			},
			{
				modName: "earSlimeAnal",
				modifier: () => Mods.earSlimeAnal(),
				type: ModType.Multiplicative,
				label: () => {
					return "ear slimes";
				},
			},
		],

		bottomskill: [],

		chestskill: [],

		feetskill: [],

		handskill: [],

		oralskill: [],

		penileskill: [
			{
				modName: "earSlimePenile",
				modifier: () => Mods.earSlimePenile(),
				type: ModType.Multiplicative,
				label: () => {
					return "ear slimes";
				},
			},
			{
				modName: "penileRut",
				modifier: () => Mods.penileRut(),
				type: ModType.Multiplicative,
				label: () => {
					return "in rut";
				},
			},
		],

		seductionskill: [
			{
				modName: "earSlimeSeduction",
				modifier: () => Mods.earSlimeSeduction,
				type: ModType.Multiplicative,
				label: () => {
					return "ear slimes";
				},
			},
		],

		thighskill: [],

		vaginalskill: [
			{
				modName: "earSlimeVaginal",
				modifier: () => Mods.earSlimeVaginal(),
				type: ModType.Multiplicative,
				label: () => {
					return "ear slimes";
				},
			},
			{
				modName: "vaginalHeat",
				modifier: () => Mods.vaginalHeat(),
				type: ModType.Multiplicative,
				label: () => {
					return "in heat";
				},
			},
		],

		// Weapon Skill Stats
		batonskill: [],

		netskill: [],

		sprayskill: [],

		whipskill: [],

		pickaxeskill: [],
	},

	/**
	 * Takes in an array of Modifiers and returns the ones that are currently active.
	 *
	 * If `include` is:
	 * - "all"- All modifiers affecting the stat will be returned.
	 * - "positive"- Only modifiers that increase the stat are returned.
	 * - "negative"- Only modifiers that decrease the stat are returned.
	 *
	 * Returns an empty array if the "include" parameters is invalid, or if a modifier has an invalid type.
	 *
	 * @param {Array<Modifier>} modifiers
	 * @param {string} include Can be "all", "positive", or "negative".
	 * @returns {Array<Modifier>}
	 */
	activeModifiers(modifiers, include) {
		if (!["all", "positive", "negative"].includes(include)) {
			Errors.report(`[PC.activeModifiers]: include '${include}' is invalid.`, {
				Stacktrace: Utils.GetStack(),
				include,
			});
			return [];
		}
		const activeMods = [];

		for (let i = 0; i < modifiers.length; i++) {
			const modInfo = modifiers[i];
			if (modInfo === undefined) {
				Errors.report(`[PC.activeModifiers]: modInfo '${modInfo}' is undefined.`, {
					Stacktrace: Utils.GetStack(),
					modInfo,
				});
				return [];
			}
			const result = modInfo.modifier();

			let breakpoint;
			const modType = modInfo.type;
			if (modType === ModType.Additive) {
				// Additive modifiers don't change the final value when they are equal to 0.
				breakpoint = 0;
			} else if (modType === ModType.Multiplicative) {
				// Multiplicative modifiers don't change the final value when they are equal to 1.
				breakpoint = 1;
			} else {
				Errors.report(`[PC.activeModifiers]: modType '${modType}' is unknown.`, {
					Stacktrace: Utils.GetStack(),
					modType,
				});
				return [];
			}

			if (
				(include === "all" && result !== breakpoint) ||
				(include === "positive" && result > breakpoint) ||
				(include === "negative" && result < breakpoint)
			) {
				activeMods.push(modInfo);
			}
		}

		return activeMods;
	},

	/**
	 * Applies and returns the value of the stat after all of the specified modifiers have been applied to it.
	 *
	 * @param {number} statValue
	 * @param {Array<Modifier>} modifiers An array of the relevant modifier function names.
	 * @returns {number}
	 */
	applyModifiers(statValue, modifiers) {
		if (isNaN(statValue)) {
			Errors.report(`[PC.applyModifiers]: statValue '${statValue}' is not a number.`, {
				Stacktrace: Utils.GetStack(),
				statValue,
			});
			return 0;
		}

		for (let i = 0; i < modifiers.length; i++) {
			const modInfo = modifiers[i];

			const modType = modInfo.type;
			if (modType === ModType.Additive) {
				statValue += modInfo.modifier();
			} else if (modType === ModType.Multiplicative) {
				statValue *= modInfo.modifier();
			} else {
				Errors.report(`[PC.applyModifiers]: modType '${modType}' is unknown.`, {
					Stacktrace: Utils.GetStack(),
					modType,
				});
				return 0;
			}
		}
		return statValue;
	},

	get arousal() {
		return Math.max(0, Math.round(this.applyModifiers(Base.arousal, this.appliedModifiers.arousal)));
	},

	get control() {
		return Math.max(0, Math.round(this.applyModifiers(Base.control, this.appliedModifiers.control)));
	},

	get drugged() {
		return Math.max(0, Math.round(this.applyModifiers(Base.drugged, this.appliedModifiers.drugged)));
	},

	get drunk() {
		return Math.max(0, Math.round(this.applyModifiers(Base.drunk, this.appliedModifiers.drunk)));
	},

	get tiredness() {
		return Math.max(0, Math.round(this.applyModifiers(Base.tiredness, this.appliedModifiers.tiredness)));
	},

	get hallucinogen() {
		return Math.max(0, Math.round(this.applyModifiers(Base.hallucinogen, this.appliedModifiers.hallucinogen)));
	},

	get pain() {
		return Math.max(0, Math.round(this.applyModifiers(Base.pain, this.appliedModifiers.pain)));
	},

	get stress() {
		return Math.max(0, Math.round(this.applyModifiers(Base.stress, this.appliedModifiers.stress)));
	},

	get trauma() {
		return Math.max(0, Math.round(this.applyModifiers(Base.trauma, this.appliedModifiers.trauma)));
	},

	// Core Characteristic Stats

	get awareness() {
		return Math.max(V.awarenessmin, Math.round(this.applyModifiers(Base.awareness, this.appliedModifiers.awareness)));
	},

	get beauty() {
		return Math.max(0, Math.round(this.applyModifiers(Base.beauty, this.appliedModifiers.beauty)));
	},

	get deviancy() {
		return Math.max(0, Math.round(this.applyModifiers(Base.deviancy, this.appliedModifiers.deviancy)));
	},

	get exhibitionism() {
		return Math.max(0, Math.round(this.applyModifiers(Base.exhibitionism, this.appliedModifiers.exhibitionism)));
	},

	get physique() {
		return Math.max(0, Math.round(this.applyModifiers(Base.physique, this.appliedModifiers.physique)));
	},

	get promiscuity() {
		return Math.max(0, Math.round(this.applyModifiers(Base.promiscuity, this.appliedModifiers.promiscuity)));
	},

	get purity() {
		return Math.max(0, Math.round(this.applyModifiers(Base.purity, this.appliedModifiers.purity)));
	},

	get willpower() {
		return Math.max(0, Math.round(this.applyModifiers(Base.willpower, this.appliedModifiers.willpower)));
	},

	// Core Skill Stats

	get athletics() {
		return Math.max(0, Math.round(this.applyModifiers(Base.athletics, this.appliedModifiers.athletics)));
	},

	get danceskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.danceskill, this.appliedModifiers.danceskill)));
	},

	get housekeeping() {
		return Math.max(0, Math.round(this.applyModifiers(Base.housekeeping, this.appliedModifiers.housekeeping)));
	},

	get skulduggery() {
		return Math.max(0, Math.round(this.applyModifiers(Base.skulduggery, this.appliedModifiers.skulduggery)));
	},

	get swimmingskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.swimmingskill, this.appliedModifiers.swimmingskill)));
	},

	get tending() {
		return Math.max(0, Math.round(this.applyModifiers(Base.tending, this.appliedModifiers.tending)));
	},

	// School Skill Stats

	get english() {
		return Math.max(0, Math.round(this.applyModifiers(Base.english, this.appliedModifiers.english)));
	},

	get history() {
		return Math.max(0, Math.round(this.applyModifiers(Base.history, this.appliedModifiers.history)));
	},

	get maths() {
		return Math.max(0, Math.round(this.applyModifiers(Base.maths, this.appliedModifiers.maths)));
	},

	get science() {
		return Math.max(0, Math.round(this.applyModifiers(Base.science, this.appliedModifiers.science)));
	},

	// Sex Skill Stats

	get analskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.analskill, this.appliedModifiers.analskill)));
	},

	get bottomskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.bottomskill, this.appliedModifiers.bottomskill)));
	},

	get chestskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.chestskill, this.appliedModifiers.chestskill)));
	},

	get feetskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.feetskill, this.appliedModifiers.feetskill)));
	},

	get handskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.handskill, this.appliedModifiers.handskill)));
	},

	get oralskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.oralskill, this.appliedModifiers.oralskill)));
	},

	get penileskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.penileskill, this.appliedModifiers.penileskill)));
	},

	get seductionskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.seductionskill, this.appliedModifiers.seductionskill)));
	},

	get thighskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.thighskill, this.appliedModifiers.thighskill)));
	},

	get vaginalskill() {
		return Math.max(0, Math.round(this.applyModifiers(Base.vaginalskill, this.appliedModifiers.vaginalskill)));
	},

	// Weapon Skill Stats

	get batonskill() {
		if (Base.batonskill === undefined) return 0;
		return Math.max(0, Math.round(this.applyModifiers(Base.batonskill, this.appliedModifiers.batonskill)));
	},

	get netskill() {
		if (Base.netskill === undefined) return 0;
		return Math.max(0, Math.round(this.applyModifiers(Base.netskill, this.appliedModifiers.netskill)));
	},

	get sprayskill() {
		if (Base.sprayskill === undefined) return 0;
		return Math.max(0, Math.round(this.applyModifiers(Base.sprayskill, this.appliedModifiers.sprayskill)));
	},

	get whipskill() {
		if (Base.whipskill === undefined) return 0;
		return Math.max(0, Math.round(this.applyModifiers(Base.whipskill, this.appliedModifiers.whipskill)));
	},

	get pickaxeskill() {
		if (Base.pickaxeskill === undefined) return 0;
		return Math.max(0, Math.round(this.applyModifiers(Base.pickaxeskill, this.appliedModifiers.pickaxeskill)));
	},
};

const Check = {

};

/**
 * Since the "primary contributor" to the PC passing or failing a stat check is ambiguous when multiple sources of buffs / debuffs are stacked on top of each other, our only concern is returning the causes at a rate that is roughly proportional to their influence on the PC's final result. The actual value of the `random(min, max)` call in `Check.stat(min, max)` is irrelevant.
 */
const Cause = {
	/**
	 * Returns the modifier that caused the PC to pass / fail `Check.stat(min, max)`, or an empty object if a modifier was not the cause. The rate that each modifier is chosen is weighted according to its numerical effect on the PC's stats.
	 *
	 * If result === true, only positive modifiers will be returned.
	 *
	 * If result === false, only negative modifiers will be returned.
	 *
	 * If min and max do not form a valid range, throws an error and returns an empty object.
	 *
	 * @param {number} baseStat The stat's base value, with no modifiers applied.
	 * @param {Array<Modifier>} modifiers An array of the stat's relevant modifiers.
	 * @param {number} min The minimum value required to pass the stat check.
	 * @param {number} max The maximum value required to pass the stat check.
	 * @param {boolean} result Passed: true, Failed: false
	 * @returns {Modifier} The modifier that caused the stat check to pass or fail.
	 */
	getCause(baseStat, modifiers, min, max, result) {
		if (!validRange("Cause.getCause", min, max)) return false;

		if (isNaN(baseStat)) {
			Errors.report(`[Cause.getCause]: baseStat '${baseStat}' is not a number.`, {
				Stacktrace: Utils.GetStack(),
				baseStat,
			});
			return {};
		}

		const finalStat = PC.applyModifiers(baseStat, modifiers);

		if ((result && finalStat < min) || (!result && finalStat >= max)) {
			Errors.report(`[Cause.getCause]: A final stat of '${finalStat}' was calculated, which leads to an impossible result.`, {
				Stacktrace: Utils.GetStack(),
				finalStat,
				baseStat,
				modifiers,
				min,
				max,
				result,
			});
			return {};
		}

		let startValue;
		let baseWeight;
		let relevantMods;
		if (result) {
			// If the PC passed the skill check, find our base odds of passing with all negative modifiers applied.
			startValue = PC.applyModifiers(baseStat, PC.activeModifiers(modifiers, "negative"));
			baseWeight = Math.max(0, startValue - min + 1);

			// And only return modifiers with positive effects.
			relevantMods = PC.activeModifiers(modifiers, "positive");
		} else {
			// If the PC passed the skill check, find our base odds of failing with all positive modifiers applied.
			startValue = PC.applyModifiers(baseStat, PC.activeModifiers(modifiers, "positive"));
			baseWeight = Math.max(0, max - startValue);

			// And only return modifiers with negative effects.
			relevantMods = PC.activeModifiers(modifiers, "negative");
		}

		// Add the base odds to the pool of potential modifiers to return.
		const modPool = [[{}, baseWeight]];

		for (let i = 0; i < relevantMods.length; i++) {
			const modInfo = relevantMods[i];
			const modValue = PC.applyModifiers(startValue, [modInfo]);

			let modWeight;
			if (result) {
				// Weigh the modified value based on how much it increased the PC's chances of success.
				modWeight = Math.max(0, modValue - startValue);
			} else {
				// Weigh the modified value based on how much it increased the PC's chances of failure.
				modWeight = Math.max(0, startValue - modValue);
			}

			modPool.push([modInfo, modWeight]);
		}

		return weightedRandom(...modPool);
	},
};

const Norm = {

};

window.ModType = ModType;
window.Mods = Mods;
window.Base = Base;
window.PC = PC;
window.Check = Check;
window.Cause = Cause;
window.Norm = Norm;
