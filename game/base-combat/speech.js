/*
 * Combat speech lines. A speaker is a named NPC ("Avery") or the player ("pc")
 * Each turn a speaker gathers the lines it could say into a pool.
 * One line is picked that the speaker has not said yet this combat.
 * What each speaker has said lives in $speechSaid as a hash and is unset by <<endevent>>.
 */

/**
 * Hashes a line's text for its ID.
 *
 * @param {string} text
 * @returns {string}
 */
function getSpeechLineId(text) {
	let hash = 5381;
	for (let i = 0; i < text.length; i++) hash = (Math.imul(hash, 33) ^ text.charCodeAt(i)) >>> 0;
	return hash.toString(36);
}

/**
 * Returns the hashes of the lines the speaker has said this combat.
 *
 * @param {string} speaker
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
 * @param {string} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine[]}
 */
function getUnsaidSpeechLines(speaker, lines) {
	const said = getSpeechHistory(speaker);
	return lines.filter(line => !said.includes(getSpeechLineId(line.content)));
}

/**
 * Removes lines from the speaker's history so they can be said again.
 *
 * @param {string} speaker
 * @param {SpeechLine[]} lines
 */
function forgetSpeechLines(speaker, lines) {
	const ids = lines.map(line => getSpeechLineId(line.content));
	V.speechSaid[speaker] = getSpeechHistory(speaker).filter(id => !ids.includes(id));
}

/**
 * Picks a random line the speaker hasn't said yet and marks it as said.
 * Once every line has been said, the history for these lines is reset so the speaker doesn't run dry.
 * The last line said is excluded from the reset so it can't play twice in a row.
 *
 * @param {string} speaker
 * @param {SpeechLine[]} lines
 * @returns {SpeechLine}
 */
function pickSpeechLineFrom(speaker, lines) {
	let fresh = getUnsaidSpeechLines(speaker, lines);
	if (fresh.length === 0) {
		const said = getSpeechHistory(speaker);
		const lastSaid = said[said.length - 1];
		forgetSpeechLines(speaker, lines);
		fresh = lines.length > 1 ? lines.filter(line => getSpeechLineId(line.content) !== lastSaid) : lines;
	}
	const picked = rollWeightedRandomFromArray(fresh);
	getSpeechHistory(speaker).push(getSpeechLineId(picked.content));
	return picked;
}

/**
 * Same as pickSpeechLineFrom, but for plain strings. Use instead of either() so lines don't repeat.
 *
 * @param {string} speaker
 * @param {...string} texts
 * @returns {string}
 */
function pickSpeechLine(speaker, ...texts) {
	return pickSpeechLineFrom(
		speaker,
		texts.map(content => ({ content, weight: 1 }))
	).content;
}

/* The speech pool. Lines are added with <<speechLine>> and one is played with <<speechSay>>. */

/**
 * Starts an empty pool for the speaker. Replaces whatever pool was there before.
 *
 * @param {string} speaker
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
	return !!T.speechPool && T.speechPool.lines.length > 0;
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
	if (!V.speechResting) V.speechResting = {};
	if (V.speechResting[speaker] > 0) {
		V.speechResting[speaker]--;
	} else if (getUnsaidSpeechLines(speaker, lines).length > 0) {
		return false;
	} else {
		forgetSpeechLines(speaker, lines);
		V.speechResting[speaker] = 1;
	}
	startSpeechPool(speaker);
	return true;
}

Macro.add("speechPool", {
	handler() {
		if (typeof this.args[0] !== "string") return this.error("no speaker given");
		startSpeechPool(this.args[0]);
	},
});

Macro.add("speechLine", {
	tags: null,
	handler() {
		if (!T.speechPool) return this.error("no <<speechPool>> started");
		T.speechPool.lines.push({ content: this.payload[0].contents, weight: typeof this.args[0] === "number" ? this.args[0] : 1 });
	},
});

Macro.add("speechSay", {
	handler() {
		if (!hasSpeechLines()) return;
		jQuery(this.output).wiki(pickSpeechLineFrom(T.speechPool.speaker, T.speechPool.lines).content);
	},
});

window.pickSpeechLine = pickSpeechLine;
window.hasSpeechLines = hasSpeechLines;
window.takeSpeechBreather = takeSpeechBreather;
