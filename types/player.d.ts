declare module "twine-sugarcube" {
	export interface SugarCubeStoryVariables {
		player: Player;

		transformationParts: {
			angel: AngelTransformationParts;
			bird: BirdTransformationParts;
			cat: CatTransformationParts;
			cow: CowTransformationParts;
			demon: DemonTransformationParts;
			fallenAngel: DemonTransformationParts;
			fox: FoxTransformationParts;
			wolf: WolfTransformationParts;
			traits: {
				fangs: string;
				flaunting: string;
				mateForLife: string;
				sharpEyes: string;
			};
		};

		// PC Stat Maximums

		// Character State Maximums
		arousalmax: number;
		controlmax: number;
		druggedmax: number;
		drunkmax: number;
		tirednessmax: number;
		hallucinogenmax: number;
		painmax: number;
		stressmax: number;
		traumamax: number;

		// Core Characteristic Maximums
		awarenessmax: number;
		awarenessmin: number;
		beautymax: number;
		deviancymax: number;
		exhibitionismmax: number;
		physiquemax: number;
		promiscuitymax: number;
		puritymax: number;
		willpowermax: number;

		// Physique Body Size Maximum
		physiquesize: number;

		// Core Skill Maximums
		athleticsmax: number;
		danceskillmax: number;
		housekeepingmax: number;
		skulduggerymax: number;
		swimmingskillmax: number;
		tendingmax: number;

		// School Skill Maximums
		englishmax: number;
		historymax: number;
		mathsmax: number;
		sciencemax: number;

		// Sex Skill Maximums
		analskillmax: number;
		bottomskillmax: number;
		chestskillmax: number;
		feetskillmax: number;
		handskillmax: number;
		oralskillmax: number;
		penileskillmax: number;
		seductionskillmax: number;
		thighskillmax: number;
		vaginalskillmax: number;

		// Weapon Skill Maximums
		batonskillmax: number;
		netskillmax: number;
		sprayskillmax: number;
		whipskillmax: number;
		pickaxeskillmax: number;

		// Character State Stats
		arousal: number;
		control: number;
		drugged: number;
		drunk: number;
		tiredness: number;
		hallucinogen: number;
		pain: number;
		stress: number;
		trauma: number;

		// Core Characteristic Stats
		awareness: number;
		beauty: number;
		deviancy: number;
		exhibitionism: number;
		physique: number;
		promiscuity: number;
		purity: number;
		willpower: number;

		// Core Skill Stats
		athletics: number;
		danceskill: number;
		housekeeping: number;
		skulduggery: number;
		swimmingskill: number;
		tending: number;

		// School Skill Stats
		english: number;
		history: number;
		maths: number;
		science: number;
		
		// Sex Skill Stats
		analskill: number;
		bottomskill: number;
		chestskill: number;
		feetskill: number;
		handskill: number;
		oralskill: number;
		penileskill: number;
		seductionskill: number;
		thighskill: number;
		vaginalskill: number;

		// // Weapon Skill Stats (Currently stored in the "V.prof" object)
		// batonskill: number;
		// netskill: number;
		// sprayskill: number;
		// whipskill: number;
		// pickaxeskill: number;

		oxygen: number;
		oxygenmax: number;

		willpowerpain?: 0;
		submissive: number;
		delinquency: number;
		detention: number;
		cool: number;
		coolmax: number;
		masochism: number;
		suspicion: number;
		shame: number;

		innocencestate: 0 | 1;
		innocencetrauma: number;

		controlstart: number;

		vaginaWetness: number;
		vaginaArousalWetness: number;
		arousalmasochism: number;
		trackedArousal: int[];
		timeSinceArousal: number;

		/**
		 * Only used within settings, try to use leftEyeColour or rightEyeColour.
		 */
		eyeselect: string;
		leftEyeColour: string;
		rightEyeColour: string;
		naturalhaircolour: string;
		haircolour: string;
		hairfringecolour: string;
		hairlengthstage: string;
		fringelengthstage: string;
		hairtype: string;
		fringetype: string;
		hairColourStyle: "simple" | "gradient";
		hairFringeColourStyle: "simple" | "gradient";
		hairColourGradient: Gradient;
		hairFringeColourGradient: Gradient;

		/**
		 * Wtf is this
		 */
		masturbation_bowl: string;

		/* Vore stuff */
		vorestage: number;

		/* Player states */

		lactating: 0 | 1;
		possessed?: boolean;
		virginityProtected: boolean;

		anxiety: 0 | 1 | 2;
		nightmares: 0 | 1;
		sleeptrouble: 0 | 1;
		flashbacks: 0 | 1;
		hallucinations: 0 | 1 | 2;
		panicattacks: 0 | 1 | 2;
		dissociation: 0 | 1 | 2;
		controlled: 0 | 1;

		/* Institution modifiers - Only vaguely related to player (grace), others can be moved to game.d.ts? */

		orphan_hope: number;
		orphan_reb: number;

		locker_suspicion: number;

		grace: number;
		temple_rank: "prospective" | "initiate" | "monk" | "priest" | "bishop";

		livestock_obey: number;
		farm_yield: number;

		asylumstatus: number;

		wolfpacktrust: number;
		wolfpackfear: number;
		wolfpackferocity: number;
		wolfpackharmony: number;

		/* Player weapons */

		spray: number;
		spraymax: number;
		infinitespray: boolean;

		/* Other things */

		orgasmtrait: number;
		choketrait: number;
		rapetrait: number;
		bestialitytrait: number;
		tentacletrait: number;

		/* Personal school traits */

		mathstrait: number;
		sciencetrait: number;
		englishtrait: number;
		historytrait: number;

		backgroundTraits: string[];

		/* Volumes, lactation and similar things */

		semen_volume: number;
		semen_amount: number;
		semen_max: number;

		milk_volume: number;
		milk_amount: number;
		milk_max: number;

		milkFullPain: number;
		milkFullPainMessage: 0 | 1;
		lactation_pressure: number;

		body_temperature: "cold" | "chilly" | "comfy" | "hot" | "warm";

		/* Player sensitivities */

		mouthsensitivity: number;
		breastsensitivity: number;
		bottomsensitivity: number;
		genitalsensitivity: number;

		/* Transformations */

		cow: number;

		/* Gay ear slime stuff */

		earSlime: EarSlimeState;

		wraith: {
			state: string;
		};

		parasite: {
			nipples: any;
			bottom: any;
			breasts: any;
			penis: ParasiteState;
			clit: ParasiteState;
			parasite: ParasiteState;
			tummy: ParasiteState;
			left_ear: ParasiteState;
			right_ear: ParasiteState;
			left_thigh: ParasiteState;
			right_thigh: ParasiteState;
			left_arm: ParasiteState;
			right_arm: ParasiteState;
		};

		skin: Record<SkinPositions, Bodywriting>;

		makeup: {
			eyelenses: {
				left: string;
				right: string;
			};
			pbcolour: string;
			lipstick: string;
			blusher: string;
			mascara: string;
			concealer: string;
			eyeshadow: string;
		};
	}
}

