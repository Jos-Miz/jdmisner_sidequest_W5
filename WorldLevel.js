class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme ?? {},
    );

    // Physics knobs
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Camera knob (data-driven view state)
    this.camLerp = levelJson.camera?.lerp ?? 0.12;

    // World size + death line
    this.w = levelJson.world?.w ?? 2400;
    this.h = levelJson.world?.h ?? 360;
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    // Start
    this.start = Object.assign({ x: 80, y: 220, r: 26 }, levelJson.start ?? {});

    this.secrets = levelJson.secrets ?? []; //////

    this.stars = []; ///////
    let spacing = 100; ////////

    for (let x = 0; x < this.w; x += spacing) {
      this.stars.push({
        x: x + random(-60, 30),
        y: random(20, 150),
        size: random(1, 3),
      });
    }

    // Platforms
    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h),
    );
  }

  drawWorld(cam) {
    background(this.theme.bg);

    // --- PARALLAX CLOUDS ---
    // --- PLANETS (slow parallax layer) ---
    push();

    const planetOffset = cam.x * 0.15; // slower than clouds

    image(earthImg, 600 - planetOffset, 50, 180, 180);
    image(moonImg, 1100 - planetOffset, 80, 120, 120);
    image(marsImg, 1600 - planetOffset, 60, 140, 140);
    image(saturnImg, 2100 - planetOffset, 40, 220, 160);

    pop();

    for (const s of this.secrets) {
      //////////
      const onScreen =
        s.x > cam.x &&
        s.x < cam.x + cam.viewW &&
        s.y > cam.y &&
        s.y < cam.y + cam.viewH;

      if (onScreen) {
        const pulse = 2 + sin(frameCount * 0.12) * 2;
        noStroke();
        fill("yellow");
        ellipse(s.x, s.y, 6 + pulse, 6 + pulse);
      }
    } /////////////

    // --- PLATFORMS ---
    push();
    rectMode(CORNER);
    noStroke();
    fill(this.theme.platform);

    for (const p of this.platforms) {
      rect(p.x, p.y, p.w, p.h);
    }

    pop();
  }
}
