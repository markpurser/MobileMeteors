

function update(game, input)
{
	if( StateEnum.Start == game.state )
	{
		game = resetGame();
	}

	if( StateEnum.Playing == game.state )
	{
		game.velocity = updateVelocity(game.velocity, input);
		game.player = updatePlayer(game.player, game.velocity, input);
		game.meteor = updateMeteor(game.meteor, game.velocity);
		game.gunfire = updateGunfire(game.gunfire, game.player, game.velocity, input);
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
	var player = { x:0, y:0, rotation:0, direction:0, targetx:0, targety:0, alive:true, score:0, lives:3, viewAdd:true, viewRemove:false };
	var meteor = [
				{ x:0, y:0, size:5, speed:1, direction:_.sample([0,Math.PI*.5,Math.PI,Math.PI*1.5]), rotation:0, rotationSpeed:-0.5, viewAdd:true, viewRemove:false },
				{ x:0, y:0, size:5, speed:2, direction:_.sample([0,Math.PI*.5,Math.PI,Math.PI*1.5]), rotation:90, rotationSpeed:0.8, viewAdd:true, viewRemove:false },
				];
	var gunfire = [];
	return { state:StateEnum.Start, velocity:velocity, player:player, meteor:meteor, gunfire:gunfire, resetView:true };
}

function updateVelocity(velocity, input)
{
	if( input.location.x != 0 && !input.isBlasting )
	{
		velocity.x = input.location.x * 0.1;
	}
	else
	{
		velocity.x *= 0.9;
	}
	if( input.location.y != 0 && !input.isBlasting )
	{
		velocity.y = input.location.y * 0.1;
	}
	else
	{
		velocity.y *= 0.9;
	}

	return velocity;
}

function updatePlayer(player, velocity, input)
{
  var easeRotation = 0.2;
	player.direction = 180 - (input.direction * 180 / Math.PI);
	player.rotation += (player.direction - player.rotation) * easeRotation;

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

function updateGunfire(gunfire, player, velocity, input)
{
  if( input.isBlasting )
  {
  	gunfire.push({ x:player.x, y:player.y, direction:input.direction, life:2, viewAdd:true, viewRemove:false });
  }

	_.each( gunfire, function(g) {
		var speed = 5;
		g.x += Math.sin(g.direction) * speed;
		g.y += Math.cos(g.direction) * speed;
		g.x -= velocity.x;
		g.y -= velocity.y;
		if( g.x >= 512 ) g.x -= 1023;
		if( g.x <= -512) g.x += 1023;
		if( g.y >= 512 ) g.y -= 1023;
		if( g.y <= -512) g.y += 1023;
		g.life -= input.delta;
		if( g.life <= 0 )
		{
			g.viewRemove = true;
		}
	});

	return gunfire;
}
