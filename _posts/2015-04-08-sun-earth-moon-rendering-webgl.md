---
layout: post
title: Earth and Moon Rendering in WebGL
description:
  A simple rendering of earth and moon in WebGL using three.js. The moon is orbitting around the earth which rotates around its axis.
categories:
- WebGL
tags:
- webgl
- threejs
published: true
---

Open in [page](/webgl/sun-earth-moon-rendering)

<div id="viewer" style="width:100%;height:650px;">
</div>

<script src="/js/three.min.js"></script>
<script src="/js/sun-earth-moon.js"></script>
<script>
  // renderer
  var container = document.getElementById('viewer');
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMapEnabled = true;
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  // scene
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x444444));

  // camera
  var camera = new THREE.PerspectiveCamera(45,
    container.offsetWidth / container.offsetHeight, 1, 10000);
  camera.position.set(0, 0, 5.3333);
  scene.add(camera);

  // earth
  var earth = new THREE.Object3D();
  var earth = new Earth();
  scene.add(earth.object3D);

  // sun
  var sun = new Sun();
  scene.add(sun.object3D);

  var render = function() {
    requestAnimationFrame(render);
    earth.update();
    renderer.render(scene, camera);
  };

  render();
</script>
