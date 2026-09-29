/*
 * Combat speech lines. A speaker is a named NPC ("Avery") or the player ("pc")
 * Each turn a speaker gathers the lines it could say into a pool.
 * One line is picked that the speaker has not said yet this combat.
 * What each speaker has said lives in $speechSaidLines as a hash and is unset by <<endevent>>.
 */

/* Sets up Sex/combat events to have different priorities. */
setup.speechEvent = {
	anusVirgin: () => V.speechAnusVirgin,
	kissVirgin: () => V.speechKissVirgin,
	NPCAnusVirgin: () => V.speechNPCAnusVirgin,
	NPCHandholdingVirgin: () => V.speechNPCHandholdingVirgin,
	NPCKissVirgin: () => V.speechNPCKissVirgin,
	NPCOralVirgin: () => V.speechNPCOralVirgin,
	NPCPenisVirgin: () => V.speechNPCPenisVirgin,
	NPCVaginaVirgin: () => V.speechNPCVaginaVirgin,
	oralVirgin: () => V.speechOralVirgin,
	penisVirgin: () => V.speechPenisVirgin,
	templeVirgin: () => V.speechTempleVirgin,
	vaginaVirgin: () => V.speechVaginaVirgin,

	fallenTransform: () => V.speechFallenTransform,

	/* Crossdress/Herm reveals are set to 2 and move to 1 with <<endevent>>. The line lands the turn after the reveal. */
	crossdressAngry: () => V.speechCrossdressAngry === 1,
	crossdressAroused: () => V.speechCrossdressAroused === 1,
	crossdressDisappointed: () => V.speechCrossdressDisappointed === 1,
	crossdressShock: () => V.speechCrossdressShock === 1,
	hermAngry: () => V.speechHermAngry === 1,
	hermAroused: () => V.speechHermAroused === 1,
	hermDisappointed: () => V.speechHermDisappointed === 1,
	hermShock: () => V.speechHermShock === 1,

	pairedReply: speaker => hasPairedSpeechLine(speaker),

	exposeBreasts: () => V.speechExposeBreasts,
	exposeGenitals: () => V.speechExposeGenitals,
	LINameDrop: () => V.speechLINameDrop,
	noticeSexToy: () => V.speechNoticeSexToy,
	penisBig: () => V.speechPenisBig,
	penisSmall: () => V.speechPenisSmall,
	pregnant: () => V.speechPregnant,

	apologise: () => V.speechApologise,
	apologiseAgain: () => V.speechApologiseAgain,
	apologiseUnforgiving: () => V.speechApologiseUnforgiving,
	askRough: () => V.speechAskRough,
	chokedWheeze: () => V.speechChokedWheeze,
	chokedAlready: () => V.speechChokedAlready,
	chokedMoan: () => V.speechChokedMoan,
	demand: () => V.speechDemand,
	forgive: () => V.speechForgive,
	growl: () => V.speechGrowl,
	growlHeat: () => V.speechGrowlHeat,
	growlRut: () => V.speechGrowlRut,
	lactate: () => V.speechLactate,
	masturbate: () => V.speechMasturbate,
	moan: () => V.speechMoan,
	pepperSpray: () => V.speechPepperSpray,
	playerOrgasm: () => V.speechPlayerOrgasm,
	plead: () => V.speechPlead,
	screamForHelp: () => V.speechScreamForHelp,
	vaginaFlaunt: () => V.speechVaginaFlaunt,

	anusEscape: () => V.speechAnusEscape,
	coverFace: () => V.speechCoverFace,
	coverPenis: () => V.speechCoverPenis,
	coverVagina: () => V.speechCoverVagina,
	penisEscape: () => V.speechPenisEscape,
	playerBeaten: () => V.speechPlayerBeaten,
	playerHits: () => V.speechPlayerHits,
	spank: () => V.speechSpank,
	steal: () => V.speechSteal,
	stripStruggle: () => V.speechStripStruggle,
	struggle: () => V.speechStruggle,
	vaginaEscape: () => V.speechVaginaEscape,

	/* Ongoing acts */
	analKiss: () => V.speechAnalKiss,
	analLick: () => V.speechAnalLick,
	anus: () => V.speechAnus,
	anusEntrance: () => V.speechAnusEntrance,
	anusImminent: () => V.speechAnusImminent,
	anusPenetrated: () => V.speechAnusPenetrated,
	anusWithhold: () => V.speechAnusWithhold,
	arms: () => V.speechArms,
	bottom: () => V.speechBottom,
	breastRub: () => V.speechBreastRub,
	chastity: () => V.speechChastity,
	cheeks: () => V.speechCheeks,
	chestRub: () => V.speechChestRub,
	clit: () => V.speechClit,
	dildoAnus: () => V.speechDildoAnus,
	dildoVagina: () => V.speechDildoVagina,
	faceSit: () => V.speechFaceSit,
	feet: () => V.speechFeet,
	fencingEntrance: () => V.speechFencingEntrance,
	futaPenis: () => V.speechFutaPenis,
	glans: () => V.speechGlans,
	hair: () => V.speechHair,
	handjobPenis: () => V.speechHandjobPenis,
	handjobVagina: () => V.speechHandjobVagina,
	headBreasts: () => V.speechHeadBreasts,
	headChest: () => V.speechHeadChest,
	headNipple: () => V.speechHeadNipple,
	headNippleClosed: () => V.speechHeadNippleClosed,
	headSuckle: () => V.speechHeadSuckle,
	legLock: () => V.speechLegLock,
	mouthEntrance: () => V.speechMouthEntrance,
	mouthImminent: () => V.speechMouthImminent,
	mouthOtherAnus: () => V.speechMouthOtherAnus,
	mouthPenetrated: () => V.speechMouthPenetrated,
	NPCChastity: () => V.speechNPCChastity,
	otherAnusEntrance: () => V.speechOtherAnusEntrance,
	otherAnusImminent: () => V.speechOtherAnusImminent,
	otherAnusPenetrated: () => V.speechOtherAnusPenetrated,
	otherAnusWithhold: () => V.speechOtherAnusWithhold,
	penis: () => V.speechPenis,
	penisEntrance: () => V.speechPenisEntrance,
	penisFoot: () => V.speechPenisFoot,
	penisImminent: () => V.speechPenisImminent,
	penisPenetrated: () => V.speechPenisPenetrated,
	penisPenis: () => V.speechPenisPenis,
	penisWithhold: () => V.speechPenisWithhold,
	stroker: () => V.speechStroker,
	thigh: () => V.speechThigh,
	throat: () => V.speechThroat,
	tribEntrance: () => V.speechTribEntrance,
	vagina: () => V.speechVagina,
	vaginaEntrance: () => V.speechVaginaEntrance,
	vaginaFoot: () => V.speechVaginaFoot,
	vaginaImminent: () => V.speechVaginaImminent,
	vaginaMouth: () => V.speechVaginaMouth,
	vaginaPenetrated: () => V.speechVaginaPenetrated,
	vaginaVagina: () => V.speechVaginaVagina,
	vaginaWithhold: () => V.speechVaginaWithhold,
};

