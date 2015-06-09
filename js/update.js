

function update(game, input)
{
	if( StateEnum.Start == game.state )
	{
		game = resetGame();
	}

	if( StateEnum.Playing == game.state )
	{
		game.velocity = updateVelocity(game.velocity, input);
		game.player = updatePlayer(game.player, game.velocity);
		game.meteor = updateMeteor(game.meteor, game.velocity);
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
				{ x:0, y:0, size:5, speed:1, direction:_.sample([0,90,180,270]), rotation:0, rotationSpeed:-0.5, viewAdd:true, viewRemove:false },
				{ x:0, y:0, size:5, speed:2, direction:_.sample([0,90,180,270]), rotation:90, rotationSpeed:0.8, viewAdd:true, viewRemove:false },
				];
	return { state:StateEnum.Start, velocity:velocity, player:player, meteor:meteor, resetView:true };
}

function updateVelocity(velocity, input)
{
	if( input.thrustTarget.x != 0 )
	{
		velocity.x = input.thrustTarget.x * 0.1;
	}
	else
	{
		velocity.x *= 0.9;
	}
	if( input.thrustTarget.y != 0 )
	{
		velocity.y = input.thrustTarget.y * 0.1;
	}
	else
	{
		velocity.y *= 0.9;
	}

	return velocity;
}

function updatePlayer(player, velocity)
{
	var dx = velocity.x;
	var dy = velocity.y;

    var easeRotation = 0.2;
	var angle = 180 - (Math.atan2(dx, dy) * 180 / 3.1415);
	player.rotation += (angle - player.rotation) * easeRotation;

	return player;
}

function updateMeteor(meteor, velocity)
{
	_.each( meteor, function(m) {
		m.x += Math.sin(m.direction) * m.speed;
		m.y += Math.cos(m.direction) * m.speed;
		m.x -= velocity.x;
		m.y -= velocity.y;
		if( m.x >= 512 ) m.x -= 1023;
		if( m.x <= -512) m.x += 1023;
		if( m.y >= 512 ) m.y -= 1023;
		if( m.y <= -512) m.y += 1023;
		m.rotation += m.rotationSpeed;
	});

	return meteor;
}