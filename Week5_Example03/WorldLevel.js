class WorldLevel {
  constructor(json) {
    // Keep the raw json around (useful for debugging / teaching)
    this.schemaVersion = json.schemaVersion ?? 1;

    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;

    // Background color as [r,g,b]
    this.bg = json.world?.bg ?? [235, 235, 235];

    // Grid step (spacing between lines)
    this.gridStep = json.world?.gridStep ?? 160;

    // Obstacles: list of rects
    this.obstacles = json.obstacles ?? [];
  }

  drawBackground() {
    background(220);
  }

  // Draw the world in WORLD coordinates (caller should translate camera first)
  drawWorld() {
    // World “paper”
    noStroke();
    fill(this.bg[0], this.bg[1], this.bg[2]);
    rect(0, 0, this.w, this.h);

    // Grid
    stroke(245);
    for (let x = 0; x <= this.w; x += this.gridStep) line(x, 0, x, this.h);
    for (let y = 0; y <= this.h; y += this.gridStep) line(0, y, this.w, y);

    // Obstacles
    noStroke();
    fill(170, 190, 210);
    for (const o of this.obstacles) {
      rect(o.x, o.y, o.w, o.h, o.r ?? 0);
    }
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(20);
    text("Example 3 — JSON world. WASD/Arrows. Press R to reset.", 12, 20);
    text(
      "Player(world): " +
        (player.x | 0) +
        ", " +
        (player.y | 0) +
        "   Cam(world): " +
        (camX | 0) +
        ", " +
        (camY | 0),
      12,
      40,
    );
  }
}
