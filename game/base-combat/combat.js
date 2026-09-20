// @ts-check

/**
 * Resolves named NPC-specific ejaculation macros.
 *
 * This helper allows callers to use a single lookup instead of repeating
 * named NPC checks. If a matching macro such as <<ejaculation-robin>>
 * exists for the resolved NPC name, it is returned for direct use.
 *
 * @param {string | number} index NPC index or identifier.
 * @param {...string} args Optional extra macro arguments.
 * @returns {string} Matching named NPC ejaculation macro, or an empty string if none applies.
 */
function namedNpcEjaculation(index, ...args) {
	const npcName = V.npc[V.npcrow.indexOf(index)];
	const npc = V.NPCList[index];
	if (!npc) return "";
	const output = args[0] ? " " + args[0] : "";
	// Prefer NPC-specific ejaculation macros when available.
	if (npcName && Macro.has(`ejaculation-${npcName.toLowerCase()}`) && setup.NPCNameList.includes(npcName)) {
		return `<<ejaculation-${npcName.toLowerCase()}${output}>>`;
	} else {
		return "";
	}
}

window.namedNpcEjaculation = namedNpcEjaculation;
DefineMacroS("namedNpcEjaculation", namedNpcEjaculation);

/**
 * Resolves the named NPC combat comment macro.
 *
 * Returns the corresponding <<speech-*>> macro for named NPCs that have
 * a supported combat comment handler. If no matching handler exists,
 * marks the current comment pass as having no named NPC comment.
 *
 * Special case:
 * - "Ivory Wraith" maps to <<speech-wraith>>.
 *
 * @param {string} npcName The NPC display name.
 * @returns {string} The speech macro to print, or an empty string if none applies.
 */
function namedNpcComments(npcName) {
	// Reset the no-comment flag before resolving this NPC's comment.
	delete T.noNameComment;

	// Do not return any comment while the current pass is silent.
	if (T.silent) return "";

	// Named NPCs with registered handlers resolve to their matching speech macro.
	// The NPC is left in T.speechNpc while its widget renders so speechPick() knows whose history to use.
	if (npcName && Macro.has(`speech-${npcName.toLowerCase()}`) && setup.NPCNameList.includes(npcName)) {
		T.speechNpc = npcName;
		return `<<speech-${npcName.toLowerCase()}>><<unset _speechNpc>>`;
	}
	// Special case for Ivory Wraith, which uses a dedicated speech macro name.
	else if (npcName === "Ivory Wraith") {
		return "<<speechWraith>>";
	}
	// No valid named NPC comment was found for this pass.
	else {
		T.noNameComment = true;
		return "";
	}
}

DefineMacroS("namedNpcComments", namedNpcComments);

/**
 * Resolves a named NPC's reaction to something that just happened in combat.
 *
 * `<<namedNpcReaction _n "kissSkin" "thighs">>` -> `<<reaction-avery-kissSkin "thighs">>`
 *
 * @param {string | number} index NPC index or identifier
 * @param {string} event What just happened, e.g. "kissSkin".
 * @param {string} [subject] The body part for kissSkin/fondle, what the PC mocked for mock, etc. Omit if action doesn't need a subject.
 * @returns {string} The NPC's reaction macro, or an empty string if none applies.
 */
function namedNpcReaction(index, event, subject) {
	const npcName = V.NPCList[index]?.fullDescription;
	if (!npcName || !event || !setup.NPCNameList.includes(npcName)) return "";
	const macro = `reaction-${npcName.toLowerCase()}-${event}`;
	if (!Macro.has(macro)) return "";
	return `<<${macro}${subject === undefined ? "" : " " + JSON.stringify(subject)}>>`;
}

window.namedNpcReaction = namedNpcReaction;
DefineMacroS("namedNpcReaction", namedNpcReaction);

/**
 * What the current named NPC has already said this combat.
 *
 * @returns {string[]} That NPC's history, oldest first.
 */
function speechHistory() {
	if (!V.speechSaid) V.speechSaid = {};
	if (!V.speechSaid[T.speechNpc]) V.speechSaid[T.speechNpc] = [];
	return V.speechSaid[T.speechNpc];
}

/**
 * What the NPC has not said yet this combat.
 * The pool starts over when expended.
 *
 * @param {any[]} candidates Lines or speech events.
 * @param {function(any):string} nameOf The history name of a candidate.
 * @returns {any[]} The candidates still unsaid, or the restarted pool.
 */
function speechUnsaid(candidates, nameOf) {
	const said = speechHistory();
	const unsaid = candidates.filter(candidate => !said.includes(nameOf(candidate)));
	if (unsaid.length > 0) return unsaid;

	const lastSaid = said[said.length - 1];
	said.delete(...candidates.map(nameOf));
	return candidates.length > 1 ? candidates.filter(candidate => nameOf(candidate) !== lastSaid) : candidates;
}

/**
 * A random line this NPC has not said yet this combat. Takes the lines as arguments or as an array.
 *
 * @param {...(string|string[])} lines The candidate lines, or a single array of them.
 * @returns {string|undefined} The chosen line, or undefined when there are none.
 */
function speechPick(...lines) {
	const candidates = lines.length === 1 && Array.isArray(lines[0]) ? lines[0] : lines;
	if (!T.speechNpc || candidates.length <= 1) return either(candidates);
	const line = either(speechUnsaid(candidates, line => line));
	speechHistory().push(line);
	return line;
}

const SPEECH_BREATHER_TURNS = 2;

/**
 * Make it so that a NNPC acts with their mouth / use their ambient lines when they have small pools of dialogue, for now.
 *
 * @returns {boolean} True when the pool has something new to say.
 */
function speechPoolFresh() {
	if (!V.speechResting) V.speechResting = {};
	if (V.speechResting[T.speechNpc] > 0) {
		V.speechResting[T.speechNpc]--;
		return false;
	}
	if (T.eventpool.length === 0) return false;
	const nameOf = event => event.name || event.content;
	const said = speechHistory();
	if (T.eventpool.some(event => !said.includes(nameOf(event)))) return true;
	said.delete(...T.eventpool.map(nameOf));
	V.speechResting[T.speechNpc] = SPEECH_BREATHER_TURNS - 1;
	return false;
}

window.speechPick = speechPick;
window.speechPoolFresh = speechPoolFresh;
