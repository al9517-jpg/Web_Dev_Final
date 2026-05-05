let player;
let npcs = [];
let platforms = [];
let currentPlatform = null;
let door = null;
let posX, posY;
let velocityY = 0;
let showHelp = false;
let showCharacters = false;
let characterIndex = 0;
let currentMusic = null;
let speakerCooldown = 0;

let player1Anim = { value: 0 };
let player2Anim = { value: 0 };

let isJumping = false;
let edgeFade = 0;
let room = 0;

const gravity = 1.5;
const jumpPower = 30;
const speed = 7;

let spriteSheet;
let spriteJSON;
let animation = [];
let frameIndex = 0;
//Player2
let player2;
let posX2, posY2;
let velocityY2 = 0;
let isJumping2 = false;
let currentPlatform2 = null;

let baseW = 800;
let baseH = 600;

let scaleFactor;
let offsetX;
let offsetY;

function preload() {
  spriteSheet = loadImage('Squid.png');
  spriteJSON = loadJSON('Squid.json');
  slimeSprite = loadImage('Slime.png')
  slimeJSON = loadJSON('Slime.json')
  parrotSprite = loadImage('Parrot.png')
  parrotJSON = loadJSON('Parrot.json')
  shellSprite = loadImage('Shell.png')
  shellJSON = loadJSON('Shell.json')
  batSprite = loadImage('Bat.png')
  batJSON = loadJSON('Bat.json')
  amberSprite = loadImage('Amber.png')
  amberJSON = loadJSON('Amber.json')
  acornSprite = loadImage('Acorn.png');
  acornJSON = loadJSON('Acorn.json');
  speakerSprite = loadImage('Speaker.png')
  speakerJSON = loadJSON('Speaker.json')
  font = loadFont("Minecraft.ttf")
  backgroundSound1 = loadSound("SoulSanctum.mp3")
  backgroundSound2 = loadSound("Vacation.mp3")
  backgroundSound3 = loadSound("Halland.mp3")
  backgroundSound4 = loadSound("Moon.mp3")
  backgroundSound5 = loadSound("MainTheme.mp3")
  backgroundSound6 = loadSound("Wildfire.mp3")
  Sound1 = loadSound("Chatot.mp3")
  Sound2 = loadSound("Shellder.mp3")
  Sound3 = loadSound("Nuzleaf.mp3")
  Sound4 = loadSound("Goomy.mp3")
  Sound5 = loadSound("Golbat.mp3")
  Sound6 = loadSound("Kricketune.mp3")
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  calculateView();
  player = { w: 50, h: 50 };
  posX = baseW / 2;
  posY = 0;
  player2 = { w: 50, h: 50 };
  posX2 = baseW / 2 + 100;
  posY2 = 0;
  loadRoom(room);
}
function draw() {
  background(0);

  push();

  translate(offsetX, offsetY);
  scale(scaleFactor);

  fill(30);
  rect(0, 0, baseW, baseH);

  handleMovement();
  handleMovementP2();
  applyGravity();
  applyGravityP2();
  handlePlatformCollision();
  handlePlatformCollisionP2();
  movePlatforms();
  handleEdges();
  drawDoor();
  checkDoor();
  handleSpeakerInteraction();
  updateEdgeFade();
  drawPlatforms();
  drawNPCs();


  drawSprite(posX, posY, spriteSheet, spriteJSON, player1Anim);
  drawPlayerIndicator(posX, posY, "P1", color(100, 200, 255));
  drawSprite(posX2, posY2, spriteSheet, spriteJSON, player2Anim);
  drawPlayerIndicator(posX2, posY2, "P2", color(255, 150, 150));

  drawEdgeGradient();

  pop();

  if (showHelp) {
    drawHelpScreen();
  }

  if (showCharacters) {
    drawCharacterViewer();
  }

  if (doorCooldown > 0) doorCooldown--;
}
function drawHelpScreen() {
  push();

  fill(0, 180);
  noStroke();
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(24);

  text(
    "CONTROLS\n\n" +
    "Player 1:\n" +
    "J / L = Move\n" +
    "I = Jump\n" +
    "Player 2:\n" +
    "A / D = Move\n" +
    "W = Jump\n" +
    "E = Enter Door\n\n" +
    "C / N = Character Viewer\n" +
    "Hold ? to view this screen\n" + 
    "G = Talk to Character",
    width / 2,
    height / 2
  );

  pop();
}
function calculateView() {
  let scaleX = width / baseW;
  let scaleY = height / baseH;

  scaleFactor = min(scaleX, scaleY);

  offsetX = (width - baseW * scaleFactor) / 2;
  offsetY = (height - baseH * scaleFactor) / 2;
}
function keyPressed() {
  if (key === '?' || key === '/') {
    showHelp = true;
  }

  if (key === 'c' || key === 'C' || key === 'n' || key === 'N') {
    showCharacters = true;
  }

  if (showCharacters) {
    let total = getAllCharacters().length;

    if (keyCode === RIGHT_ARROW) {
      characterIndex = (characterIndex + 1) % total;
    }

    if (keyCode === LEFT_ARROW) {
      characterIndex = (characterIndex - 1 + total) % total;
    }
  }
}
function keyReleased() {
  if (key === '?' || key === '/') {
    showHelp = false;
  }

  if (key === 'c' || key === 'C' || key === 'n' || key === 'N') {
    showCharacters = false;
  }
}
function getAllCharacters() {
  let chars = [];

  // Player 1
  chars.push({
    type: "player",
    name: "Player 1: Squid",
    description: "\n\n\nThe main player. Uses I/J/L to move. \n The first of the friends. He seeks for his friends in this mysterious place. \n Secretly has stashes of Pokemon cards because why not. \nStop him before he scalps all of the cards and bankrupt the stores.",
    sprite: spriteSheet,
    json: spriteJSON,
    anim: player1Anim,
    npcscale: 3
  });

  // Player 2
  chars.push({
    type: "player",
    name: "Player 2: Octopus",
    description: "\n\n\nThe second player. Uses WASD to move. \n An alternate squid from another dimension because of that door. \n Don't ask why he looks the same. I was too lazy and I was in a time crunch. \n Copy paste the squid, but also add in some racist jokes and gambling addiction.",
    sprite: spriteSheet,
    json: spriteJSON,
    anim: player2Anim,
    npcscale: 3
  });

  npcs.forEach(n => {
    chars.push({
      type: "npc",
      ...n
    });
  });

  return chars;
}
function drawCharacterViewer() {
  let characters = getAllCharacters();
  if (characters.length === 0) return;

  characterIndex = constrain(characterIndex, 0, characters.length - 1);

  let n = characters[characterIndex];

  fill(0, 220);
  noStroke();
  rect(0, 0, width, height);

  let frames = Array.isArray(n.json.frames)
    ? n.json.frames
    : Object.values(n.json.frames);

  let frameData = frames[n.anim.value];
  if (!frameData) return;

  let f = frameData.frame ? frameData.frame : frameData;

  let scale = n.npcscale || 3;
  let drawW = f.w * scale * 2;
  let drawH = f.h * scale * 2;

  let centerX = width / 2;
  let centerY = height / 2 - 60;

  image(
    n.sprite,
    centerX - drawW / 2,
    centerY - drawH / 2,
    drawW,
    drawH,
    f.x,
    f.y,
    f.w,
    f.h
  );

  if (frameCount % 10 === 0) {
    n.anim.value = (n.anim.value + 1) % frames.length;
  }

  fill(255);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(28);
  text(n.name || "Unknown Character", width / 2, height / 2 + 90);
  if (n.type === "player") {
    fill(100, 200, 255);
    textSize(14);
    text("(Player Character)", width / 2, height / 2 + 115);
  }

  textSize(16);
  text(
    n.description || "No description available.",
    width / 2,
    height / 2 + 130
  );

  textSize(12);
  text(
    "<--/ --> to switch    |    Release C / N to close",
    width / 2,
    height - 40
  );

  pop();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateView();
}
function drawEdgeGradient() {
  if (edgeFade <= 0) return;

  let gradientWidth = 200;

  noStroke();

  // LEFT SIDE
  for (let x = 0; x < gradientWidth; x++) {
    let alpha = map(x, 0, gradientWidth, 255 * edgeFade, 0);
    fill(0, alpha);
    rect(x, 0, 1, baseH);
  }

  // RIGHT SIDE
  for (let x = 0; x < gradientWidth; x++) {
    let alpha = map(x, 0, gradientWidth, 255 * edgeFade, 0);
    fill(0, alpha);
    rect(baseW - x, 0, 1, baseH);
  }
}
function handleMovement() {
  let moveX = 0;

  if (keyIsDown(74)) {
    moveX -= 1;
  }
  if (keyIsDown(76)) {
    moveX += 1;
  }

  posX += moveX * speed;

  if (keyIsDown(73) && !isJumping) {
    velocityY = jumpPower;
    isJumping = true;
    currentPlatform = null;
  }
}
function handleMovementP2() {
  let moveX = 0;

  if (keyIsDown(65)) {
    moveX -= 1;
  }
  if (keyIsDown(68)) {
    moveX += 1;
  }

  posX2 += moveX * speed;

  if (keyIsDown(87) && !isJumping2) {
    velocityY2 = jumpPower;
    isJumping2 = true;
    currentPlatform2 = null;
  }
}
function updateEdgeFade() {
  let edgeDistance = 150; 

  // Player 1 fade
  let leftFade1 = map(posX, 0, edgeDistance, 1, 0, true);
  let rightFade1 = map(posX, baseW - edgeDistance, baseW, 0, 1, true);

  // Player 2 fade
  let leftFade2 = map(posX2, 0, edgeDistance, 1, 0, true);
  let rightFade2 = map(posX2, baseW - edgeDistance, baseW, 0, 1, true);

  edgeFade = max(leftFade1, rightFade1, leftFade2, rightFade2);
}
function applyGravity() {
  velocityY -= gravity;
}
function applyGravityP2() {
  velocityY2 -= gravity;
}
function handlePlatformCollision() {
  let nextY = posY + velocityY;
  let landed = false;

  let newPlatform = null;

  platforms.forEach(p => {
    let playerLeft = posX;
    let playerRight = posX + player.w;

    let platformLeft = p.x;
    let platformRight = p.x + p.w;

    let horizontallyAligned =
      playerRight > platformLeft &&
      playerLeft < platformRight;

    if (!horizontallyAligned) return;

    let playerBottom = posY;
    let nextBottom = nextY;

    let platformTop = p.y;

    let falling =
      velocityY <= 0 &&
      playerBottom >= platformTop &&
      nextBottom <= platformTop;

    if (falling) {
      posY = platformTop;
      velocityY = 0;
      isJumping = false;
      landed = true;
      newPlatform = p;
    }
  });

  if (landed) {
    currentPlatform = newPlatform;
    return;
  }

  if (currentPlatform) {
    let p = currentPlatform;

    let stillOnTop =
      posX + player.w > p.x &&
      posX < p.x + p.w &&
      Math.abs(posY - p.y) < 0.1;

    if (stillOnTop) {
      velocityY = 0;
      isJumping = false;

      if (p.moving) {
        posX += p.direction * p.speed;
      }

      return;
    } else {
      currentPlatform = null;
    }
  }

  posY = nextY;

  if (posY <= 0) {
    posY = 0;
    velocityY = 0;
    isJumping = false;
    currentPlatform = null;
  }
}
function handlePlatformCollisionP2() {
  let nextY = posY2 + velocityY2;
  let landed = false;

  let newPlatform = null;

  platforms.forEach(p => {
    let playerLeft = posX2;
    let playerRight = posX2 + player2.w;

    let platformLeft = p.x;
    let platformRight = p.x + p.w;

    let horizontallyAligned =
      playerRight > platformLeft &&
      playerLeft < platformRight;

    if (!horizontallyAligned) return;

    let playerBottom = posY2;
    let nextBottom = nextY;

    let platformTop = p.y;

    let falling =
      velocityY2 <= 0 &&
      playerBottom >= platformTop &&
      nextBottom <= platformTop;

    if (falling) {
      posY2 = platformTop;
      velocityY2 = 0;
      isJumping2 = false;
      landed = true;
      newPlatform = p;
    }
  });

  // If just landed
  if (landed) {
    currentPlatform2 = newPlatform;
    return;
  }

  // Stay attached to platform
  if (currentPlatform2) {
    let p = currentPlatform2;

    let stillOnTop =
      posX2 + player2.w > p.x &&
      posX2 < p.x + p.w &&
      Math.abs(posY2 - p.y) < 0.1;

    if (stillOnTop) {
      velocityY2 = 0;
      isJumping2 = false;

      // Move with platform
      if (p.moving) {
        posX2 += p.direction * p.speed;
      }

      return;
    } else {
      currentPlatform2 = null;
    }
  }

  // Apply falling
  posY2 = nextY;

  // Ground
  if (posY2 <= 0) {
    posY2 = 0;
    velocityY2 = 0;
    isJumping2 = false;
    currentPlatform2 = null;
  }
}
function movePlatforms() {
  platforms.forEach(p => {
    if (p.moving) {
      p.x += p.direction * p.speed;

      if (p.x <= p.minX || p.x >= p.maxX) {
        p.direction *= -1;
      }
    }
  });
}
function loadRoom(r) {
  platforms = [];
  npcs = [];

  if (r === 0) {
    platforms.push({ x: 200, y: 150, w: 200, h: 20, moving: false });
    platforms.push({ x: 500, y: 300, w: 200, h: 20, moving: false });
    npcs.push({
      x: 300,
      y: 140,
      w: 40,
      h: 40,
      sprite: shellSprite,
      json: shellJSON,
      anim: { value: 0 },
      text: "TROMBOOONE!!!",
      altText: "I am a little rock",
      sound: Sound2,
      npcscale: 3,
      name: "Shell",
      description: "\nThe introvert of the friend group.\n Pretty sure that somewhere stashed within the guy, \nthere are 10 missing assignments, \n4 failed exams, and a missing tax return."
    });

    npcs.push({
      x: 400,
      y: 0,
      w: 40,
      h: 40,
      sprite: acornSprite,
      json: acornJSON,
      anim: { value: 0 },
      text: "Press '?' for instructions",
      altText: "Oh cool! You got the controls!",
      sound: Sound3,
      npcscale: 3,
      name: "Acorn",
      description: "Lives in the ground. How is it still alive? Simple. \nIt looks more gopher than any of the gophers themselves."
    });

  }

  if (r === 1) {
    platforms.push({ x: 100, y: 200, w: 250, h: 20, moving: false });

    platforms.push({
      x: 300,
      y: 400,
      w: 200,
      h: 20,
      moving: true,
      direction: 1,
      speed: 2,
      minX: 100,
      maxX: baseW - 200
    });

    npcs.push({
      x: 500,
      y: 0,
      w: 40,
      h: 40,
      sprite: slimeSprite,
      json: slimeJSON,
      anim: { value: 0 },
      text: "0--0 - -- - 0--0",
      altText: "0,0 - ^ 0 >(0)",
      sound: Sound4,
      npcscale: 3,
      name: "Slime",
      description: "Doesn't talk. If so, it's in the form of emoting. \n The seed of life is buried within itself. \n But for now, it struggles containing it."
    });

    npcs.push({
      x: 600,
      y: 400,
      w: 40,
      h: 40,
      sprite: batSprite,
      json: batJSON,
      anim: { value: 0 },
      text: "SOMEONE GOVE ME SHUGAAAAA",
      altText: "NO SHUGAAA? DAMM IT!!!",
      sound: Sound5,
      npcscale: 3,
      name: "Bat",
      description: "Alright who gave the small thing the coke dust? \n As it turns out, he wasn't supposed to be here anyways.\n Can someone get him down please.",
    });
    
    npcs.push({
      x: 200,
      y: 200,
      w: 40,
      h: 40,
      sprite: speakerSprite,
      json: speakerJSON,
      anim: { value: 0 },
      npcscale: 3,

      type: "speaker",

      tracks: [backgroundSound1, backgroundSound2, backgroundSound3, backgroundSound4, backgroundSound5, backgroundSound6],
      trackNames: ["Soul Sanctum", "Extended Vacation", "Minecraft", "The Moon", "Nine Sols", "Wildfire"],
      trackIndex: 0,

      name: "Speaker",
      description: "Wired all over the place, controlling the sounds of the rooms. \nMost think that it was a mistake to give it legs. \nNow the friends must chase it down to change the track.",
      text: "Press G to start/change music"
    });
  }

  if (r === 2) {
    platforms.push({ x: 400, y: 150, w: 300, h: 20, moving: false });

    platforms.push({
      x: 300,
      y: 400,
      w: 200,
      h: 20,
      moving: true,
      direction: 1,
      speed: 2,
      minX: 100,
      maxX: baseW - 200
    });

    npcs.push({
      x: 500,
      y: 0,
      w: 40,
      h: 40,
      sprite: parrotSprite,
      json: parrotJSON,
      anim: { value: 0 },
      text: "Z Z Z Z Z Z",
      altText: "Never Disturb my sleep. EVER!!!",
      sound: Sound1,
      npcscale: 3,
      name: "Parrot",
      description: "A colorful bird who sleeps all the time \n *cuff cuff* like SOMEONE *cuff cuff* \n The more crankier he is, the longer he sleeps."
    });

    npcs.push({
      x: 200,
      y: 0,
      w: 40,
      h: 40,
      sprite: amberSprite,
      json: amberJSON,
      anim: { value: 0 },
      text: ".... . .-.. .--. / --.",
      altText: "Grrrr *dink dink*",
      sound: Sound6,
      npcscale: 3,
      name: "Amber",
      description: "Not the amber, but the bug within it. It got stuck in it somehow. \nThe oldest of the friends as well. The amber taste great with rice and soy sauce."
    });
  }
  createDoor();
}
function handleSpeakerInteraction() {
  if (speakerCooldown > 0) {
    speakerCooldown--;
    return;
  }

  if (!keyIsDown(71)) return;

  npcs.forEach(n => {
    if (n.type !== "speaker") return;

    let d1 = dist(posX, posY, n.x, n.y);
    let d2 = dist(posX2, posY2, n.x, n.y);

    if (d1 < 120 || d2 < 120) {
      if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.stop();
      }

      currentMusic = n.tracks[n.trackIndex];
      currentMusic.loop();

      n.text = "Now playing: " + n.trackNames[n.trackIndex];

      n.trackIndex = (n.trackIndex + 1) % n.tracks.length;

      speakerCooldown = 30; 
    }
  });
}
function handleEdges() {
  const totalRooms = 3;

  function changeRoom(direction, entry) {
    npcs = [];
    room = (room + direction + totalRooms) % totalRooms;
    loadRoom(room);

    if (entry === "right") {
      posX = 50;
      posX2 = 120;
    } else {
      posX = baseW - 150;
      posX2 = baseW - 80;
    }

    posY = 0;
    velocityY = 0;
    isJumping = false;
    currentPlatform = null;

    posY2 = 0;
    velocityY2 = 0;
    isJumping2 = false;
    currentPlatform2 = null;
  }

  // Player 1
  if (posX > baseW) changeRoom(1, "right");
  if (posX < 0) changeRoom(-1, "left");

  // Player 2
  if (posX2 > baseW) changeRoom(1, "right");
  if (posX2 < 0) changeRoom(-1, "left");
}
function drawPlayerIndicator(x, y, label, col = color(255)) {
  push();

  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(12);

  let screenX = x + 25;
  let screenY = baseH - y - 70; 

  fill(0, 150);
  rect(screenX - 15, screenY - 8, 30, 16, 4);
  fill(col);
  text(label, screenX, screenY);

  pop();
}
function drawSprite(x, y, spriteSheet, spriteJSON, frameIndexObj) {
  if (!spriteSheet || !spriteJSON) return;

  let frames = Array.isArray(spriteJSON.frames)
    ? spriteJSON.frames
    : Object.values(spriteJSON.frames);

  let f = frames[frameIndexObj.value].frame;

  let scale = 3;
  let drawW = f.w * scale;
  let drawH = f.h * scale;

  let drawX = x;
  let drawY = baseH - y - drawH;

  image(
    spriteSheet,
    drawX,
    drawY,
    drawW,
    drawH,
    f.x,
    f.y,
    f.w,
    f.h
  );

  if (frames.length > 0 && frameCount % 6 === 0) {
    frameIndexObj.value = (frameIndexObj.value + 1) % frames.length;
  }
}
function drawPlatforms() {
  fill(100, 200, 255);
  platforms.forEach(p => {
    rect(p.x, baseH - p.y, p.w, p.h);
  });
}
function drawNPCs() {
  npcs.forEach(n => {
    if (!n.sprite || !n.json) return;

    let frames = Array.isArray(n.json.frames)
      ? n.json.frames
      : Object.values(n.json.frames);

    let frameData = frames[n.anim.value];
    if (!frameData) return;

    let f = frameData.frame ? frameData.frame : frameData;

    let npcscale = n.npcscale || 2;
    let drawW = f.w * npcscale;
    let drawH = f.h * npcscale;

    let drawX = n.x;
    let drawY = baseH - n.y - drawH;

    image(
      n.sprite,
      drawX,
      drawY,
      drawW,
      drawH,
      f.x,
      f.y,
      f.w,
      f.h
    );

    if (frameCount % 10 === 0) {
      n.anim.value = (n.anim.value + 1) % frames.length;
    }

    let p1CenterX = posX + player.w / 2;
    let p1CenterY = posY + player.h / 2;

    let p2CenterX = posX2 + player2.w / 2;
    let p2CenterY = posY2 + player2.h / 2;

    let npcCenterX = n.x + drawW / 2;
    let npcCenterY = n.y + drawH / 2;

    let d1 = dist(p1CenterX, p1CenterY, npcCenterX, npcCenterY);
    let d2 = dist(p2CenterX, p2CenterY, npcCenterX, npcCenterY);

    if (d1 < 120 || d2 < 120) {
      fill(255);
      textAlign(CENTER);
      textFont(font)
      textSize(14);
      let displayText = n.text;
      if (keyIsDown(71)) { 
        if (!n.hasPlayed) {
          if (n.sound) {
            n.sound.play();
          }
          n.hasPlayed = true;
        }
        displayText = n.altText || n.text;
      } else {
        n.hasPlayed = false; 
      }

      text(displayText, drawX + drawW / 2, drawY - 10);
        }
  });
}
function createDoor() {
  door = {
    w: 50,
    h: 70,
    x: baseW / 2 - 25,
    y: baseH / 2
  };
}
function drawDoor() {
  if (!door) return
  fill(150, 75, 0); 
  rect(door.x, baseH - door.y - door.h, door.w, door.h);
  let textX = door.x + door.w / 2;
  let textY = baseH - door.y - door.h - 10;
  let d1 = dist(posX, posY, door.x, door.y);
  let d2 = dist(posX2, posY2, door.x, door.y);

  if (d1 < 120 || d2 < 120) {
    fill(255, 100, 200);
    textFont(font)
    text("Press E to enter", textX, textY);
  }
}
function checkDoor() {
  if (!door) return;

  function isTouching(px, py, pw, ph) {
    let playerTop = py + ph;
    let playerBottom = py;
    let playerLeft = px;
    let playerRight = px + pw;

    let doorTop = door.y + door.h;
    let doorBottom = door.y;
    let doorLeft = door.x;
    let doorRight = door.x + door.w;

    return (
      playerRight > doorLeft &&
      playerLeft < doorRight &&
      playerTop > doorBottom &&
      playerBottom < doorTop
    );
  }

  let p1Touch = isTouching(posX, posY, player.w, player.h);
  let p2Touch = isTouching(posX2, posY2, player2.w, player2.h);

  if (p1Touch && keyIsDown(69)) {
    handleDoorInteraction();
  }
  if (p2Touch && keyIsDown(69)) {
    handleDoorInteraction();
  }
}
let doorCooldown = 0;
function handleDoorInteraction() {
  if (doorCooldown > 0) return;

  doorCooldown = 60; 

  let destination = prompt("Enter a destination URL (or cancel):");

  if (destination === null || destination.trim() === "") {
    return; 
  }

  if (!destination.startsWith("http")) {
    destination = "https://" + destination;
  }

  window.location.href = destination;
}