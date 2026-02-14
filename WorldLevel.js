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

    image(earthImg, 600 - planetOffset, 40, 180, 180);
    image(moonImg, 1200 - planetOffset, 70, 120, 120);
    image(saturnImg, 1800 - planetOffset, 30, 220, 160);
    image(marsImg, 2400 - planetOffset, 70, 220, 120);

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
        fill("black");
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