declare global {
	export type TransformationKeys = "angel" | "bird" | "cat" | "cow" | "demon" | "fallenAngel" | "fox" | "wolf";

	export type SkinPositions =
		| "forehead"
		| "left_cheek"
		| "right_cheek"
		| "left_shoulder"
		| "right_shoulder"
		| "breasts"
		| "back"
		| "left_bottom"
		| "right_bottom"
		| "pubic"
		| "left_thigh"
		| "right_thigh";

	export type TransformationParts =
		| "halo"
		| "wings"
		| "eyes"
		| "malar"
		| "plumage"
		| "pubes"
		| "tail"
		| "heterochromia"
		| "horns"
		| "wings_colour"
		| "cheeks"
		| "ears"
		| "pits";

	export interface AngelTransformationParts {
		halo: string;
		wings: string;
	}

	export interface BirdTransformationParts {
		eyes: string;
		malar: string;
		plumage: string;
		pubes: string;
		tail: string;
		wings: string;
	}

	export interface CatTransformationParts {
		eyes: string;
		heterochromia: string;
		tail: string;
	}

	export interface CowTransformationParts {
		eyes: string;
		horns: string;
		tail: string;
	}

	export interface DemonTransformationParts {
		horns: string;
		tail: string;
		wings: string;
		wings_colour: string;
	}

	export interface FallenAngelTransformationParts {
		horns: string;
		wings: string;
	}

	export interface FoxTransformationParts {
		cheeks: string;
		ears: string;
		tail: string;
	}

	export interface WolfTransformationParts {
		cheeks: string;
		ears: string;
		pits: string;
		pubes: string;
		tail: string;
	}

	export interface Player {
		gender_appearance: string;
		ballsExist: any;
		breastsize: number;
		perceived_breastsize: number;
		penisExist: boolean;
		vaginaExist: boolean;
		penissize: number;
		penis: string;
		vagina: string;
		condom: Condom | false;

		gender: "m" | "f" | "n";
		sex: "m" | "f" | "h";

		virginity: {
			penile: "string" | boolean;
			vaginal: boolean;
			anal: boolean;
			temple: boolean;
			handholding: boolean;
			kiss: boolean;
		};

		skin: {
			color: SkinColours;
			faceFreckles: boolean;
			bodyFreckles: "none" | "upper" | "full";
		};
	}

	export interface Bodywriting {
		arrow: 0 | 1;
		degree: 0 | 1;
		gender: "m" | "f" | "n";
		index: number;
		lewd: 0 | 1;
		pen: string;
		special: "none" | "islander";
		type: "text" | "object";
		writing: string;
	}

	export interface EarSlimeState {
		focus: string;
		vibration: any;
		event: any;
		lastVibration: any;
		days: any;
		eventTimer: number;
		forcedDressing: boolean;
		forcedCommando: boolean;
		corruption: number;
		growth: number;
		startedThreats: boolean;
		defyCooldown: boolean;
	}

	export interface ParasiteState {
		name: "parasite";
	}

	export interface BodyLiquid {
		bodyparts: string[];
		innerbodyparts: string[];
		liquidtype: string[];
		combined: (bodypart: string) => number;
	}
}

export {};
