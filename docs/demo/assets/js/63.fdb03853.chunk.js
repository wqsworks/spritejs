(window.webpackJsonp=window.webpackJsonp||[]).push([[63],{538:function(n,e,t){"use strict";t.r(e),e.default="const {Scene} = spritejs;\nconst {Cylinder, Sphere, Cube, shaders} = spritejs.ext3d;\nconst container = document.getElementById('container');\nconst scene = new Scene({\n  container,\n  displayRatio: 2,\n});\nconst layer = scene.layer3d('fglayer', {\n  directionalLight: [1, 0, 0, 0.5],\n  pointLightColor: `hsl(${Math.floor(360 * Math.random())}, 50%, 50%)`,\n  pointLightPosition: [5, 3, 6],\n  camera: {\n    fov: 35,\n  },\n});\n\nlayer.camera.attributes.pos = [5, 3, 6];\nlayer.camera.lookAt([0, 0, 0]);\n\nconst program = layer.createProgram({\n  ...shaders.NORMAL_GEOMETRY,\n  cullFace: null,\n  uniforms: {\n    lighting: {value: [0.3, 0.8, 0.6, 0.1]},\n  },\n});\n\nconst cylinder = new Cylinder(program);\ncylinder.attributes.pos = [0, 1.3, 0];\nlayer.append(cylinder);\ncylinder.animate([\n  {rotateY: 0},\n  {rotateY: -360},\n], {\n  duration: 10000,\n  iterations: Infinity,\n});\n\nconst sphere = new Sphere(program);\nsphere.attr({\n  phiLength: Math.PI,\n});\nlayer.append(sphere);\nsphere.animate([\n  {rotateY: 0},\n  {rotateY: -360},\n], {\n  duration: 7500,\n  iterations: Infinity,\n});\n\nconst cube = new Cube(program);\ncube.attributes.pos = [0, -1.3, 0];\nlayer.append(cube);\ncube.animate([\n  {rotateY: 0},\n  {rotateY: -360},\n], {\n  duration: 5000,\n  iterations: Infinity,\n});\n\nlayer.setRaycast();\n\nlayer.addEventListener('click', (evt) => {\n  if(evt.target === cube) {\n    const colors = [];\n    for(let i = 0; i < 3; i++) {\n      const randomColor = `hsl(${Math.floor(360 * Math.random())}, 50%, 50%)`;\n      colors.push(randomColor, randomColor);\n    }\n    evt.target.attributes.colors = colors;\n  } else if(evt.target !== layer) {\n    evt.target.attributes.colors = `hsl(${Math.floor(360 * Math.random())}, 50%, 50%)`;\n  }\n});"}}]);