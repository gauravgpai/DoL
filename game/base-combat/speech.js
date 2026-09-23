/*
 * Combat speech lines. A speaker is a named NPC ("Avery") or the player ("pc")
 * Each turn a speaker gathers the lines it could say into a pool.
 * One line is picked that the speaker has not said yet this combat.
 * What each speaker has said lives in $speechSaidLines as a hash and is unset by <<endevent>>.
 */

/**
 * Hashes a line's text.
 *
 * @param {string} text
 * @returns {string}
 */
function getSpeechLineHash(text) {
	let hash = 5381;
	for (let i = 0; i < text.length; i++) hash = (Math.imul(hash, 33) ^ text.charCodeAt(i)) >>> 0;
	return hash.toString(36);
}

/**
 * Checks that the speaker is a named NPC or the player, catching typos.
 *
 * @param {string} speaker
 * @returns {boolean}
 */
function isSpeechSpeaker(speaker) {
	return speaker === "pc" || setup.NPCNameList.includes(speaker);
}

/**
 * Builds a line for the pool and gives it a hash ID.
 *
 * @param {string} content the line
 * @param {number} weight
 * @param {number} priority how much the line should be prioritized (100 being highest priority), found in setup.speechPriority
 * @param {string} [group] the line's group
 * @param {string} [reply] NNPC's reply, said later in the turn by <<sayPairedSpeechLine>>.
 * @returns {SpeechLine}
 */
function createSpeechLine(content, weight, priority, group, reply) {
	const line = { content, weight, priority, hash: getSpeechLineHash(content) };
	if (group) line.group = group;
	if (reply) line.reply = reply;
	return line;
}

/**
 * How much a speech line outranks the others in the pool.
 *
 * @param {string} event
 * @returns {number}
 */
function getSpeechEventPriority(event) {
	return setup.speechPriority[event];
}

/**
 * Whether combat/sex flagged the event this turn.
 *
 * @param {string} event
 * @returns {boolean}
 */
function hasSpeechEventFired(event) {
	return !!setup.speechEvent[event]();
}

/**
 * Checks that the event is one setup.speechEvent lists, catching typos.
 *
 * @param {string} event
 * @returns {boolean}
 */
function isSpeechEvent(event) {
	return Object.hasOwn(setup.speechEvent, event);
}

/**
 * The lines that outrank the rest of the pool. Everything below them is not said this turn.
 *
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine[]}
 */
function getTopSpeechLines(lines) {
	const top = lines.reduce((highest, line) => Math.max(highest, line.priority), 0);
	return lines.filter(line => line.priority === top);
}

/**
 * Groups lines by the event they answer.
 *
 * @param {SpeechLine[]} lines
 * @returns {{ group: string, lines: SpeechLine[] }[]}
 */
function groupSpeechLinesByEvent(lines) {
	/** @type {Map<string, SpeechLine[]>} */
	const groups = new Map();
	for (const line of lines) {
		const group = line.group ?? "";
		if (!groups.has(group)) groups.set(group, []);
		groups.get(group).push(line);
	}
	return Array.from(groups.entries(), ([group, groupLines]) => ({ group, lines: groupLines }));
}

/**
 * Returns the hashes of the lines the speaker has said this combat.
 *
 * @param {SpeechSpeaker} speaker
 * @returns {string[]}
 */
function getSpeechHistory(speaker) {
	if (!V.speechSaidLines) V.speechSaidLines = {};
	if (!V.speechSaidLines[speaker]) V.speechSaidLines[speaker] = [];
	return V.speechSaidLines[speaker];
}

/**
 * Filters out the lines the speaker has already said this combat.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine[]}
 */
function getUnsaidSpeechLines(speaker, lines) {
	const said = getSpeechHistory(speaker);
	return lines.filter(line => !said.includes(line.hash));
}

/**
 * Removes lines from the speaker's history so they can be said again.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 */
function forgetSpeechLines(speaker, lines) {
	const hashes = lines.map(line => line.hash);
	V.speechSaidLines[speaker] = getSpeechHistory(speaker).filter(hash => !hashes.includes(hash));
}

