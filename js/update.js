

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
		gunfireCollisions = getGunfireCollisions(game.meteor, game.gunfire);
		game.meteor = processGunfireCollisions(gunfireCollisions, game.meteor);

		if( getPlayerCollisions(game.player, game.meteor) )
		{
			game.halt = true;
		}
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
				{ x:Math.random()*1600-800, y:Math.random()*1600-800, size:3, speed:1, direction:Math.random()*Math.PI*2, rotation:0, rotationSpeed:-0.5, viewAdd:true, viewRemove:false },
				{ x:Math.random()*1600-800, y:Math.random()*1600-800, size:3, speed:2, direction:Math.random()*Math.PI*2, rotation:90, rotationSpeed:0.8, viewAdd:true, viewRemove:false },
				{ x:Math.random()*1600-800, y:Math.random()*1600-800, size:3, speed:2, direction:Math.random()*Math.PI*2, rotation:180, rotationSpeed:0.2, viewAdd:true, viewRemove:false },
				];
	var gunfire = [];
	return { state:StateEnum.Start, velocity:velocity, player:player, meteor:meteor, gunfire:gunfire, resetView:true };
}

function updateVelocity(velocity, input)
{
	if( input.move )
	{
		velocity.x = input.location.x * 0.1;
		velocity.y = input.location.y * 0.1;
	}
	else
	{
		velocity.x *= 0.9;
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
		if( m.x >= 1024 ) m.x -= 2047;
		if( m.x <= -1024) m.x += 2047;
		if( m.y >= 1024 ) m.y -= 2047;
		if( m.y <= -1024) m.y += 2047;
		m.rotation += m.rotationSpeed;
	});

	return meteor;
}

function updateGunfire(gunfire, player, velocity, input)
{
	if( input.blast )
	{
		gunfire.push({ x:player.x, y:player.y, direction:input.direction, life:2, viewAdd:true, viewRemove:false });
		input.blast = false;
	}

	_.each( gunfire, function(g) {
		var speed = 20;
		g.x += Math.sin(g.direction) * speed;
		g.y += Math.cos(g.direction) * speed;
		g.x -= velocity.x;
		g.y -= velocity.y;
		if( g.x >= 1024 ) g.x -= 2047;
		if( g.x <= -1024) g.x += 2047;
		if( g.y >= 1024 ) g.y -= 2047;
		if( g.y <= -1024) g.y += 2047;
		g.life -= input.delta;
		if( g.life <= 0 )
		{
			g.viewRemove = true;
		}
	});

	return gunfire;
}

function getGunfireCollisions(meteor, gunfire)
{
	collisions = [];

	_.each( meteor, function(m) {

		if(m.viewObject) {
			var bounds = m.viewObject.getBounds();
			mleft = m.x - bounds.width/4;
			mright = m.x + bounds.width/4;
			mtop = m.y - bounds.height/4;
			mbottom = m.y + bounds.height/4;

			_.each( gunfire, function(g) {
				if(g.x > mleft && g.x < mright && g.y > mtop && g.y < mbottom) {
					collisions.push({ meteor:m, gunfire:g });
				}
			});
		}

	});

	return collisions;
}

function processGunfireCollisions(collisions, meteor)
{
	_.each( collisions, function(c) {

		c.meteor.viewRemove = true;
		c.gunfire.viewRemove = true;

		if( c.meteor.size > 1 )
		{
			meteor.push({ x:c.meteor.x, y:c.meteor.y, size:c.meteor.size-1, speed:c.meteor.speed+1, direction:Math.random()*Math.PI*2, rotation:0, rotationSpeed:-0.5, viewAdd:true, viewRemove:false })
			meteor.push({ x:c.meteor.x, y:c.meteor.y, size:c.meteor.size-1, speed:c.meteor.speed+1, direction:Math.random()*Math.PI*2, rotation:0, rotationSpeed:-0.5, viewAdd:true, viewRemove:false })
			meteor.push({ x:c.meteor.x, y:c.meteor.y, size:c.meteor.size-1, speed:c.meteor.speed+1, direction:Math.random()*Math.PI*2, rotation:0, rotationSpeed:-0.5, viewAdd:true, viewRemove:false })
		}
	});

	return meteor;
}

function getPlayerCollisions(player, meteor)
{
	collision = false;

	_.each( meteor, function(m) {

		if(m.viewObject) {
			var bounds = m.viewObject.getBounds();
			mleft = m.x - bounds.width/4;
			mright = m.x + bounds.width/4;
			mtop = m.y - bounds.height/4;
			mbottom = m.y + bounds.height/4;

			if(player.x > mleft && player.x < mright && player.y > mtop && player.y < mbottom) {
				collision = true;
			}
		}

	});

	return collision;
}

