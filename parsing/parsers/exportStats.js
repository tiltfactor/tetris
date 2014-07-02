var list = document.getElementById("linklist");
var separators = "";

function createCSV(array) {
	var csv = "";
	for (var i = 0, arrLength = array.length; i < arrLength; i++) {
		var elt = array[i];
		for (var attr in elt) {
			csv += (elt[attr] + separators);
		}
		csv = csv.slice(0, -1);
		csv += "\n";
	}
	return csv;
}

function chooseFunctions(form) {
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
	separators = "";
	var sepBoxes = form.separator;
	for (var i = 0, sboxLength = sepBoxes.length; i < sboxLength; i++) {
		if (sepBoxes[i].checked) {
			separators += sepBoxes[i].value;
		}
	}

	var funcBoxes = form.func;
	var functions = [];
	for (var i = 0, fboxLength = funcBoxes.length; i < fboxLength; i++) {
		if (funcBoxes[i].checked) {
			functions.push(funcBoxes[i].value);
		}
	}
	getStats(functions);
}

function getStats(functions) {
	var sessions = JSON.parse(sessionStorage.getItem("data"));
	for (var i = 0, sessionsLength = sessions.length; i < sessionsLength; i++) {
		var boards = getBoards(sessions[i]);
		var data = {
			id: sessions[i].id,
			boardStats: [functions]
		};
		for (var j = 0, boardsLength = boards.length; j < boardsLength; j++) {
			board = boards[j];
			stats = [];
			for (var k = 0, funcsLength = functions.length; k < funcsLength; k++) {
				stats.push(window[functions[k]](board));
			}
			data.boardStats.push(stats);
		}
		showDownload(data);
	}
}

function getBoards(session) {
	var gameEvents = session.events;
	var boards = [];
	for (var i = 0, eventsLength = gameEvents.length; i < eventsLength; i++) {
		if (gameEvents[i].type == "board") {
			boards.push(gameEvents[i].details);
		}
	}
	return boards;
}

function showDownload(data) {
	var csv = createCSV(data.boardStats);
	var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
	var download = data.id + ".csv";

	var link = document.createElement("a");
	link.href = uri;
	link.download = download;
	link.textContent = download;

	var listItem = document.createElement("li");
	listItem.appendChild(link);
	list.appendChild(listItem);
}

/* Statistics functions
 * Each function should take in a board, and return a value of some sort to be added to the array
 * The returned value should ideally be a number, for purposes of analysis.
 */
var HEIGHT = 24;
var WIDTH = 10;
//Counts number of non-zero cells
function countCells(board) {
	var cells = 0;
	for (var y = 0; y < HEIGHT; y++) {
		for (var x = 0; x < WIDTH; x++) {
			if (board[y][x]) {
				cells++;
			}
		}
	}
	return cells;
}
//Counts number of covered holes
function countHoles(board) {
	var holes = 0;
	for (var x = 0; x < WIDTH; x++) {
		var blockFound = false;
		for (var y = 0; y < HEIGHT; y++) {
			if (blockFound && board[y][x] == 0) {
				holes++;
			} else if (board[y][x]) {
				blockFound = true;
			}
		}
	}
	return holes;
}
//Returns height of highest piece
function highestPiece(board) {
	for (var y = 0; y < HEIGHT; y++) {
		for (var x = 0; x < WIDTH; x++) {
			if (board[y][x]) {
				return HEIGHT - y;
			}
		}
	}
	return 0;
}
//Returns average height of columns
function averageHeight(board) {
	var totalHeight = 0;
	for (var x = 0; x < WIDTH; x++) {
		var colHeight = 0;
		for (var y = 0; y < HEIGHT; y++) {
			if (board[y][x]) {
				colHeight = HEIGHT - y;
				break;
			}
		}
		totalHeight += colHeight
	}
	return totalHeight / WIDTH;
}
