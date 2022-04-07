/* Constants & Variables*/
const grid = document.querySelector(".grid");
const gridCells = document.querySelectorAll(".grid-item");
const colorPicker = document.querySelector(".color--picker");
const randomColorButton = document.querySelector(".random");
const eraser = document.querySelector(".eraser")
const clearButton = document.querySelector(".clear");
const slider = document.querySelector('input[type="range"]');
const sliderLabel = document.querySelector("label");
const settings = document.querySelector(".settings");

const DEFAULT_SIZE = 16;
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
  e.target.style.backgroundColor = backgroundColor;
}

// Size
slider.addEventListener("change", (e) => {
  size = e.target.value;
  updateSliderLabel();
  clearGrid();
});

// Clear
function clearGrid(e) {
  grid.innerHTML = "";
  initGrid();
  eraser.classList.remove("active");
}
clearButton.addEventListener("click", clearGrid);

// Pick color
colorPicker.addEventListener("input", (e) => {
  backgroundColor = e.target.value;
});
colorPicker.onchange = function () {
  colorPicker.value = colorPicker.value;
};

// Erase
eraser.addEventListener("click", () => {
    backgroundColor = "white";
    eraser.classList.add("active");
})

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
}

function getSize() {}

function updateSliderLabel() {
  sliderLabel.textContent = `${size} x ${size}`;
}
/* Script */
initGrid();
