window.onload = () => initGrid();

/* Constants & Variables */
const grid = document.querySelector(".grid");
const colorPicker = document.querySelector(".color--picker");
const randomColorButton = document.querySelector(".random");
const filler = document.createElement("button");
filler.classList.add("filler");
filler.textContent = "Fill";
randomColorButton.after(filler);
const eraser = document.querySelector(".eraser");
const clearButton = document.querySelector(".clear");
const sizeSlider = document.querySelector('input[name="size--slider"]');
const sizeSliderLabel = document.querySelector('label[for="size--slider"]');
const settings = document.querySelector(".settings");
const DEFAULT_SIZE = 16;
let gridArray;
let size = DEFAULT_SIZE;
let penColor = "#333333";
let mouseDown = false;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let mousePosition = { x: 0, y: 0 };
let canvasInitialized = false;

/* EventListeners */

// Toggleswitch for mode
const toggleSwitch = document.querySelector("input[type=checkbox]");
toggleSwitch.addEventListener('change', () => {
  if (toggleSwitch.checked) {
    initCanvas();
    document.querySelector(".switch--description").textContent = "Paint mode";
    filler.remove();
  } else {
    uninitCanvas();
    if (canvasInitialized) {
      initGridCellListeners();
    } 
    randomColorButton.after(filler);
    document.querySelector(".switch--description").textContent = "Pixel mode";
  }
  filler.classList.remove("active");
});

// Draw on grid
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function draw(e) {
  if (e.type === "mouseover" && !mouseDown) {
    return;
  }
  if (filler.classList.contains("active")) {
    fill(e.target);
  } else {
    e.target.style.backgroundColor = penColor;
  }
}

// Pick color
colorPicker.addEventListener("input", (e) => {
  penColor = e.target.value;
});
colorPicker.onchange = function () {
  colorPicker.value = colorPicker.value;
};

// Random color
randomColorButton.addEventListener("click", randomColor);

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  let hexColor =
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  colorPicker.value = hexColor;
  penColor = hexColor;
  eraser.classList.remove("active");
}

// Fill
filler.addEventListener("click", () => {
  if (filler.classList.contains("active")) {
    filler.classList.remove("active");
    penColor = colorPicker.value; //?????
  } else {
    if (eraser.classList.contains("active")) {
      eraser.classList.remove("active");
    }
    filler.classList.add("active");
  }
});

function fill(target) {
  let gridCellsArray2D = toMatrix(gridArray, size);
  
  let [x, y] = getCoordinates(target);
  let cellColor = getCellColor(gridCellsArray2D[y][x]);

  if (cellColor === colorPicker.value) return;
  target.style.backgroundColor = colorPicker.value;

  let adjacentCells = getAdjacentCells(gridCellsArray2D, x, y);
  for (cell of adjacentCells) {
    if (getCellColor(cell) === cellColor) {
      fill(cell);
    }
  }
}
function getCoordinates(cell) {
  let cellCoordinates = Array.from(cell.parentElement.children).indexOf(cell);
  let x = cellCoordinates % size;
  let y = Math.floor(cellCoordinates / size);
  return [x, y];
} 
function getCellColor(gridCell) {
  let cellColor = gridCell.style.backgroundColor;
    if (cellColor === "" || cellColor.includes("rgba")) {
      cellColor = "#cec8b600";
    } else {
      cellColor = rgb2hex(cellColor);
    }
  return cellColor;
}
function getAdjacentCells(gridCellsArray2D, x, y) {
  
  let adjacentCells = [];
  if (x > 0) {
    adjacentCells.push(gridCellsArray2D[y][x - 1]);
  }
  if (x < size - 1) {
    adjacentCells.push(gridCellsArray2D[y][x + 1]);
  }
  if (y > 0) {
    adjacentCells.push(gridCellsArray2D[y - 1][x]);
  }
  if (y < size - 1) {
    adjacentCells.push(gridCellsArray2D[y + 1][x]);
  }
  return adjacentCells;
}

const rgb2hex = (rgb) =>
  `#${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
    .join("")}`;

function toMatrix(array, width) {
  return array.reduce(function (rows, key, index) {
    return (
      (index % width == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows
    );
  }, []);
}

// Erase
eraser.addEventListener("click", () => {
  if (eraser.classList.contains("active")) {
    eraser.classList.remove("active");
    penColor = colorPicker.value;
  } else {
    if (filler.classList.contains("active")) {
      filler.classList.remove("active");
    }
    eraser.classList.add("active");
    penColor = "#cec8b600";
  }
});

// Clear
function clearGrid() {
  let gridCells = document.querySelectorAll(".grid-item");
  for (cell of gridCells) {
    cell.style.backgroundColor = "#cec8b600";
  }
  initGrid();
  eraser.classList.remove("active");
  penColor = colorPicker.value;
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
clearButton.addEventListener("click", () => {
  if (toggleSwitch.checked) {
    clearCanvas();
  } else {
    clearGrid();
  }
});

// Size
sizeSlider.addEventListener("change", (e) => {
  size = e.target.value;
  updateSliderLabel();
  clearGrid();
});

/* functions */
function initGrid() {
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    let gridCell = document.createElement("div");
    gridCell.classList.add("grid-item");
    grid.appendChild(gridCell);
  }
  initGridCellListeners();
  gridArray = Array.from(document.querySelectorAll(".grid-item"));
}

function initGridCellListeners() {
  let gridCells = document.querySelectorAll(".grid-item");
  for (cell of gridCells) {
    cell.addEventListener("mousedown", draw);
    cell.addEventListener("mouseover", draw);
  }
}
function uninitGrid() {
  let gridCells = document.querySelectorAll(".grid-item");
  for (cell of gridCells) {
    cell.removeEventListener("mousedown", draw);
    cell.removeEventListener("mouseover", draw);
  }
}
function updateSliderLabel() {
  sizeSliderLabel.textContent = `${size} x ${size}`;
}
function initCanvas() {
  if (!canvasInitialized) {
    grid.appendChild(canvas);
    canvas.style.zIndex = 1;
    canvas.style.position = 'fixed';

    resize();

    window.addEventListener('resize', resize);
    grid.addEventListener('mousemove', drawOnCanvas);
    grid.addEventListener('mousedown', setPosition);
    grid.addEventListener('mouseenter', setPosition);
    canvasInitialized = true;
  } else {
    canvas.style.zIndex = 1;
    uninitGrid();
    grid.addEventListener('mousemove', drawOnCanvas);
    grid.addEventListener('mousedown', setPosition);
    grid.addEventListener('mouseenter', setPosition);
  }
}
function uninitCanvas() {
  grid.removeEventListener('mousemove', drawOnCanvas);
  grid.removeEventListener('mousedown', setPosition);
  grid.removeEventListener('mouseenter', setPosition);
  canvas.style.zIndex = -1;
}
// new position from mouse event
function setPosition(e) {
  var rect = e.target.getBoundingClientRect();
  mousePosition.x = e.clientX - rect.left; //x position within the element.
  mousePosition.y = e.clientY - rect.top;  //y position within the element.
}

function resize() {
  ctx.canvas.width = 500;
  ctx.canvas.height = 500;
}

function drawOnCanvas(e) {
  if (e.buttons !== 1) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = colorPicker.value;

  ctx.moveTo(mousePosition.x, mousePosition.y); // from
  setPosition(e);
  ctx.lineTo(mousePosition.x, mousePosition.y); // to

  ctx.stroke(); // draw it!
}