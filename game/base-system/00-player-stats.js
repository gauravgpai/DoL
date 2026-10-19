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

};

const Base = {

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

};

const Check = {

};

const Cause = {

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
