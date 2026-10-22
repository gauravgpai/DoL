// @ts-check

/**
 * Resolves a named NPC from a combat row or a name.
 * @param {number | string} npc NPC index or name.
 * @returns {string | undefined}
 */
function getCombatNpcName(npc) {
	let name = typeof npc === "string" ? npc : undefined;
	if (typeof npc === "number") {
		const entry = V.NPCList?.[npc];
		if (!entry) return;
		name = entry.fullDescription;
		if (!setup.NPCNameList.includes(name)) {
			const row = V.npcrow?.indexOf(npc) ?? -1;
			name = row >= 0 ? V.npc?.[row] : undefined;
		}
	}
	return typeof name === "string" && setup.NPCNameList.includes(name) ? name : undefined;
}

/**
 * @param {string} macro Macro name.
 * @param {...(string | undefined)} args Macro arguments.
 * @returns {string} Registered macro invocation, or an empty string.
 */
function combatNpcMacro(macro, ...args) {
	if (!Macro.has(macro)) return "";
	const argumentsText = args.filter(arg => arg !== undefined).map(arg => " " + JSON.stringify(arg)).join("");
	return `<<${macro}${argumentsText}>>`;
}

/**
 * Selects scene-specific dialogue before named or generic NPC text.
 * @param {number} index NPC index.
 * @param {...(string | undefined)} args Macro arguments.
 * @returns {string} Scene, named NPC, or generic macro invocation.
 */
function npcEjaculation(index, ...args) {
	const npc = V.NPCList?.[index];
	if (!npc) return "";
	let macro;
	if (V.position === "wall") {
		macro = V.walltype === "pillory" || V.walltype === "cleanpillory" ? "ejaculation-pillory" : "ejaculation-wall";
	} else if (V.punishmentposition === "gloryhole" || V.gloryhole) {
		macro = "ejaculation-gloryhole";
	} else if (npc.type === "plant") {
		macro = "ejaculation-plant";
	} else {
		const name = getCombatNpcName(index);
		if (name) {
			const suffix = name.trim().replace(/\s+/g, "-");
			const named = combatNpcMacro(`ejaculation-${suffix.toLowerCase()}`, ...args) || combatNpcMacro(`ejaculation-${suffix}`, ...args);
			if (named) return named;
			if (name === "Ivory Wraith") {
				const wraith = combatNpcMacro("ejaculation-wraith", ...args);
				if (wraith) return wraith;
			}
		}
		// Keep the shared fallback for named combat rows, including custom NPCs.
		if (name || V.npcrow?.includes(index)) {
			macro = "ejaculation-named-common";
		}
	}
	return (macro && combatNpcMacro(macro, ...args)) || combatNpcMacro("ejaculation-generic", ...args);
}

DefineMacroS("npcEjaculation", npcEjaculation);

/**
 * @param {number | string} npc NPC index or name.
 * @returns {string} Speech macro, or an empty string that permits generic comments.
 */
function namedNpcComments(npc) {
	delete T.noNameComment;
	if (T.silent) return "";
	const name = getCombatNpcName(npc);
	if (name) {
		const suffix = name.trim().replace(/\s+/g, "-");
		const comment = combatNpcMacro(`speech-${suffix.toLowerCase()}`) || combatNpcMacro(`speech-${suffix}`);
		if (comment) return comment;
		if (name === "Ivory Wraith" && Macro.has("speechWraith")) return "<<speechWraith>>";
	}
	T.noNameComment = true;
	return "";
}

DefineMacroS("namedNpcComments", namedNpcComments);

/**
 * @param {number | string} npc NPC index or name.
 * @param {string} event Reaction event.
 * @param {string} [detail] Optional body part.
 * @returns {string} Reaction macro, or an empty string.
 */
function namedNpcReaction(npc, event, detail) {
	const name = getCombatNpcName(npc);
	if (!name || typeof event !== "string" || !/^[a-zA-Z]+$/.test(event)) return "";
	const suffix = name.trim().replace(/\s+/g, "-");
	return combatNpcMacro(`reaction-${suffix.toLowerCase()}-${event}`, detail) || combatNpcMacro(`reaction-${suffix}-${event}`, detail);
}

window.namedNpcReaction = namedNpcReaction;
DefineMacroS("namedNpcReaction", namedNpcReaction);
