var list = document.getElementById("linklist");
function createCSV(array) {
	var csv = "";
	for (var i = 0, arrLength = array.length; i < arrLength; i++) {
		var elt = array[i];
		for (var attr in elt) {
			csv += (elt[attr] + "\t");
		}
		csv = csv.slice(0, -1);
		csv += "\n";
	}
	return csv;
}

function chooseFunctions(form) {
	var checkboxes = form.func;
	var functions = [];
	for (var i = 0, cboxLength = checkboxes.length; i < cboxLength; i++) {
		if (checkboxes[i].checked) {
			functions.push(checkboxes[i].value);
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
			boardStats: []
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
function countCells(board) {
	//Counts number of non-zero cells
	var cells = board.filter(function(val) {
		return val;
	}).length;
	return cells;
}