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
	$('#level-title').text(`level: ${level}`);
	const randomColor = buttonColors[Math.floor(Math.random() * 4)];
	gamePattern.push(randomColor);
	for (const color of gamePattern) {
		$(`#${color}`).fadeOut(100).fadeIn(100);
		makeSound(color);
		await pause(500);
	}
};

const makeSound = name => {
	const sound = new Audio(`sounds/${name}.mp3`);
	sound.play();
};

const animatePress = name => {
	$(`#${name}`).addClass('pressed');
	setTimeout(() => {
		$(`#${name}`).removeClass('pressed');
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
		$('body').addClass('game-over');
		setTimeout(() => {
			$('body').removeClass('game-over');
		}, 200);
		$('#level-title').text('Game Over, Press Any Key to Restart');
		restart();
	};
};

$('.btn').click(event => {
	const userChosenColor = $(event.target).attr('id');
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
});

$(document).keydown(() => {
	if (!gameStarted) {
		userClickedPattern = [];
		nextSequence();
		gameStarted = true;
	};
});