/* <<speechSay>> picks from the event lines with the highest priority.
<<addEventSpeechLine>> adds event lines.
<<addSpeechLine>> adds non-event lines.

Table sets priority for all events as well as a cooldown for ongoing events so that these lines repeat less. */

setup.speechPriority = Object.fromEntries(
	[
		/* A virginity being taken is always highest priority. */
		[
			100,
			0,
			[
				"anusVirgin",
				"kissVirgin",
				"oralVirgin",
				"penisVirgin",
				"templeVirgin",
				"vaginaVirgin",
				"NPCAnusVirgin",
				"NPCHandholdingVirgin",
				"NPCKissVirgin",
				"NPCOralVirgin",
				"NPCPenisVirgin",
				"NPCVaginaVirgin",
			],
		],

		/* Fallen Angel transformation plays below virginity. NNPC Virginity lines should account for it. */
		[95, 0, ["fallenTransform"]],

		/* Herm/Crossdressing reveal have high priority because they only happen once and then the NNPC should remember. */
		[
			90,
			0,
			["crossdressAngry", "crossdressAroused", "crossdressDisappointed", "crossdressShock", "hermAngry", "hermAroused", "hermDisappointed", "hermShock"],
		],

		/* A reply to PC's moans/demands/etc. */
		[85, 0, ["pairedReply"]],

		/* These events only happen once per combat, so these lines have higher priority. */
		[80, 0, ["exposeBreasts", "exposeGenitals", "LINameDrop", "penisBig", "penisSmall", "pregnant", "noticeSexToy"]],

		/* NNPC reacting to PC's speech and noise choices have medium-high priority. */
		[
			70,
			0,
			[
				"apologise",
				"apologiseAgain",
				"apologiseUnforgiving",
				"askRough",
				"playerOrgasm",
				"demand",
				"forgive",
				"growl",
				"growlHeat",
				"growlRut",
				"lactate",
				"moan",
				"plead",
				"screamForHelp",
				"pepperSpray",
				"chokedWheeze",
				"chokedAlready",
				"chokedMoan",
				"masturbate",
				"vaginaFlaunt",
			],
		],

		/* PC's actions that are medium priority. */
		[
			60,
			0,
			[
				"anusEscape",
				"playerBeaten",
				"coverFace",
				"coverPenis",
				"coverVagina",
				"playerHits",
				"penisEscape",
				"spank",
				"steal",
				"stripStruggle",
				"struggle",
				"vaginaEscape",
			],
		],

		/* Ongoing acts have a 3 turn cooldown between lines. */
		[
			10,
			3,
			[
				"analKiss",
				"analLick",
				"anus",
				"anusEntrance",
				"anusImminent",
				"anusPenetrated",
				"anusWithhold",
				"arms",
				"bottom",
				"breastRub",
				"chastity",
				"cheeks",
				"chestRub",
				"clit",
				"dildoAnus",
				"dildoVagina",
				"faceSit",
				"feet",
				"fencingEntrance",
				"futaPenis",
				"glans",
				"hair",
				"handjobPenis",
				"handjobVagina",
				"headBreasts",
				"headChest",
				"headNipple",
				"headNippleClosed",
				"headSuckle",
				"legLock",
				"mouthEntrance",
				"mouthImminent",
				"mouthOtherAnus",
				"mouthPenetrated",
				"NPCChastity",
				"otherAnusEntrance",
				"otherAnusImminent",
				"otherAnusPenetrated",
				"otherAnusWithhold",
				"penis",
				"penisEntrance",
				"penisFoot",
				"penisImminent",
				"penisPenetrated",
				"penisPenis",
				"penisWithhold",
				"stroker",
				"thigh",
				"throat",
				"tribEntrance",
				"vagina",
				"vaginaEntrance",
				"vaginaFoot",
				"vaginaImminent",
				"vaginaMouth",
				"vaginaPenetrated",
				"vaginaVagina",
				"vaginaWithhold",
			],
		],

		/* <<addSpeechLine>> lines */
		[10, 0, ["nonEvent"]],
	].flatMap(([priority, cooldown, events]) => events.map(event => [event, { priority, cooldown }]))
);

