$(function () {
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    if (firstTimeSetup) {
      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }

    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); // top wall
    createPlatform(-50, canvas.height - 10, canvas.width + 100, 200, "navy"); // bottom wall
    createPlatform(-50, -50, 50, canvas.height + 500); // left wall
    createPlatform(canvas.width, -50, 50, canvas.height + 100); // right wall

    //////////////////////////////////
    // ONLY CHANGE BELOW THIS POINT //
    //////////////////////////////////
    // TODO 1 - Enable the Grid
    toggleGrid();
    // TODO 2 - Create Platforms
    createPlatform(350, 620, 270, 20);
    createPlatform(420, 640, 20, 100);
    createPlatform(700, 200, 250, 20);
    createPlatform(600, 500, 250, 20);
    createPlatform(900, 500, 300, 20);
    createPlatform(100, 180, 200, 20);
    createPlatform(600, 380, 200, 20);
    createPlatform(1225, 500, 50, 150);
    createPlatform(1250, 630, 200, 20);
    // TODO 3 - Create Collectables
    createCollectable("diamond", 450, 700);
    createCollectable("steve", 650, 350);
    createCollectable("max", 1350, 600);
    createCollectable("database", 150, 150);
    // TODO 4 - Create Cannons
    createCannon("left", 540, 2500);
    createCannon("right", 760, 2250);
    createCannon("top", 860, 1550);
    createCannon("left", 190, 1500);
    createCannon("top", 1390, 2700);
    //////////////////////////////////
    // ONLY CHANGE ABOVE THIS POINT //
    //////////////////////////////////
  }
  registerSetup(setup);
});
