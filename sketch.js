// sketch.js

let gameState = "play"; // "splash" | "play" | "end"
//
const VIEW_W = 800;
const VIEW_H = 480;

let allLevelsData;
let levelIndex = 0;

let level;
let player;
let cam;

let showSplash = true;

// planet images (globals used by WorldLevel.js)
let earthImg, moonImg, marsImg, saturnImg;

let starBgImg;

let planetBgImg;

function preload() {
  allLevelsData = loadJSON("levels.json");

  earthImg = loadImage("earth.png");
  moonImg = loadImage("moon.png");
  marsImg = loadImage("mars.png");
  saturnImg = loadImage("saturn.png");

  starBgImg = loadImage("yippie.jpeg");
  planetBgImg = loadImage("sad_planet.jpeg");
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  cam = new Camera2D(width, height);
  loadLevel(levelIndex);
}

function loadLevel(i) {
  level = LevelLoader.fromLevelsJson(allLevelsData, i);

  player = new BlobPlayer();
  player.spawnFromLevel(level);

  cam.x = player.x - width / 2;
  cam.y = 0;
  cam.clampToWorld(level.w, level.h);
}

function draw() {
  if (showSplash) {
    // --- SPLASH SCREEN ---
    image(planetBgImg, 0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);

    stroke(0); // black outline
    strokeWeight(6); // thickness of outline
    fill(255); // white text

    textSize(36);
    text("Collect the Star ⭐️", width / 2, height / 2 - 40);

    textSize(27);
    text(
      "You must collect the star from reaching earth. Hurry!",
      width / 2,
      height / 2 + 20,
    );

    textSize(16);
    text("Press SPACE to start", width / 2, height / 2 + 80);
    text("A/D or ←/→ move • W/↑/Space jump", width / 2, height / 2 + 110);

    return; // IMPORTANT: stops the game from running underneath
  }

  if (gameState === "end") {
    drawEndScreen();
    return;
  }

  player.update(level);

  if (player.y - player.r > level.deathY) {
    loadLevel(levelIndex);
    return;
  }

  cam.followSideScrollerX(player, level.camLerp);
  cam.y = 0;
  cam.clampToWorld(level.w, level.h);

  cam.begin();
  level.drawWorld();
  player.draw(level.theme.blob);
  cam.end();

  checkStarCollision(); // ⭐ add this

  // HUD
  fill(0);
  noStroke();
  text(level.name + " (Example 5)", 10, 18);
  text("A/D or ←/→ move • Space/W/↑ jump • Fall = respawn", 10, 36);
  text("camLerp(JSON): " + level.camLerp + "  world.w: " + level.w, 10, 54);
}

function keyPressed() {
  if (showSplash && (key === " " || keyCode === ENTER)) {
    showSplash = false;
    return; // stop other key actions on this press
  }

  if (gameState === "end" && (key === "r" || key === "R")) {
    gameState = "play";
    loadLevel(0);
    return;
  }

  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.tryJump();
  }
  if (key === "r" || key === "R") loadLevel(levelIndex);
}

function checkStarCollision() {
  if (level.star.collected) return;

  const touching =
    dist(player.x, player.y, level.star.x, level.star.y) <
    player.r + level.star.r;

  if (touching) {
    level.star.collected = true;
    gameState = "end";
  }
}

function drawEndScreen() {
  image(starBgImg, 0, 0, width, height);
  textAlign(CENTER, CENTER);

  stroke(0); // black outline
  strokeWeight(6); // thickness of outline
  fill(255); // white text

  textSize(40);
  text("Yippie!!", width / 2, height / 2 - 40);

  textSize(24);
  text("You saved earth from the evil star.", width / 2, height / 2 + 20);

  textSize(16);
  text("Press R to replay", width / 2, height - 50);

  textAlign(LEFT, BASELINE);
}
