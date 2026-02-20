class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "yellow" },
      levelJson.theme ?? {},
    );

    // Physics
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Camera lerp
    this.camLerp = levelJson.camera?.lerp ?? 0.12;

    // World size + death
    this.w = levelJson.world?.w ?? 2400;
    this.h = levelJson.world?.h ?? 360;
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    // Start
    this.start = Object.assign({ x: 80, y: 220, r: 26 }, levelJson.start ?? {});

    // Platforms
    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h),
    );

    this.goal = { x: this.w - 140, y: 320, r: 18 }; // move y if needed
    this.star = { x: this.w - 140, y: 280, r: 20, collected: false }; // ⭐ pickup

    // --- STARS (generated once) ---
    this.stars = [];
    for (let i = 0; i < 180; i++) {
      this.stars.push({
        x: random(0, this.w),
        y: random(0, 200),
        r: random(1, 3),
      });
    }
  }

  drawWorld() {
    background(this.theme.bg);

    // --- STARS ---
    push();
    noStroke();

    for (const s of this.stars) {
      const tw = sin(frameCount * 0.05 + s.x) * 0.5 + 0.5;
      fill("yellow");
      drawStar(s.x, s.y, s.r + tw * 2);
    }

    pop();

    // --- PLANETS IN SKY (repeat pattern, parallax) ---
    push();
    tint(255, 190);

    const skyOffset = cam.x * 0.3; // parallax speed
    const spacing = 520; // distance between planets

    for (let i = 0; i < 8; i++) {
      const cx = i * spacing - (skyOffset % spacing);
      const cy = 70 + sin(i * 2) * 20;

      let img = earthImg;
      let w = 220;

      const t = i % 4;
      if (t === 0) {
        img = earthImg;
        w = 240;
      }
      if (t === 1) {
        img = moonImg;
        w = 180;
      }
      if (t === 2) {
        img = marsImg;
        w = 210;
      }
      if (t === 3) {
        img = saturnImg;
        w = 320;
      }

      const h = w * (img.height / img.width); // keep aspect ratio
      image(img, cx, cy, w, h);
    }

    noTint();
    pop();

    // --- PLATFORMS ---
    push();
    rectMode(CORNER);
    noStroke();
    fill(this.theme.platform);
    for (const p of this.platforms) rect(p.x, p.y, p.w, p.h);
    pop();

    // --- STAR PICKUP ---
    if (!this.star.collected) {
      push();
      textSize(42);
      textAlign(CENTER, CENTER);
      text("⭐", this.star.x, this.star.y);
      pop();
    }
  }
}

function drawStar(x, y, radius) {
  push();
  translate(x, y);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = (TWO_PI * i) / 10;
    let r = i % 2 === 0 ? radius : radius * 0.4;
    vertex(cos(angle) * r, sin(angle) * r);
  }
  endShape(CLOSE);
  pop();
}