/**
 * Picks a random line the speaker hasn't said yet and marks it as said.
 * Once every line has been said, the history for these lines is reset so the speaker doesn't run dry.
 * The last line said is excluded from the reset so it can't play twice in a row.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine}
 */
function pickSpeechLineFrom(speaker, lines) {
	let fresh = getUnsaidSpeechLines(speaker, lines);
	if (fresh.length === 0) {
		const said = getSpeechHistory(speaker);
		const lastSaid = said[said.length - 1];
		forgetSpeechLines(speaker, lines);
		fresh = lines.length > 1 ? lines.filter(line => line.hash !== lastSaid) : lines;
	}
	if (fresh.length === 0) fresh = lines;
	const picked = rollWeightedRandomFromArray(fresh);
	getSpeechHistory(speaker).push(picked.hash);
	return picked;
}

/**
 * Same as pickSpeechLineFrom, but for plain strings. Use instead of either() so lines don't repeat.
 *
 * @param {SpeechSpeaker} speaker
 * @param {...string} texts
 * @returns {string}
 */
function pickSpeechLine(speaker, ...texts) {
	if (!isSpeechSpeaker(speaker)) throw new Error(`pickSpeechLine: "${speaker}" is not a named NPC or "pc"`);
	return pickSpeechLineFrom(
		speaker,
		texts.map(text => createSpeechLine(text, 1, setup.speechPriority.ongoing))
	).content;
}

/**
 * Picks the line to say out of a shared group.
 *
 * @param {SpeechSpeaker} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine}
 */
function pickGroupedSpeechLine(speaker, lines) {
	const group = rollWeightedRandomFromArray(groupSpeechLinesByEvent(getTopSpeechLines(lines)));
	return pickSpeechLineFrom(speaker, group.lines);
}

/* The speech pool. Lines are added with <<addSpeechLine>> and one is played with <<speechSay>>. */

/**
 * Starts an empty pool for the speaker. Replaces whatever pool was there before.
 *
 * @param {SpeechSpeaker} speaker
 */
function startSpeechPool(speaker) {
	T.speechPool = { speaker, lines: [] };
}

/**
 * Checks if the pool has any lines in it.
 *
 * @returns {boolean}
 */
function hasSpeechLines() {
	return T.speechPool?.lines.length > 0;
}

/**
 * Drops the groups the speaker has already used up and resets their history, so the turn
 * falls through to a lower priority line, an ambient line, or a mouth action rather than repeating a line.
 */
function takeSpeechBreather() {
	if (!hasSpeechLines()) return;
	const { speaker, lines } = T.speechPool;
	if (!V.speechRestingGroups) V.speechRestingGroups = {};
	const resting = V.speechRestingGroups[speaker] ?? [];
	let pool = lines.filter(line => !resting.includes(line.group ?? ""));
	V.speechRestingGroups[speaker] = [];
	while (pool.length) {
		const dry = groupSpeechLinesByEvent(getTopSpeechLines(pool)).filter(group => getUnsaidSpeechLines(speaker, group.lines).length === 0);
		if (dry.length === 0) break;
		for (const group of dry) {
			forgetSpeechLines(speaker, group.lines);
			V.speechRestingGroups[speaker].push(group.group);
		}
		const dropped = new Set(dry.flatMap(group => group.lines));
		pool = pool.filter(line => !dropped.has(line));
	}
	T.speechPool.lines = pool;
}

/** @returns {boolean} Whether the pool holds nothing but ambient lines. */
function isSpeechPoolAmbient() {
	return T.speechPool.lines.every(line => line.priority === setup.speechPriority.ambient);
}

Macro.add("speechPool", {
	handler() {
		if (!isSpeechSpeaker(this.args[0])) return this.error(`"${this.args[0]}" is not a named NPC or "pc"`);
		startSpeechPool(this.args[0]);
	},
});

/**
 * A line's weight. Default 1.
 *
 * @param {any[]} args
 * @returns {number}
 */
function getSpeechLineWeight(args) {
	const weight = args.find(arg => typeof arg === "number");
	return weight ?? 1;
}

