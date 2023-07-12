const canvas = document.getElementById("js-canvas");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("js-range");
const mode = document.getElementById("js-mode");
const saveBtn = document.getElementById("js-save");
const eraseBtn = document.getElementById("js-erase");

const INITIAL_COLOR = "black";
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;

const ctx = canvas.getContext("2d");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

ctx.lineWidth = 2.5;
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;

let painting = false;
let filling = false;
let erase = false;

let startX, startY;

function stopPainting() {
  painting = false;
}
function startPainting() {
  painting = true;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
}
function stopErasing() {
  erase = false;
}
function startErasing() {
  erase = true;
}
function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    startX = x;
    startY = y;
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
function onMouseDown(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  startX = x;
  startY = y;
  if (erase) {
    startErasing();
  } else {
    startPainting();
  }
}
function changeColor(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}
function rangeChange(event) {
  const rangeValue = event.target.value;
  ctx.lineWidth = rangeValue;
}
function modeChange() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}
function canvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
function handleCM(event) {
  event.preventDefault();
}
function savePicture() {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "Picture";
  link.click();
}
function eraseCanvas() {
  filling = false;
  painting = false;
  erase = true;
  ctx.strokeStyle = "white";
}
function circleDraw() {
  const radius = Math.sqrt((startX - x) ** 2 + (startY - y) ** 2);
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function rectDraw() {
  const width = x - startX;
  const height = y - startY;
  ctx.strokeRect(startX, startY, width, height);
}

function onMouseUp(event) {
  if (erase) {
    stopErasing();
  } else if (painting && !filling) {
    stopPainting();
  }
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", canvasClick);
  canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach((color) =>
  color.addEventListener("click", changeColor)
);

if (range) {
  range.addEventListener("input", rangeChange);
}

if (mode) {
  mode.addEventListener("click", modeChange);
}

if (saveBtn) {
  saveBtn.addEventListener("click", savePicture);
}

if (eraseBtn) {
  eraseBtn.addEventListener("click", eraseCanvas);
}
