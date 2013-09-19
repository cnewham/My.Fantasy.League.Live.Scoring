var player = function(id, name, position, team, points, remaining) {
	var self = this;

	self.id = id;
	self.name = name;
	self.position = position;
	self.team = team;

	self.points = ko.observable(points);
	self.remaining = ko.observable(remaining);

	self.status = ko.computed(function() {
		
		if (self.remaining() == 3600) //yet to play
			return 0;
		if (self.remaining() > 0 && self.remaining() < 3600) //Currently playing
			return 1;

		return 2; //Finished playing
	});

	self.displayName = ko.computed(function() {
		return self.name + " " + self.team + " " + self.position;
	});

};

var franchise = function(id, name, players) {
	var self = this;

	self.id = id;
	self.name = name;
	self.players = ko.observableArray(players);

	self.total = ko.computed(function() {
		var total = 0;
		ko.utils.arrayForEach(self.players(), function(player)
		{
			total += parseFloat(player.points());
		});

		return total.toFixed(2);
	});

	self.remaining = ko.computed(function() {
		var remaining = 0;
		ko.utils.arrayForEach(self.players(), function(player)
		{
			remaining += parseFloat(player.remaining());
		});

		return (remaining / 60).toFixed(0);
	});

};

var matchup = function(franchises) {
	var self = this;

	self.franchises = ko.observableArray(franchises);;

	self.winningId = ko.computed(function() {
		var max = 0;
		var id = 0;

		ko.utils.arrayForEach(self.franchises(), function(franchise)
		{
			var item = parseInt(franchise.total());

			if (item > max);
			{
				id = franchise.id;
				max = item;
			}
		});

		return id;
	});
};

var MyFantasyLeagueViewModel = function(matchups) {
	this.matchups = ko.observableArray(matchups);

	ko.bindingHandlers.highlightScore = {
		initialized: false,
		init: function(element, valueAccessor) {

		},
	    update: function(element, valueAccessor) {
	    	var self = this;
			var value = valueAccessor()

			var valueUnwrapped = ko.unwrap(value);

			if (self.initialized)
				$(element).addClass(highlightClass).removeClass(highlightClass, refreshInterval);

			self.initialized = true;
	    }
	};

};