Macro.add("addSpeechLine", {
	tags: null,
	handler() {
		if (!T.speechPool) return this.error("no <<speechPool>> started");
		T.speechPool.lines.push(createSpeechLine(this.payload[0].contents, getSpeechLineWeight(this.args), setup.speechPriority.ongoing));
	},
});

/* Event speech lines are ones that have priority over each other, as well as ongoing sex lines and ambient lines. */
Macro.add("addEventSpeechLine", {
	tags: null,
	handler() {
		if (!T.speechPool) return this.error("no <<speechPool>> started");
		const events = this.args.filter(arg => typeof arg === "string");
		if (events.length === 0) return this.error("needs the name of the event the line answers");
		const unknown = events.filter(event => !isSpeechEvent(event));
		if (unknown.length) return this.error(`not a speech event, add it to setup.speechEvent: "${unknown.join('", "')}"`);
		const fired = events.filter(hasSpeechEventFired);
		if (fired.length === 0) return;
		T.speechPool.lines.push(
			createSpeechLine(
				this.payload[0].contents,
				getSpeechLineWeight(this.args),
				Math.max(...fired.map(getSpeechEventPriority)),
				Array.from(new Set(events)).sort().join(" ")
			)
		);
	},
});

/* Ambient speech lines are neither prioritized "event" lines nor "ongoing" sex act lines. */
Macro.add("addAmbientSpeechLine", {
	tags: null,
	handler() {
		if (!T.speechPool) return this.error("no <<speechPool>> started");
		T.speechPool.lines.push(createSpeechLine(this.payload[0].contents, getSpeechLineWeight(this.args), setup.speechPriority.ambient));
	},
});

/* A PC line and the NNPC's reply to it, paired together:
     <<addPairedSpeechLine>>
	 <<pcLine>>
	 the PC's line
	 <<npcLine>>
	 the NNPC's reply
	 <</addPairedSpeechLine>> */
Macro.add("addPairedSpeechLine", {
	tags: ["pcLine", "npcLine"],
	handler() {
		if (!T.speechPool) return this.error("no <<speechPool>> started");
		const [before, pcLine, npcLine] = this.payload;
		if (before.contents.trim()) return this.error("put PC's line inside <<pcLine>>");
		if (pcLine?.name !== "pcLine" || npcLine?.name !== "npcLine") return this.error("needs a <<pcLine>> then an <<npcLine>>");
		T.speechPool.lines.push(createSpeechLine(pcLine.contents, 1, setup.speechPriority.ongoing, undefined, npcLine.contents));
	},
});

/**
 * Says one line from the pool.
 *
 * @param {HTMLElement|DocumentFragment} output
 */
function saySpeechLine(output) {
	if (!hasSpeechLines()) return;
	const line = pickGroupedSpeechLine(T.speechPool.speaker, T.speechPool.lines);
	if (line.reply) T.pairedSpeechLine = line.reply;
	jQuery(output).wiki(line.content);
}

Macro.add("speechSay", {
	handler() {
		saySpeechLine(this.output);
	},
});

/* Says a line from the pool, or sets _noNameComment.
When the pool holds nothing but ambient lines, there is a 40% chance of the mouth action instead. */
Macro.add("speechSayOrPass", {
	handler() {
		jQuery.wiki("<<rng>>");
		if (!hasSpeechLines() || (isSpeechPoolAmbient() && V.rng <= 40)) {
			T.noNameComment = true;
			return;
		}
		saySpeechLine(this.output);
	},
});

Macro.add("sayPairedSpeechLine", {
	handler() {
		if (T.pairedSpeechLine) jQuery(this.output).wiki(T.pairedSpeechLine);
	},
});

/** @returns {boolean} Whether the PC line said this turn has a reply from the named NPC. */
function hasPairedSpeechLine() {
	return !!T.pairedSpeechLine;
}

window.pickSpeechLine = pickSpeechLine;
window.hasPairedSpeechLine = hasPairedSpeechLine;
window.hasSpeechLines = hasSpeechLines;
window.takeSpeechBreather = takeSpeechBreather;
window.isSpeechPoolAmbient = isSpeechPoolAmbient;
