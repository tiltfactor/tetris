var Game = function(sessionEvents) {
	var that = this; //to allow private member functions to access Game object

	_keydowns = [];
	_keyups = [];
	this.pieces = [];
	this.events = [];
	this.curNum = 0;
	this.TOTAL_NUM = 0;
	this.startTime = -1;
	this.endTime = -1;

	_init(sessionEvents);

	function _init(sessionEvents) {
		for (var i = 0, eventsLength = sessionEvents.length; i < eventsLength; i++) {
			//Filter out boards because they take up a lot of space and aren't needed here
			switch (sessionEvents[i].type) {
				case "start":
					that.startTime = sessionEvents[i].timestamp;
					break;
				case "keydown":
					_keydowns.push(sessionEvents[i]);
					break;
				case "keyup":
					_keyups.push(sessionEvents[i]);
					break;
				case "piece":
					that.pieces.push(sessionEvents[i]);
					break;
				case "quit":
					that.endTime = sessionEvents[i].timestamp;
					break;
			}
		}
		_generateEvents();
	}

	//Actions are represented by the index of the action to be called in moves
	function _generateEvents() {
		for (var i = 0, downsLength = _keydowns.length; i < downsLength; i++) {
			var keydownTime = _keydowns[i].timestamp;
			var keycode = _keydowns[i].details;
			var keyupTime;
			for (var j = 0; j < _keyups.length; j++) {
				if (_keyups[j].details == keycode) {
					keyupTime = _keyups.splice(j,1)[0].timestamp;
					break;
				}
			}
			if (keyupTime === undefined) {
				keyupTime = that.endTime;
			}
			var action = getAction(keycode);
			if (action === null) {
				console.log('invalid keycode');
				return;
			}
			_addEvent(keydownTime, action);
			if (action < 4) {
				for (var t = keydownTime + 200; t < keyupTime; t += 100) {
					_addEvent(t, action);
				}
			}
		}

		for (var t = that.startTime + 300; t < that.endTime; t += 300) {
			_addEvent(t, 7);
		}
		that.TOTAL_NUM = that.events.length;
	}

	//Adds event based on timestamp
	function _addEvent(timestamp, action) {
		var evt = {"timestamp": timestamp, "action": action};
		for (var i = 0, eventsLength = that.events.length; i < eventsLength; i++) {
			if (that.events[i].timestamp > timestamp) {
				that.events.splice(i, 0, evt);
				return;
			}
		}
		that.events.splice(that.events.length, 0, evt);
	}

	this.processEvent = function() {
		var evt = this.events[this.curNum];
		moves[evt.action]();
		this.curNum++;

		if (this.curNum < this.TOTAL_NUM - 1) {
			window.setTimeout(processEvent, this.events[this.curNum].timestamp - evt.timestamp);
		}
	}
};

var buttonList = [[37,74],[],[39,76],[40,75],[38,73,88,82],[90,84],[68,32],[],[67],[],[]];
function getAction(keycode) {
	for (var i = 0; i < buttonList.length; i++) {
		for (var j = 0, buttonLength = buttonList[i].length; j < buttonLength; j++) {
			if (keycode == buttonList[i][j]) {
			  return i;
			}
		}
	}
	return null;
}

var games = [];
function createGames(sessionData) {
	var gameSelect = document.getElementById("gameselect");
	for (var i = 0, dataLength = sessionData.length; i < dataLength; i++) {
		var session = sessionData[i];
		games.push(new Game(session.events));

		var gameOption = document.createElement("option");
		gameOption.textContent = session.id;
		gameOption.value = i;
		gameSelect.appendChild(gameOption);
	}
}
createGames(JSON.parse(sessionStorage.getItem("data")));

var game = null;
function selectGame(num) {
	game = games[num];
}
selectGame(0);

function processEvent() {
	var evt = game.events[game.curNum];
	moves[evt.action]();
	game.curNum++;

	if (game.curNum < game.TOTAL_NUM - 1) {
		window.setTimeout(processEvent, game.events[game.curNum].timestamp - evt.timestamp);
	}
}