function getSpeechLineHash(text) {
	let hash = 5381;
	for (let i = 0; i < text.length; i++) hash = (Math.imul(hash, 33) ^ text.charCodeAt(i)) >>> 0;
	return hash.toString(36);
}

/**
 * Adds a line with no event that the speaker can say on any turn and gives it a hash ID.
 *
 * @param {string} content the line
 * @param {number} weight
 * @param {SpeechReply} [reply] NNPC's reply, said later in the turn by <<sayPairedSpeechLine>>.
 * @returns {SpeechLine}
 */
function createNonEventSpeechLine(content, weight, reply) {
	const line = { content, weight, priority: setup.speechPriority.nonEvent.priority, event: "", hash: getSpeechLineHash(content) };
	if (reply) line.reply = reply;
	return line;
}

/**
 * Adds a line with an event and gives it a hash ID. Event lines have priority. Ongoing event lines have cooldowns.
 *
 * @param {string} content the line
 * @param {number} weight
 * @param {string[]} declaredEvents events the line is offered for
 * @param {string[]} firedEvents the declared events that fired this turn
 * @returns {SpeechLine}
 */
function createEventSpeechLine(content, weight, declaredEvents, firedEvents) {
	return {
		content,
		weight,
		priority: Math.max(...firedEvents.map(getSpeechEventPriority)),
		event: [...declaredEvents].sort().join(" "),
		hash: getSpeechLineHash(declaredEvents.includes("pairedReply") ? T.pairedSpeechLine.content : content),
	};
}

function getSpeechEventPriority(event) {
	return setup.speechPriority[event].priority;
}

/**
 * How many turns the speaker skips this event after just speaking about it. 0 for events with no cooldowns.
 *
 * @param {string} event
 * @returns {number}
 */
function getSpeechEventCooldown(event) {
	return setup.speechPriority[event].cooldown;
}

function hasSpeechEventFired(event, speaker) {
	return !!setup.speechEvent[event](speaker);
}

/**
 * The lines that outrank the rest of the pool. Everything below them is not said this turn.
 *
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine[]}
 */
function getHighestPrioritySpeechLines(lines) {
	const highestPriority = lines.reduce((highest, line) => Math.max(highest, line.priority), 0);
	return lines.filter(line => line.priority === highestPriority);
}

/**
 * Drops the events the speaker has no new lines for this combat. This way, a lower priority one can play.
 * Repeats the event pool only if there's nothing else to say.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine[]}
 */
