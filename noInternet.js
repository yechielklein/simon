const buttonColors = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let gameStarted = false;

const pause = duration => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, duration);
	});
};

const nextSequence = async () => {
	level++;
	document.querySelector('#level-title').innerText = `level: ${level}`;
	const randomColor = buttonColors[Math.floor(Math.random() * 4)];
	gamePattern.push(randomColor);
	for (const color of gamePattern) {
		// $(`#${color}`).fadeOut(100).fadeIn(100);
		animatePress(color); // change this to fade out and in
		makeSound(color);
		await pause(500);
	}
};

const makeSound = name => {
	const sound = new Audio(`sounds/${name}.mp3`);
	sound.play();
};

const animatePress = name => {
	document.querySelector(`#${name}`).classList.add('pressed');
	setTimeout(() => {
		document.querySelector(`#${name}`).classList.remove('pressed');
	}, 100);
};

const restart = () => {
	gamePattern = [];
	level = 0;
	gameStarted = false;
};

const checkAnswer = currentLevel => {
	if (userClickedPattern[currentLevel] !== gamePattern[currentLevel]) {
		makeSound('wrong');
		document.body.classList.add('game-over');
		setTimeout(() => {
			document.body.classList.remove('game-over');
		}, 200);
		document.querySelector('#level-title').innerText = 'Game Over, Press Any Key to Restart';
		restart();
	};
};

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => button.addEventListener('click', event => {
	const userChosenColor = event.target.id;
	makeSound(userChosenColor);
	animatePress(userChosenColor);
	if (gameStarted) {
		userClickedPattern.push(userChosenColor);
		checkAnswer(userClickedPattern.length - 1);
		if (userClickedPattern.length === gamePattern.length) {
			userClickedPattern = [];
			setTimeout(() => {
				nextSequence();
			}, 1000);
		}
	}
}));

document.addEventListener('keydown', () => {
	if (!gameStarted) {
		userClickedPattern = [];
		nextSequence();
		gameStarted = true;
	};
});