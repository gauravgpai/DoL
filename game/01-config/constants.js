const constants = {
	penisSize: {
		max: 6,
		min: 0,
	},
	tiredness: {
		max: 2000,
		min: 0,
	},
	weather: {
		fogParticles: {
			// Caps for fog particle counts after location band scaling. The area where fog can spawn is larger in some locations than others,
			// so the number of fog particles needs to be adjusted based on that, or else fog density will be inconsistent across different
			// locations, even when there is the same amount of Weather.fog.
			globalLocationCapMax: 40,
			globalLocationCapMin: 10,
		},
	},
	badEndTimeRules: {
		badEndsWithTimeObfuscation: ["Underground Farm", "Wolf Cave", "Underground Dungeon", "Mines"],
		hoursToLoseMinutes: 2,
		hoursToLoseTime: 8,
	},

	// Soft ends that pause Bailey's rent
	badEndsThatPauseRent: ["Prison", "Asylum", "Underground Farm", "Underground Dungeon"],

	beastSettingTypes: ["dog", "cat", "pig", "wolf", "dolphin", "lizard", "bear", "boar", "horse", "fox", "hawk", "cow", "spider", "snake"],

	namedBeasts: ["blackwolf", "greathawk", "nightmonster"],

	/**
	 * Magic numbers that appear in multiple functions will be stored as "C.stats.variable.name".
	 *
	 * Magic numbers that affect each other in complicated ways will be stored as "C.stats.variable.group.name".
	 *
	 * Magic numbers that appear in only 1 function will stay in the function.
	 */
	stats: {
		drunk: {
			/**
			 * How much allure the PC gains at the drunk limit. Can be amplified by other allure modifiers.
			 *
			 * The drunk allure math is handled in the "calculateallure" function.
			 */
			// allureBonus: 500,

			/**
			 * How much fatigue the PC gains at the drunk limit. This is also applied while the PC is sleeping.
			 *
			 * The hourly fatigue math is handled in the "minutePassed" function.
			 */
			// hourlyFatigue: 20,

			/**
			 * How much stress the PC gains at the drunk limit. This is also applied while the PC is sleeping.
			 *
			 * The hourly stress math is handled in the "minutePassed" function.
			 */
			// hourlyStress: -120,

			mod: {
				/**
				 * How much the player's sex stats will be increased, depending on their current sex stat and level of intoxication.
				 *
				 * The breakpoints for max drunk increasing each sex stat's tier are as follows:
				 *   Base Stat = 0 (Level 0)  ==> Final Stat = 30 (Level 2)
				 *   Base Stat = 7 (Level 2) ==> Final Stat = 35 (Level 3)
				 *   Base Stat = 32 (Level 3) ==> Final Stat = 55 (Level 4)
				 *   Base Stat = 57 (Level 4) ==> Final Stat = 75 (Level 5)
				 *   Base Stat = 82 (Level 5) ==> Final Stat = 95 (Level 6)
				 */
				maxSex: {
					minDrunk: 1,
					maxDrunk: 10,
				},
				minSex: {
					minDrunk: 1,
					maxDrunk: 30,
				},
			},

			/**
			 * How much the PC's stats decrease at the drunk limit.
			 *
			 * Affected stats:
			 * - Willpower
			 * - Athletics, Dancing, Housekeeping, Skulduggery, Swimming, Tending
			 * - Seduction, Oral, Chest, Hands, Buttocks, Anal, Vaginal, Feet, Thighs
			 * - English, History, Maths, Science
			 * - Sprays, Nets, Batons, Whips
			 */
			skillPenalty: 100,

			/**
			 * How much more stress the PC can tolerate at the drunk limit.
			 *
			 * The stress tolerance math is handled in the "stress" function.
			 */
			// stressTolerance: 3,
		},
	},

	// fames: {
	// 	// Negative Fame Constants
	// 	bestiality: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	exhibitionism: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	/**
	// 	 * Variable name: "impreg"
	// 	 */
	// 	impregnation: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	pimp: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	pregnancy: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	prostitution: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	rape: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	sex: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	//
	// 	// Positive Fame Constants
	// 	business: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	/**
	// 	 * Variable name: "scrap"
	// 	 */
	// 	combat: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	/**
	// 	 * Variable name: "good"
	// 	 */
	// 	kindness: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	model: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	// 	/**
	// 	 * Variable name: "social"
	// 	 */
	// 	socialite: {
	// 		max: 2000,
	// 		min: 0,
	// 	},
	//
	// 	// Crime Fame Constants
	// 	/**
	// 	 * Original values obtained from "game\03-JavaScript\alias2.js"
	// 	 */
	// 	crime: {
	// 		max: 10000,
	// 		min: 0,
	// 		/**
	// 		 * If the player commits too much of the same type of crime in one day, they leave behind more evidence.
	// 		 *
	// 		 * The dawnCheck() function in "game\03-JavaScript\time.js" will increase the player's crime by an additional
	// 		 * 10% if their daily crime stat is greater than "spree".
	// 		 */
	// 		spree: 1000,
	// 	},
	// },
};

/* Hoist Constants to the top (For statevars.js) */
// eslint-disable-next-line no-var
var Constants = ConstantsLoader.init(constants);
window.Constants = Constants;