function getSpeechLinesWithSomethingNew(speaker, lines) {
	const somethingNew = groupSpeechLinesByEvent(lines)
		.filter(eventLines => getUnsaidSpeechLines(speaker, eventLines.lines).length > 0)
		.flatMap(eventLines => eventLines.lines);
	return somethingNew.length > 0 ? somethingNew : lines;
}

/**
 * Groups lines by the event they answer.
 *
 * @param {SpeechLine[]} lines
 * @returns {SpeechEventLines[]}
 */
function groupSpeechLinesByEvent(lines) {
	/** @type {Map<string, SpeechLine[]>} */
	const groups = new Map();
	for (const line of lines) {
		if (!groups.has(line.event)) groups.set(line.event, []);
		groups.get(line.event).push(line);
	}
	return Array.from(groups.entries(), ([event, eventLines]) => ({ event, lines: eventLines }));
}

/**
 * The hashes the speaker has said this combat, creating the record if this is the first line.
 *
 * @param {SpeechSpeaker} speaker
 */
function getSaidSpeechHashes(speaker) {
	if (!V.speechSaidLines) V.speechSaidLines = {};
	if (!V.speechSaidLines[speaker]) V.speechSaidLines[speaker] = [];
	return V.speechSaidLines[speaker];
}

function getUnsaidSpeechLines(speaker, lines) {
	const saidHashes = getSaidSpeechHashes(speaker);
	return lines.filter(line => !saidHashes.includes(line.hash));
}

/**
 * Removes lines from the speaker's history so they can be said again.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 */
function forgetSpeechLines(speaker, lines) {
	const hashes = lines.map(line => line.hash);
	V.speechSaidLines[speaker] = getSaidSpeechHashes(speaker).filter(hash => !hashes.includes(hash));
}

/**
 * Clears these lines from the speaker's history so they can be said again.
 * Only exception is he line just said, so it doesn't repeat.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine[]}
 */
function refreshSaidSpeechLines(speaker, lines) {
	const saidHashes = getSaidSpeechHashes(speaker);
	const lastSaidHash = saidHashes[saidHashes.length - 1];
	forgetSpeechLines(speaker, lines);
	const sayableAgain = lines.filter(line => line.hash !== lastSaidHash);
	return sayableAgain.length > 0 ? sayableAgain : lines;
}

/**
 * Picks a line the speaker has not said this combat and records it as said, before it is printed.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine}
 */
function pickAndRecordSpeechLine(speaker, lines) {
	const unsaidLines = getUnsaidSpeechLines(speaker, lines);
	const line = rollWeightedRandomFromArray(unsaidLines.length > 0 ? unsaidLines : refreshSaidSpeechLines(speaker, lines));
	getSaidSpeechHashes(speaker).push(line.hash);
	return line;
}

function hasSpeechLines() {
	return T.speechPool.lines.length > 0;
}

/**
 * How many turns are left before the speaker will talk about each event again, keyed by event and
 * created on the speaker's first line.
 *
 * @param {SpeechSpeaker} speaker
 */
function getSpeechCooldowns(speaker) {
	if (!V.speechCooldowns) V.speechCooldowns = {};
	if (!V.speechCooldowns[speaker]) V.speechCooldowns[speaker] = {};
	return V.speechCooldowns[speaker];
}

/**
 * Counts down the events on currently on cooldown.
 *
 * @param {SpeechSpeaker} speaker
 * @returns {Set<string>}
 */
function takeCoolingSpeechEvents(speaker) {
	const cooldowns = getSpeechCooldowns(speaker);
	const cooling = new Set();
	for (const [event, turnsLeft] of Object.entries(cooldowns)) {
		if (turnsLeft <= 0) continue;
		cooling.add(event);
		cooldowns[event] = turnsLeft - 1;
	}
	return cooling;
}

/**
 * Starts the cooldown of a line's events after a line fires.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine} line
 */
function startSpeechEventCooldowns(speaker, line) {
	if (!line.event) return;
	const cooldowns = getSpeechCooldowns(speaker);
	for (const event of line.event.split(" ")) {
		const cooldown = getSpeechEventCooldown(event);
		if (cooldown > 0) cooldowns[event] = cooldown;
	}
}

/** @returns {boolean} Whether the pool holds nothing but non-event lines. */
function speechPoolHasNoEventLines() {
	return T.speechPool.lines.every(line => !line.event);
}

Macro.add("speechPool", {
	handler() {
		T.speechPool = { speaker: this.args[0], lines: [], cooling: takeCoolingSpeechEvents(this.args[0]) };
	},
});

/**
 * Reads a line macro's arguments. Strings are event names. A number is the weight of the line. If not provided, the weight defaults to 1.
 *
 * @param {(string|number)[]} args
 * @returns {{ events: string[], weight: number }}
 */
