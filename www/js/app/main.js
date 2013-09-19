var week = '';
var id = 77067;
var refreshInterval = 1000 * 60; //1 minute
var highlightClass = "default";

var leagueData;
var activePlayers = [];

var output = {
	write : function(message) { 
		var write = $('#write');

		var out = new Date().toLocaleTimeString() + " : " + message;

		write.prepend("<li>" + out + "</li>");
		//$('#console').scrollTop(write.height());
	},
	clear : function() {
		$('#write li').remove();
	}
};

// Entry point. this is where it all goes down
$(function() {
	initialize(function(){
		highlightClass = "score";

		processUpdates();
	});	
});

function processUpdates() {
	setInterval(function () {
		$.ajax({
	        type: "GET",
	        url: "LiveScores.php",
	        data: { id: id, week: week },
	        dataType: "json",

	        error: function (xhr) {
	        	console.error("An error occured: " + xhr.status + " " + xhr.statusText);
	        },
	        success: function (result) {
	        	output.write("Updating scores")	        	

	    		$.each(result.liveScoring.matchup, function(index, value) {
					$.each(value.franchise, function(index, value) {
						$.each(value.players.player, function(index, value) {
						
							var player = getActivePlayer(value.id);

							if (player != null)
							{		
								player.remaining(value.gameSecondsRemaining);
								player.points(value.score);
							}	
				
						});
					});
			    });
	        }
	    });

		//TESTING
		//output.write("processUpdate() executed");

		// var player = activePlayers[Math.floor((Math.random()*activePlayers.length)+1)];

		// if (player != null)
		// 	player.points(player.points() + 1);

	}, refreshInterval);
};

function initialize(callback) {
	output.clear();
	output.write("Connecting to MyFantasyLeague.com...")

	$('#loader').show();
	$('#matchups').hide();

	$.getJSON('js/app/league.json', function(league) {
		leagueData = league;

	    $.ajax({
	        type: "GET",
	        url: "LiveScores.php",
	        data: { id: id, week: week },
	        dataType: "json",

	        complete: function () {
	        	$('#matchups').show();
        		$('#loader').hide();
	        },
	        success: function (result) {
	        	output.write("Updating matchups")	        	
	        	var matchups = [];

	    		$.each(result.liveScoring.matchup, function(index, value) {
					var franchises = [];

					$.each(value.franchise, function(index, value) {
						var players = [];

						$.each(value.players.player, function(index, value) {
							
							if (value.status == "starter")
							{
								var newPlayer = getPlayerData(value.id, value.score, value.gameSecondsRemaining);

								activePlayers.push(newPlayer);
								players.push(newPlayer);
							}
						});

						franchises.push(getFranchiseData(value.id, players));
					});
	    			
	    			matchups.push(new matchup(franchises));
			    });

				ko.applyBindings(new MyFantasyLeagueViewModel(matchups));
				callback();
	        }
	    });
	});
};

function getFranchiseData(id, players) {
	for (var i = 0; i < leagueData.franchises.length; i++)
	{
		if (leagueData.franchises[i].id == id)
			return new franchise(id, leagueData.franchises[i].name, players);
	}

	return new franchise(id, "N/A", players)
};

function getPlayerData(id, points, remaining) {
	for (var i = 0; i < leagueData.players.player.length; i++)
	{
		if (leagueData.players.player[i].id == id)
		{
			var match = leagueData.players.player[i];
			return new player(id, match.name, match.position, match.team, points, remaining);
		}
	}

	return new player(id, "N/A", "N/A", "N/A");
};

function getActivePlayer(id) {

	for (var i = 0; i < activePlayers.length; i++)
	{
		if (activePlayers[i].id == id)
		{
			return activePlayers[i];
		}
	}

	return null;
};
