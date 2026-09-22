/*
 * Combat speech lines. A speaker is a named NPC ("Avery") or the player ("pc")
 * Each turn a speaker gathers the lines it could say into a pool.
 * One line is picked that the speaker has not said yet this combat.
 * What each speaker has said lives in $speechSaid as a hash and is unset by <<endevent>>.
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
 * @param {string} [reply] NNPC's reply, said later in the turn by <<sayPairedSpeechLine>>.
 * @returns {SpeechLine}
 */
function createSpeechLine(content, weight, reply) {
	const line = { content, weight, hash: getSpeechLineHash(content) };
	if (reply) line.reply = reply;
	return line;
}

/**
 * Returns the hashes of the lines the speaker has said this combat.
 *
 * @param {SpeechSpeaker} speaker
 * @returns {string[]}
 */
function getSpeechHistory(speaker) {
	if (!V.speechSaid) V.speechSaid = {};
	if (!V.speechSaid[speaker]) V.speechSaid[speaker] = [];
	return V.speechSaid[speaker];
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
	V.speechSaid[speaker] = getSpeechHistory(speaker).filter(hash => !hashes.includes(hash));
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
		texts.map(text => createSpeechLine(text, 1))
	).content;
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
	return T.speechPool?.lines?.length > 0;
}

/**
 * If the speaker has already said every line in the pool, clears the pool for this turn and the next
 * so generic comments or mouth actions play instead of a repeat.
 *
 * @returns {boolean} true if the pool was cleared
 */
function takeSpeechBreather() {
	if (!hasSpeechLines()) return false;
	const { speaker, lines } = T.speechPool;
	if (!V.speechRestTurns) V.speechRestTurns = {};
	if (V.speechRestTurns[speaker] > 0) {
		V.speechRestTurns[speaker]--;
	} else if (getUnsaidSpeechLines(speaker, lines).length > 0) {
		return false;
	} else {
		forgetSpeechLines(speaker, lines);
		V.speechRestTurns[speaker] = 1;
	}
	startSpeechPool(speaker);
	return true;
}

Macro.add("speechPool", {
	handler() {
		if (!isSpeechSpeaker(this.args[0])) return this.error(`"${this.args[0]}" is not a named NPC or "pc"`);
		startSpeechPool(this.args[0]);
	},
});

Macro.add("addSpeechLine", {
	tags: null,
	handler() {
		if (!T.speechPool) return this.error("no <<speechPool>> started");
		T.speechPool.lines.push(createSpeechLine(this.payload[0].contents, typeof this.args[0] === "number" ? this.args[0] : 1));
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
		T.speechPool.lines.push(createSpeechLine(pcLine.contents, 1, npcLine.contents));
	},
});

Macro.add("speechSay", {
	handler() {
		if (!hasSpeechLines()) return;
		const line = pickSpeechLineFrom(T.speechPool.speaker, T.speechPool.lines);
		if (line.reply) T.pairedSpeechLine = line.reply;
		jQuery(this.output).wiki(line.content);
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