function readSpeechLineArgs(args) {
	const last = args[args.length - 1];
	if (typeof last === "number") return { events: args.slice(0, -1), weight: last };
	return { events: args, weight: 1 };
}

/**
 * Returns the text of each line the macro adds: a line, or one per <<speechLine>>.
 *
 * @param {object[]} payload the macro's payload
 * @returns {string[]}
 */
function getSpeechLineContents(payload) {
	const [shared, ...pieces] = payload;
	if (pieces.length === 0) return [shared.contents];
	return pieces.map(piece => shared.contents + piece.contents);
}

Macro.add("addSpeechLine", {
	tags: ["speechLine"],
	handler() {
		const { weight } = readSpeechLineArgs(this.args);
		for (const contents of getSpeechLineContents(this.payload)) {
			T.speechPool.lines.push(createNonEventSpeechLine(contents, weight));
		}
	},
});

/* Adds a line to the pool only if one of its events happened this turn and is not cooling down. */
Macro.add("addEventSpeechLine", {
	tags: ["speechLine"],
	handler() {
		const { events, weight } = readSpeechLineArgs(this.args);
		if (events.length === 0) return this.error("needs the name of the event the line answers");
		const firedEvents = events.filter(event => !T.speechPool.cooling.has(event) && hasSpeechEventFired(event, T.speechPool.speaker));
		if (firedEvents.length === 0) return;
		for (const contents of getSpeechLineContents(this.payload)) {
			T.speechPool.lines.push(createEventSpeechLine(contents, weight, events, firedEvents));
		}
	},
});

/* Adds a PC line together with the named NPC's reply. Only that NPC's <<sayPairedSpeechLine>> says the reply, later in the turn:
	<<addPairedSpeechLine "Whitney">>
	<<pcLine>>
	the PC's line
	<<npcLine>>
	Whitney's reply
	<</addPairedSpeechLine>> */
Macro.add("addPairedSpeechLine", {
	tags: ["pcLine", "npcLine"],
	handler() {
		const [before, pcLine, npcLine] = this.payload;
		if (!setup.NPCNameList.includes(this.args[0])) return this.error(`needs the name of the NPC who replies, got "${this.args[0]}"`);
		if (before.contents.trim()) return this.error("put PC's line inside <<pcLine>>");
		T.speechPool.lines.push(createNonEventSpeechLine(pcLine.contents, 1, { speaker: this.args[0], content: npcLine.contents }));
	},
});

/**
 * Chooses the line the speaker says this turn:
 * 1. Drop events whose lines have all been said
 * 2. Keep only the highest priority lines
 * 3. Pick one event at random
 * 4. Pick one of that event's lines by weight, skipping lines already said
 *
 * Then starts that event's cooldown and stores any paired reply.
 *
 * @returns {string} the line, or "" when the pool is empty
 */
function takeSpeechLine() {
	if (!hasSpeechLines()) return "";
	const { speaker, lines } = T.speechPool;
	const eventLines = groupSpeechLinesByEvent(getHighestPrioritySpeechLines(getSpeechLinesWithSomethingNew(speaker, lines))).random();
	const line = pickAndRecordSpeechLine(speaker, eventLines.lines);
	startSpeechEventCooldowns(speaker, line);
	if (line.reply) T.pairedSpeechLine = line.reply;
	return line.content;
}

Macro.add("speechSay", {
	handler() {
		$(this.output).wiki(takeSpeechLine());
	},
});

/* Says a line from the pool, or "passes" (sets _noNameComment) so the NPC can use their mouth or make a
generic comment instead.
It psasses when the pool is empty, or 40% of the time when the pool has no
event lines.
Use <<speechSay>> for a speaker who should never pass or use mouth actions. For example, Bailey. */
Macro.add("speechSayOrPass", {
	handler() {
		$.wiki("<<rng>>");
		if (!hasSpeechLines() || (speechPoolHasNoEventLines() && V.rng <= 40)) {
			T.noNameComment = true;
			return;
		}
		$(this.output).wiki(takeSpeechLine());
	},
});

Macro.add("sayPairedSpeechLine", {
	handler() {
		$(this.output).wiki(T.pairedSpeechLine.content);
	},
});

/**
 * @param {SpeechSpeaker} speaker
 * @returns {boolean} Whether the PC line said this turn is waiting for this NNPC speaker's reply.
 */
function hasPairedSpeechLine(speaker) {
	return T.pairedSpeechLine !== undefined && T.pairedSpeechLine.speaker === speaker;
}

window.hasSpeechLines = hasSpeechLines;
