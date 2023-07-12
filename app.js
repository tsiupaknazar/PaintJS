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

function stopPainting() {
  painting = false;
}
function startPainting() {
  painting = true;
}
function stopErasing() {
  erase = false;
}
function startErasing() {
  erase = true;
}
function onMouseMove(event) {
  x = event.offsetX;
  y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
function onMouseDown(event) {
  painting = true;
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
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.strokeStyle = "white";
}
function circleDraw() {}

var first = {};
var stop = false;
if (canvas.getContext) {
  canvas.addEventListener(
    "mousemove",
    function (e) {
      var pos = getMousePos(canvas, e), /// provide this canvas and event
        x = pos.x,
        y = pos.y;

      /// check x and y against the grid
    },
    false
  );

  function rectDraw() {
    canvas.addEventListener(
      "click",
      function (e) {
        var pos = getMousePos(canvas, e), /// provide this canvas and event
          x = pos.x,
          y = pos.y;
        if (Object.keys(first).length === 0) {
          first.x = x;
          first.y = y;
        } else {
          stop = true;
        }

        /// check x and y against the grid
      },
      false
    );
  }
  function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    if (Object.keys(first).length !== 0 && !stop) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeRect(
        first.x,
        first.y,
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    }
    console.log({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  //canvas methods
  if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", canvasClick);
    canvas.addEventListener("contextmenu", handleCM);
  }

  //Pick color
  Array.from(colors).forEach((color) =>
    color.addEventListener("click", changeColor)
  );

  //Brush size changer
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
}
