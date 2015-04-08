App = {};
App.Object = function() {
  this.object3D = null;
}

App.Object.prototype.init = function() {}

App.Object.prototype.update = function() {}

Earth = function() {
  this.init();
}

Earth.prototype = new App.Object();

Earth.prototype.init = function() {
  this.object3D = new THREE.Object3D;
  this.createGlobe();
  this.createClouds();
  this.createMoon();
}

Earth.prototype.update = function() {
  this.globeMesh.rotation.y += Earth.ROTATION_Y;
  this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;
  this.moon.update();
}

Earth.prototype.createGlobe = function() {
  var surfaceMap = THREE.ImageUtils.loadTexture('/images/earth_surface_2048.jpg');
  var normalMap = THREE.ImageUtils.loadTexture('/images/earth_normal_2048.jpg');
  var specularMap = THREE.ImageUtils.loadTexture('/images/earth_specular_2048.jpg');
  var globeMaterial = new THREE.MeshPhongMaterial({
    map: surfaceMap,
    normalMap: normalMap,
    specularMap: specularMap,
    shininess: 10
  });
  var globeGeometry = new THREE.SphereGeometry(1, 32, 32);
  var globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  globeMesh.rotation.x = Earth.TILT;
  globeMesh.castShadow = true;
  globeMesh.receiveShadow.true;
  this.object3D.add(globeMesh);
  this.globeMesh = globeMesh;
}

Earth.prototype.createClouds = function() {
  var cloudsMap = THREE.ImageUtils.loadTexture('/images/earth_clouds_1024.png');
  var cloudsMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: cloudsMap,
    transparent:true
  });
  var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
  var cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  cloudsMesh.rotation.x = Earth.TILT;
  cloudsMesh.receiveShadow = true;
  this.object3D.add(cloudsMesh);
  this.cloudsMesh = cloudsMesh;
}

Earth.prototype.createMoon = function() {
  var moon = new Moon();
  this.object3D.add(moon.object3D);
  this.moon = moon;
}

Earth.RADIUS = 6371;
Earth.ROTATION_Y = 0.01;
Earth.TILT = 0.41;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.95;

Moon = function() {
  this.init();
}

Moon.prototype = new App.Object();

Moon.prototype.init = function() {
  var moon = new THREE.Object3D();

  // moon mesh
  var moonGeometry = new THREE.SphereGeometry(Moon.SIZE_IN_EARTHS, 32, 32);
  var moonSurfaceMap = THREE.ImageUtils.loadTexture('/images/moon_1024.jpg');
  var moonMaterial = new THREE.MeshPhongMaterial({
    map: moonSurfaceMap,
    ambient:0x888888
  });
  var moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  var distance = Moon.DISTANCE_FROM_EARTH / Earth.RADIUS;
  moonMesh.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));

  // rotate the mesh so it shows its moon-face toward earth
  moonMesh.rotation.y = Math.PI;
  moonMesh.castShadow = true;
  moonMesh.receiveShadow = true;
  moon.add(moonMesh);

  // tilt to the ecliptic
  moon.rotation.x = Moon.INCLINATION;
  this.object3D = moon;
}

Moon.prototype.update = function() {
  this.object3D.rotation.y += (Earth.ROTATION_Y / Moon.PERIOD);
}

Moon.DISTANCE_FROM_EARTH = 356400;
Moon.INCLINATION = 0.089;
Moon.EXAGGERATE_FACTOR = 1.2;
Moon.SIZE_IN_EARTHS = 1 / 3.7 * Moon.EXAGGERATE_FACTOR;
Moon.PERIOD = 28;

Sun = function() {
  this.init();
}

Sun.prototype = new App.Object();

Sun.prototype.init = function() {
  var sun = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
  sun.position.set(-10, 0, 20);
  sun.castShadow = true;
  sun.shadowCameraNear = 1;
  sun.shadowCameraFar = 40;
  sun.shadowCameraFov = 20;
  this.object3D = sun;
}
