/* Constants & Variables*/
const grid = document.querySelector(".grid");

const colorPicker = document.querySelector(".color--picker");
const randomColorButton = document.querySelector(".random");
const filler = document.querySelector(".filler");
const eraser = document.querySelector(".eraser");
const clearButton = document.querySelector(".clear");
const slider = document.querySelector('input[type="range"]');
const sliderLabel = document.querySelector("label");

const settings = document.querySelector(".settings");

const DEFAULT_SIZE = 16;
let gridArray;
let size = DEFAULT_SIZE;
let backgroundColor = "#333333";
let mouseDown = false;

/* EventListeners */
window.onload = () => initGrid();

// Draw
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function draw(e) {
  if (e.type === "mouseover" && !mouseDown) {
    return;
  }
  if (filler.classList.contains("active")) {
    fill(e.target);
  } else {
    e.target.style.backgroundColor = backgroundColor;
  }
}

// Pick color
colorPicker.addEventListener("input", (e) => {
  backgroundColor = e.target.value;
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
  backgroundColor = hexColor;
  eraser.classList.remove("active");
}

// Fill
filler.addEventListener("click", (e) => {
  if (filler.classList.contains("active")) {
    filler.classList.remove("active");
    backgroundColor = colorPicker.value;
  } else {
    filler.classList.add("active");
  }
});
function getCellColor(gridCell) {
  let cellColor = gridCell.style.backgroundColor;
    if (cellColor === "") {
      cellColor = "#cec8b600";
    } else {
      cellColor = rgb2hex(cellColor);
    }
  return cellColor;
}

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
    backgroundColor = colorPicker.value;
  } else {
    eraser.classList.add("active");
    backgroundColor = "var(--primary-light)";
  }
});

// Clear
function clearGrid(e) {
  grid.innerHTML = "";
  initGrid();
  eraser.classList.remove("active");
  backgroundColor = colorPicker.value;
}
clearButton.addEventListener("click", clearGrid);

// Size
slider.addEventListener("change", (e) => {
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
    gridCell.addEventListener("mousedown", draw);
    gridCell.addEventListener("mouseover", draw);
    grid.appendChild(gridCell);
  }
  gridArray = Array.from(document.querySelectorAll(".grid-item"));
}

function getSize() {}

function updateSliderLabel() {
  sliderLabel.textContent = `${size} x ${size}`;
}
/* Script */
initGrid();
