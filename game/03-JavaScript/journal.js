function timeSensitive() {
	/**
	 *
	 * @returns {{[p: Time.daysOfWeek[]]: any}}
	 */
	const makeWeek = () => Object.fromEntries(Time.daysOfWeek.map(key => [key, []]));

	/**
	 * Need to set up two weeks. Harper happens on a Friday, but it may not be THIS Friday.
	 *
	 * @type {{[p: Time.daysOfWeek[]]: any}[]}
	 */
	const weeks = [makeWeek(), makeWeek()];

	const soon = [];

	let averyPay;
	if (V.avery_mansion) {
		/* Is Avery paying for the PC? */
		if (V.avery_mansion.rage.assess >= 9 || C.npc.Avery.state === "dismissed" || V.avery_mansion.days_absent >= 2) {
			averyPay = false;
		} else {
			averyPay = true;
		}
	} else {
		averyPay = false;
	}
	if (!averyPay) {
		if (V.rentday !== undefined) {
			if (V.renttime <= 0) {
				soon.push(
					`Bailey is looking for you and wants <<printmoney ${V.rentmoney}>><<babyRentDisplay " plus " " for not looking after your children" "gold">>.`
				);
			} else {
				weeks[0][Time.daysOfWeek[V.rentday - 1]].push(
					`Bailey wants <<printmoney ${V.rentmoney}>> on <<rentday>><<babyRentDisplay " plus " " for not looking after your children" "gold">>.`
				);
			}
		} else if (V.rentmoney !== undefined) {
			soon.push(`Bailey wants <<printmoney ${V.rentmoney}>><<babyRentDisplay " plus " " for not looking after your children" "gold">>.`);
		}
	}

	if (V.bailey_confiscation && V.bailey_confiscation.items && V.bailey_confiscation.items.length > 0) {
		/* Bailey Confiscation System */
		const _rentDueDate = V.bailey_confiscation.day + 7 - Time.days;
		const _discardDate = V.bailey_confiscation.day + 8 - Time.days;
		const formatDate = date => getFormattedDate(new DateTime(Time.date).addDays(date), true);
		const formatDayOfWeek = new DateTime(Time.date).addDays(_rentDueDate).weekDayName;
		weeks[0][formatDayOfWeek].push(
			`Bailey confiscated your <<baileyConfiscationListFull>>. Pay your rent on <span class="gold"><<print ${formatDate(
				_rentDueDate
			)}>></span> or buy your stuff back before <span class="gold"><<print ${formatDate(_discardDate)}>></span>, or <<nnpc_he "Bailey">>'ll pawn it off.`
		);
	}

	if (V.syndromeeden === 1 && V.edenfreedom >= 1 && V.location !== "cabin") {
		/* Another parameter is planned, something like V.edenpunishment. It is meant to only trigger the journal note after the player has been given a reason to be wary of breaking Eden's rules. */
		if (window.edenFreedomStatus() === 0) {
			let text = `You are expected back at Eden's cabin`;
			if (V.edenfreedom === 1) {
				if (V.edendays === 2) {
					text += `<span class="pink">tonight, before midnight</span>.`;
				} else {
					/* V.edendays is 1 */
					text += `by <span class="gold">tomorrow night</span>, at the latest.`;
				}
			} else {
				/* V.edenfreedom is 2 or more */
				if (V.edendays === 7) {
					text += `<span class="pink">tonight, before midnight</span>.`;
				} else if (V.edendays === 6) {
					text += `by <span class="gold">tomorrow night</span>, at the latest.`;
				} else {
					/* V.edendays is between 1 and 5 */
					text += `in <span class="gold"><<print ["seven", "six", "five", "four", "three", "two"][${V.edendays}]>></span> days, at the latest.`;
				}
			}
			soon.push(text);
		} else if (window.edenFreedomStatus() === 1 && ((V.edenfreedom === 1 && V.edendays < 4) || (V.edenfreedom === 2 && V.edendays < 10))) {
			/* Warning lasts for one day on freedom 1 and two days on freedom 2 */
			soon.push(`You have <span class="red">failed</span> to return to Eden on time. <<nnpc_He "Eden">> will have noticed by now.`);
		}
	}

	if (V.avery_mansion?.schedule !== "away" && V.averydate === 1 && Time.hour <= 21 && V.averydatedone !== 1) {
		weeks[0].Saturday.push(
			`You have a date scheduled with Avery <span class="pink"><<this_saturday>></span>. <<nnpc_He "Avery">>'ll wait for you ${
				V.avery_mansion ? "in the garage" : "on Domus Street"
			} between <span class="gold">${ampm(20)}</span> and <span class="gold">${ampm(21)}</span>.`
		);
	}

	if (V.avery_valentines?.invite && !V.avery_valentines?.done && !V.avery_valentines?.missed_approach && !V.avery_valentines_missed) {
		// todo tricky to fit this into weeks[0], particular day.
		let valentines = `Avery has invited you on a date for <span class="pink">Valentine's Day, on ${getFormattedDate(
			new DateTime(Time.year, 2, 14)
		)}.</span>  <<nnpc_He "Avery">>'ll wait for you`;
		if (V.avery_mansion) {
			valentines += ` in the mansion garage from <span class="gold">${ampm(21)}</span>.`;
		} else {
			valentines += ` on Domus Street from <span class="gold">${ampm(20)}</span>.`;
		}
		soon.push(valentines);
	}

	if (V.harper_appointments.enabled || V.schoolPsych === 1) {
		let harperApt = `You ${V.harper_appointments.enabled ? "have an" : "may get an"} appointment with Doctor Harper`;
		let harpersWeek = weeks[0];

		if (Time.weekDay === 6) {
			if (V.daily.harperVisit === 1) {
				harperApt += ` next <span class="gold">Friday</span>.`;
				// Not today, a week from today:
				harpersWeek = weeks[1];
			} else {
				harperApt += ` <span class="pink">today</span>.`;
			}
		} else {
			harperApt += ` on <span class="gold">Friday</span>.`;
		}
		harpersWeek.Friday.push(harperApt);
	}

	if (V.brothelshowdata.type !== "none" && V.brothelshowdata.intro) {
		let brothelsWeek = weeks[0];
		let show = `You're expected to perform a ${V.brothelshowdata.type} show at the brothel`;
		if (Time.weekDay === 6) {
			if (V.brothelshowdata.done) {
				show += ` next <span class="gold">Friday</span>.`;
				brothelsWeek = weeks[1];
			} else {
				show += ` <span class="pink">today</span>.`;
			}
		} else {
			show += ` on <span class="gold">Friday</span>.`;
		}
		brothelsWeek.Friday.push(show);
	}

	if (V.brothel_escortjob !== undefined) {
		if (
			(V.brothel_escortjob.done === undefined || V.brothel_escortjob.escape === undefined) &&
			V.brothel_escortjob.accept === true &&
			V.brothel_escortjob.missed !== true
		) {
			const _date = new DateTime(V.brothel_escortjob.date);
			let escortWeek = weeks[0];
			let escort = `You have an escort job scheduled. You're expected to be in front of the brothel`;
			if (Time.monthDay === _date.day) {
				escort += ` <span class="pink">today</span>`;
			} else if (Time.date.dayDifference(_date) === 1) {
				escort += ` <span class="gold">tomorrow</span>`;
			} else if (Time.date.dayDifference(_date) >= 7) {
				escort += ` next <span class="gold">_date.weekDayName</span>`;
				escortWeek = weeks[1];
			} else {
				escort += ` on <span class="gold">_date.weekDayName</span>`;
			}
			escort += ` at <span class="gold">${ampm(_date.hour)}</span>.`;
			escortWeek.push(escort);
		}
	}

	if (V.community_service >= 1) {
		let service = "";
		if (V.community_service_done === 1) {
			service += `<span class="lblue">You've performed your community service today.</span><`;
		} else if (["asylum", "prison"].includes(V.location)) {
			service += `Your sentence of community service has been put on hold due to your if ${V.location === "prison" ? "incarceration" : "treatment"}`;
		} else if (Time.hour >= 21) {
			service += `It's too late in the day to perform your community service.`;
		} else if (Time.hour < 6) {
			service += `The police station is expecting you later for your daily community service.`;
		} else {
			service += `The police station is expecting you for your daily community service.`;
		}
		if (V.community_service === 1) {
			service += `<br>You have <span class="purple">one day</span> of community service remaining.`;
		} else {
			service += `<br>You have <span class="pink">${V.community_service}</span> days of community service remaining.`;
		}
		soon.push(service);
	}

	if (V.wrenHeist === true && Time.hour <= 20 && V.wrenHeistDance.attended !== true) {
		soon.push(
			`You are supposed to meet Wren <span class="pink">tonight</span> between <span class="gold">${ampm(19)}</span> and <span class="gold">${ampm(
				21
			)}</span>. <<nnpc_He "Wren">> gave you directions to the mansion on Danube Street.`
		);
	}

	if (V.smuggler_known === 1 && V.smuggler_timer >= 0) {
		let smugglers = `Smugglers are bringing something valuable into town`;
		if (V.smuggler_timer === 0) {
			smugglers += ` <span class="pink">tonight</span>, before midnight.`;
		} else if (V.smuggler_timer === 1) {
			smugglers += ` <span class="gold">tomorrow</span>, before midnight.`;
		} else {
			smugglers += ` <<nDays ${V.smuggler_timer}>>.`;
		}
		if (V.smuggler_location === "forest") {
			smugglers += `<br>They're bringing it through the forest.`;
		} else if (V.smuggler_location === "sewer") {
			smugglers += `<br>They're bringing it through the old sewers.`;
		} else if (V.smuggler_location === "beach") {
			smugglers += `<br>They plan to land at that rock near the beach.`;
		} else if (V.smuggler_location === "bus") {
			smugglers += `<br>They're sneaking it in on a bus.`;
		}
		soon.push(smugglers);
	}

	if (V.farm_stage >= 7) {
		const targetedDay = (Time.dayOfYear + V.farm_attack_timer) % 7;
		let farm = `Remy will attack the farm`;
		if (V.farm_attack_timer === 0) {
			farm += ` <span class="pink">tonight</span>.`;
		} else {
			farm += ` <<nDays ${V.farm_attack_timer}>>.`;
		}
		farm += ` <<nnpc_He Remy>>'ll arrive between <span class="gold">${ampm(21)}</span> and <span class="gold">midnight</span>.`;
		const remyWeek = V.farm_attack_timer < 7 ? weeks[0][Time.daysOfWeek[targetedDay]] : soon;
		remyWeek.push(farm);
	}

	if (["initiate", "monk", "priest"].some(title => title === V.temple_rank)) {
		let temple = `You are ${V.temple_rank === "initiate" ? "an initiate at" : "a <<temple_title>> of"} the temple.`;
		if (V.temple_chastity_timer <= 0) {
			temple += ` <span class="pink">You have a chastity exam due.</span>`;
		} else if (V.temple_chastity_timer === 1) {
			temple += ` You have a chastity exam due <span class="purple">tomorrow</span>.`;
		} else {
			temple += ` You have a chastity exam due <<nDays ${V.temple_chastity_timer}>>.`;
		}
		temple += `<br>You will receive an <span class="gold">allowance</span> when passing the exam.`;
		soon.push(temple);
	}

	if (V.studyBooks !== undefined && (V.studyBooks?.rented !== "none" || V.studyBooks?.stolen !== "none")) {
		const bookStrings = [];
		let _book;
		if (V.studyBooks.rented !== "none") {
			switch (V.studyBooks.rented) {
				case "Pinch":
					if (V.per_npc.pinch !== undefined) {
						_book = `copy of "How ${V.per_npc.pinch.pronoun === "m" ? "Mr" : "Ms"} Pinch Groped Christmas"`;
					} else {
						_book = "olive-coloured book";
					}
					break;
				case "Raul and Janet":
					_book = `copy of "${V.studyBooks.rented}"`;
					break;
				case "English":
				case "science":
				case "maths":
				case "history":
					_book = V.studyBooks.rented + " textbook";
					break;
			}

			if (Time.schoolTerm) {
				if (V.book_rent_timer === 0) {
					bookStrings.push(`<span class="blue">You have <<a ${_book}>> due.</span>`);
				} else if (V.book_rent_timer < 0) {
					bookStrings.push(`<span class="red">You have <<a ${_book}>> overdue.</span>`);
				} else {
					bookStrings.push(`You have <<a ${_book}>> due in <span class="gold">${V.book_rent_timer}</span> <<pluralise ${V.book_rent_timer} "day">>.`);
				}
			}
		}
		if (V.studyBooks.stolen !== "none") {
			const colour = V.bookStolenKnown >= 3 ? "red" : V.bookStolenKnown === 2 ? "pink" : "white";
			switch (V.studyBooks.stolen) {
				case "Pinch":
					if (V.per_npc.pinch !== undefined) {
						bookStrings.push(
							`<span class="${colour}>">You've stolen a copy of "How ${
								V.per_npc.pinch.pronoun === "m" ? "Mr" : "Ms"
							} Pinch Groped Christmas".</span>`
						);
					} else {
						bookStrings.push(`<span class="${colour}">You've stolen an olive-coloured book.</span>`);
					}
					break;
				case "Raul and Janet":
					bookStrings.push(`<span class="${colour}">You've stolen a copy of "${V.studyBooks.stolen}".</span>`);
					break;
				case "English":
				case "science":
				case "maths":
				case "history":
					bookStrings.push(`<span class="${colour}">You've stolen <<a ${V.studyBooks.stolen}>> textbook.</span>`);
					break;
				default:
			}
		}
		if (!Time.schoolTerm && V.studyBooks.rented !== "none") {
			let overdue = "";
			if (V.studyBooks.rented) {
				overdue += `You have <<a ${_book}>> checked out.`;
			}
			overdue.push(`<span class="blue">Books are not due over school break!</span>`);
		}
		bookStrings.forEach(book => soon.push(book));
	}

	if (V.gwylanSeen?.includes("ritual_beast")) {
		statusCheck("Gwylan");
		if (V.gwylan.timer.ritual && Time.date.dayDifference(new DateTime(V.gwylan.timer.ritual)) > 0) {
			const ritualDays = Time.date.dayDifference(new DateTime(V.gwylan.timer.ritual));
			weeks[0][Time.daysOfWeek[(Time.dayOfYear + ritualDays) % 7]].push(
				`${
					isGwylanAbsent() ? "Nobody" : "Gwylan"
				} will be ready for another ritual in <span class="gold"><<number ${ritualDays}>></span> <<pluralise ${ritualDays} "day">>.`
			);
		} else if (T.gwylanStatus.includes("badEndReady") || V.gwylan.hunting === 3) {
			soon.push(`<span class="red">${isGwylanAbsent() === "nobody" ? "Nobody" : "Gwylan"} is waiting to perform another ritual with you.</span>`);
		} else {
			soon.push(`<span class="pink">${isGwylanAbsent() === "nobody" ? "Nobody" : "Gwylan"} is ready to perform another ritual.</span>`);
		}
	}

	if (V.pubfame?.status) {
		if (V.pubfame.status === "finished" || V.pubfame.status === "hidingKnown") {
			soon.push(`'Mickey' will be ready to see you in <span class="gold"><<number ${V.pubfame.timer}>></span> <<pluralise ${V.pubfame.timer} "day">>.`);
		} else if (V.pubfame.status === "ready") {
			soon.push(`<span class="gold">'Mickey' is ready to help you with your fame</span>.`);
		} else if (V.pubfame.status === "accepted") {
			soon.push(`You've accepted a task from 'Mickey'.`);
		} else if (V.pubfame.status === "done") {
			soon.push(`You've completed the task 'Mickey' gave you.`);
		} else if (V.pubfame.status === "hiding") {
			/* only happens when the elk compound interrogation is failed */
			soon.push(`You've failed the task 'Mickey' gave you.`);
		}
	}

	if (V.schoolfameblackmail !== undefined && Time.schoolDay) {
		const blackmailColour = V.schoolfameconsensual === 1 ? "white" : V.schoolfameblackmail >= 3 ? "red" : "pink";
		/* White for paid lewd photoshoots, red for when the school board event is possible, pink for unpaid lewd photoshoots */
		if (V.schoolfameboard !== 1 || V.schoolfameconsensual === 1) {
			if (V.schoolfameblackmail > 0 && Time.hour < 17) {
				soon.push(
					`<li> Leighton expects to see you at <<nnpc_his "Leighton">> office <span class="${blackmailColour}">today</span> between ${ampm(
						7
					)} and ${ampm(17)}. </li>`
				);
			} else if (V.schoolfameblackmail === 0) {
				soon.push(`<li> You've done the photoshoot at Leighton's office today. </li>`);
			}
		}
	}

	let finalText = ``;
	if (soon.length) {
		finalText += `<h1 class="header gold bold">Time-Sensitive</h1>`;
		finalText += `<ul class="journal">`;
		finalText += soon.map(item => `<li> ${item}</li>`).join("");
		finalText += `</ul>`;
	}

	[weeks[0], weeks[1]].forEach(week => printAWeek(week));

	return finalText;

	/**
	 * We want to loop through the days of the week as presented in Time.daysOfWeek and a typical calendar.
	 * Start from the current day of the week, then finish the days we didn't reach yet
	 * ie, if it's Friday (fifth day, index 5), we want to start there, print Saturday at 6, then return to Sunday at 0 and the rest of the data, 1, 2, etc
	 *
	 * @param {object} weekObj
	 */
	function printAWeek(weekObj) {
		const indexOfToday = Time.dayOfYear % 7;
		for (let i = 0; i < Object.values(weekObj).length; i++) {
			const pointer = (i + indexOfToday) % Object.values(weekObj).length;
			const day = Time.daysOfWeek[pointer];
			if (weekObj[day].length) {
				finalText += `<h1 class="header gold bold">${day}</h1>`;
				finalText += `<ul class="journal">`;
				finalText += weekObj[day].map(item => `<li> ${item}</li>`).join("");
				finalText += `</ul>`;
			}
		}
	}
}
window.timeSensitive = timeSensitive;
