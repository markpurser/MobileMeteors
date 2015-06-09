

function update(game, input)
{
	if( StateEnum.Start == game.state )
	{
		game = resetGame();
	}

	if( StateEnum.Playing == game.state )
	{
		game.velocity = updateVelocity(game.velocity, input);
		game.player = updatePlayer(game.player, input);
		game.meteor = updateMeteor(game.meteor);
	}


	game.state = updateState(game.state);

	return game;
}

function updateState(state)
{
	if( StateEnum.Start == state )
	{
		return StateEnum.Playing;
	}

	return StateEnum.Playing;
}

function resetGame()
{
	var velocity = { x:0, y:0 };
	var player = { x:500, y:500, rotation:0, targetx:0, targety:0, alive:true, score:0, lives:3, viewAdd:true, viewRemove:false };
	var meteor = [
				{ x:500, y:500, size:5, speed:5, direction:_.sample([0,90,180,270]), rotation:0, viewAdd:true, viewRemove:false },
				{ x:500, y:100, size:5, speed:3, direction:_.sample([0,90,180,270]), rotation:90, viewAdd:true, viewRemove:false },
				];
	return { state:StateEnum.Start, velocity:velocity, player:player, meteor:meteor, resetView:true };
}

function updateVelocity(velocity, input)
{
}

function updatePlayer(player, input)
{
	var dx = (input.moveTarget.x - player.x);
	var dy = (input.moveTarget.y - player.y);

	var easeTranslation = 0.02;
	player.x += dx * easeTranslation;
	player.y += dy * easeTranslation;

    var easeRotation = 0.2;
	var angle = 180 - (Math.atan2(dx, dy) * 180 / 3.1415);
	player.rotation += (angle - player.rotation) * easeRotation;

	return player;
}

function updateMeteor(meteor)
{
	_.each( meteor, function(m) {
		m.x += Math.sin(m.direction) * m.speed;
		m.y += Math.cos(m.direction) * m.speed;
	});

	return meteor;
}