var Game = function(boards, canvasTable, numDisplay) {
	this.boards = boards;
	this.TOTAL_NUM = boards.length;
	curNum = 0;

	this.render = function() {
		var board = this.boards[curNum];
		var grid = canvasTable.children[0];
		for (var y = 0; y < 24; y++) {
			for (var x = 0; x < 10; x++) {
				grid.children[y].children[x].style.backgroundColor = Game.colors[board[10 * y + x]];
			}
		}
		numDisplay.textContent = curNum;
	};
	this.setCurNum = function(num) {
		if (num < 0) {
			this.curNum = 0;
		} else if (num >= boards.length) {
			curNum = this.TOTAL_NUM - 1;
		} else {
			curNum = num;
		}
		this.render();
	};
	this.getCurNum = function(num) {
		return curNum;
	};
	this.addCurNum = function(num) {
		this.setCurNum(curNum + num);
	};
};
Game.colors = ["#999","#F00","#0F0","#22F","#F0F", "#FF0","#F70","#0EE"];

var games = [];
function createGames(sessionData) {
	var canvasTable = document.getElementById("canvastable");
	var numDisplay = document.getElementById("numdisplay");
	var gameSelect = document.getElementById("gameselect");
	for (var i = 0, dataLength = sessionData.length; i < dataLength; i++) {
		var gameEvents = sessionData[i].events;
		var boards = [];
		for (var j = 0, eventsLength = gameEvents.length; j < eventsLength; j++) {
			if (gameEvents[j].type == "board") {
				boards.push(gameEvents[j].details);
			}
		}
		games.push(new Game(boards, canvasTable, numDisplay));
		var gameOption = document.createElement("option");
		gameOption.textContent = i;
		gameOption.value = i;
		gameSelect.appendChild(gameOption);
	}
}
createGames(JSON.parse(sessionStorage.getItem("data")));

var game = null;
function selectGame(num) {
	game = games[num];
	game.setCurNum(0);
}
selectGame(0);
