// Get the button and textarea elements
const translateButton = document.getElementById('translate-button');
const inputText = document.getElementById('input-text');
const translationResult = document.getElementById('translation-result');

let conversationId = uuidv4();

translationResult.style.display = 'none';

// // Add click event listener to the button
// translateButton.addEventListener('click', async () => {
//
// 	console.log(inputText.value);
// 	let response = await fetch("/api/translate", { method: "POST", body: JSON.stringify({ id: conversationId, message: inputText.value }) });
// 	const msg = await response.text();
// 	translationResult.style.display = 'block';
//
// 	translationResult.innerText = msg.replace(/^\s+|\s+$/g, '');
// });
//


// Add click event listener to the button
translateButton.addEventListener('click', async () => {

	console.log(inputText.value);
	let response = await fetch("/api/translate", { method: "POST", body: JSON.stringify({ id: conversationId, message: inputText.value }) });
	const msg = await response.text();
	translationResult.style.display = 'block';
	translationResult.innerText = '';

	let index = 0;
	const typingInterval = setInterval(() => {
		if (index < msg.length) {
			translationResult.innerText += msg.charAt(index);
			index++;
		} else {
			clearInterval(typingInterval);
			translationResult.style.display = 'block';
		}
	}, 30);

});


function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}


const randomizeButton = document.getElementById("randomize-button");
randomizeButton.addEventListener("click", addRandomYodaQuote);

function addRandomYodaQuote() {
	const yodaQuotes = [
		"Do or do not. There is no try.",
		"The greatest teacher, failure is.",
		"Fear is the path to the dark side. Fear leads to anger. Anger leads to hate. Hate leads to suffering.",
		"You will find only what you bring in.",
		"Size matters not. Judge me by my size, do you?",
		"In a dark place we find ourselves, and a little more knowledge lights our way.",
		"Patience you must have, my young Padawan.",
		"Named must your fear be before banish it you can.",
		"Always pass on what you have learned.",
		"Truly wonderful, the mind of a child is.",
		"Many of the truths that we cling to depend on our point of view.",
		"The fear of loss is a path to the Dark Side.",
		"The dark side clouds everything. Impossible to see the future is.",
		"Clear your mind must be, if you are to discover the real villains behind this plot.",
		"Once you start down the dark path, forever will it dominate your destiny.",
		"Powerful you have become, the dark side I sense in you.",
		"Wars not make one great.",
		"To be Jedi is to face the truth, and choose. Give off light, or darkness, Padawan. Be a candle or the night.",
		"You think Yoda stops teaching, just because his student does not want to hear? A teacher Yoda is. Yoda teaches like drunkards drink, like killers kill.",
		"Strong is Vader. Mind what you have learned. Save you it can.",
		"Train yourself to let go of everything you fear to lose.",
		"Much to learn, you still have.",
		"The boy you trained, gone he is. Consumed by Darth Vader.",
		"The dark side of the Force is a pathway to many abilities some consider to be unnatural.",
		"When nine hundred years old you reach, look as good you will not. Hmm?",
	];
	const randomIndex = Math.floor(Math.random() * yodaQuotes.length);
	const randomQuote = `"${yodaQuotes[randomIndex]}"`;
	const inputTextarea = document.getElementById("input-text");
	inputTextarea.value = randomQuote;
	translateButton.click();
}


const toggleDocsButton = document.getElementById('toggle-docs');
const docsSection = document.querySelector('.documentation');

toggleDocsButton.addEventListener('click', function() {
	if (docsSection.style.display === "none") {
		docsSection.style.display = "block";
	} else {
		docsSection.style.display = "none";
	}
});
