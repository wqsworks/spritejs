'use strict';

var _spritejs = spritejs,
    Scene = _spritejs.Scene,
    Path = _spritejs.Path,
    Matter = _spritejs.Matter;
(function () {
  // module aliases
  var Engine = Matter.Engine,
      World = Matter.World,
      Composites = Matter.Composites,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies;

  // create an engine

  var engine = Engine.create();
  // engine.world.gravity.scale = 0; //turn off gravity (it's added back in later)

  var stackA = Composites.stack(100, 100, 6, 6, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 15, 15, {
      // friction: 0,
      // frictionAir: 0,
      // frictionStatic: 0,
      // restitution: 1
    });
  });

  var wall = Bodies.rectangle(400, 300, 500, 20, {
    isStatic: true
  });

  World.add(engine.world, [stackA, wall]);

  var offset = 5;
  World.add(engine.world, [Bodies.rectangle(400, -offset, 800 + 2 * offset, 50, {
    isStatic: true
  }), Bodies.rectangle(400, 600 + offset, 800 + 2 * offset, 50, {
    isStatic: true
  }), Bodies.rectangle(800 + offset, 300, 50, 600 + 2 * offset, {
    isStatic: true
  }), Bodies.rectangle(-offset, 300, 50, 600 + 2 * offset, {
    isStatic: true
  })]);

  var scene = new Scene('#simple-demo', { resolution: [800, 600] });
  var fglayer = scene.layer('fglayer');

  var blocks = [];

  function render() {
    Engine.update(engine, 16);
    var bodies = Composite.allBodies(engine.world);
    // console.log(bodies)
    for (var i = 0; i < bodies.length; i++) {
      var body = bodies[i],
          vertices = body.vertices,
          position = body.position,
          angle = body.angle;
      var _vertices$ = vertices[0],
          x0 = _vertices$.x,
          y0 = _vertices$.y;

      var d = 'M' + x0 + ',' + y0;
      for (var j = 1; j < vertices.length; j++) {
        var x = vertices[j].x,
            y = vertices[j].y;
        d += 'L' + x + ',' + y;
      }
      d += 'z';
      var path = blocks[i];
      if (!path) {
        path = new Path();
        path.attr({
          anchor: 0.5,
          path: { d: d, trim: true },
          pos: [position.x, position.y],
          rotate: 180 * angle / Math.PI,
          // strokeColor: 'black',
          fillColor: body.render.fillStyle
        });
        blocks[i] = path;
        fglayer.append(path);
      } else {
        path.attr({
          pos: [position.x, position.y],
          rotate: 180 * angle / Math.PI
        });
      }
    }
    window.requestAnimationFrame(render);
  }

  render();
})();(function () {
  var scene = new Scene('#render-demo', { resolution: [800, 600] });
  var fglayer = scene.layer('fglayer');

  var Engine = Matter.Engine,
      World = Matter.World,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Common = Matter.Common,
      Composites = Matter.Composites,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Bodies = Matter.Bodies;

  // create engine

  var engine = Engine.create(),
      world = engine.world;

  // create renderer
  var render = Render.create({
    layer: fglayer,
    engine: engine,
    options: {
      showAngleIndicator: true,
      background: '#fff',
      wireframes: false
    }
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  var stack = Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
    var sides = Math.round(Common.random(1, 8));

    // triangles can be a little unstable, so avoid until fixed
    sides = sides === 3 ? 4 : sides;

    // round the edges of some bodies
    var chamfer = null;
    if (sides > 2 && Common.random() > 0.7) {
      chamfer = {
        radius: 10
      };
    }

    var width = 64;
    switch (Math.round(Common.random(0, 1))) {
      case 0:
        if (Common.random() < 0.6) {
          return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), { chamfer: chamfer });
        } else if (Common.random() < 0.8) {
          return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), { chamfer: chamfer });
        }

        return Bodies.rectangle(x, y, width, width, {
          chamfer: chamfer,
          render: {
            sprite: {
              attrs: {
                textures: {
                  src: 'https://p5.ssl.qhimg.com/t01bd0523f7bc9241c2.png',
                  srcRect: [32, 32, 64, 64]
                },
                size: [width, width]
              }
            }
          }
        });
      case 1:
        return Bodies.polygon(x, y, sides, Common.random(25, 50), { chamfer: chamfer });
      default:
        break;
    }
  });

  World.add(world, stack);

  World.add(world, [
  // walls
  Bodies.rectangle(400, 0, 800, 50, { isStatic: true }), Bodies.rectangle(400, 600, 800, 50, { isStatic: true }), Bodies.rectangle(800, 300, 50, 600, { isStatic: true }), Bodies.rectangle(0, 300, 50, 600, { isStatic: true })]);

  // add mouse control
  var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;
})();