// const canvas = document.getElementById("js-canvas");
// const colors = document.getElementsByClassName("jsColor");
// const range = document.getElementById("js-range");
// const mode = document.getElementById("js-mode");
// const saveBtn = document.getElementById("js-save");
// const eraseBtn = document.getElementById("js-erase");

// const INITIAL_COLOR = "black";
// const CANVAS_WIDTH = 1200;
// const CANVAS_HEIGHT = 600;

// const ctx = canvas.getContext("2d");
// canvas.height = CANVAS_HEIGHT;
// canvas.width = CANVAS_WIDTH;

// ctx.fillStyle = "white";
// ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

// ctx.lineWidth = 2.5;
// ctx.strokeStyle = INITIAL_COLOR;
// ctx.fillStyle = INITIAL_COLOR;

// let painting = false;
// let filling = false;
// let erase = false;

// function stopPainting() {
//   painting = false;
// }
// function startPainting() {
//   painting = true;
// }
// function stopErasing() {
//   erase = false;
// }
// function startErasing() {
//   erase = true;
// }
// function onMouseMove(event) {
//   x = event.offsetX;
//   y = event.offsetY;
//   if (!painting) {
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//   } else {
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   }
// }
// function onMouseDown(event) {
//   painting = true;
// }
// function changeColor(event) {
//   const color = event.target.style.backgroundColor;
//   ctx.strokeStyle = color;
//   ctx.fillStyle = color;
// }
// function rangeChange(event) {
//   const rangeValue = event.target.value;
//   ctx.lineWidth = rangeValue;
// }
// function modeChange() {
//   if (filling === true) {
//     filling = false;
//     mode.innerText = "Fill";
//   } else {
//     filling = true;
//     mode.innerText = "Paint";
//   }
// }
// function canvasClick() {
//   if (filling) {
//     ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//   }
// }
// function handleCM(event) {
//   event.preventDefault();
// }
// function savePicture() {
//   const image = canvas.toDataURL("image/png");
//   const link = document.createElement("a");
//   link.href = image;
//   link.download = "Picture";
//   link.click();
// }
// function eraseCanvas() {
//   filling = false;
//   painting = false;
//   ctx.beginPath();
//   ctx.moveTo(x, y);
//   ctx.strokeStyle = "white";
// }

// //canvas methods
// if (canvas) {
//   canvas.addEventListener("mousemove", onMouseMove);
//   canvas.addEventListener("mousedown", onMouseDown);
//   canvas.addEventListener("mouseup", stopPainting);
//   canvas.addEventListener("mouseleave", stopPainting);
//   canvas.addEventListener("click", canvasClick);
//   canvas.addEventListener("contextmenu", handleCM);
// }

// //Pick color
// Array.from(colors).forEach((color) =>
//   color.addEventListener("click", changeColor)
// );

// //Brush size changer
// if (range) {
//   range.addEventListener("input", rangeChange);
// }
// if (mode) {
//   mode.addEventListener("click", modeChange);
// }
// if (saveBtn) {
//   saveBtn.addEventListener("click", savePicture);
// }
// if (eraseBtn) {
//   eraseBtn.addEventListener("click", eraseCanvas);
// }

const canvas = document.getElementById("js-canvas");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("js-range");
const mode = document.getElementById("js-mode");
const saveBtn = document.getElementById("js-save");
const downloadBtn = document.getElementById("js-download");
const eraseBtn = document.getElementById("js-erase");
const lineBtn = document.getElementById("js-line");

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
let drawingLine = false;

// Нові змінні для малювання фігур
let isDrawing = false;
let startX, startY;
let selectedShape = null;
let figures = [];

// Зберігання окремих кольорів для фігур
let figureStrokeColor = INITIAL_COLOR;
let figureFillColor = INITIAL_COLOR;

// Функція для малювання окремої фігури
function drawFigure(figure) {
  var startX = figure.startX;
  var startY = figure.startY;
  var endX = figure.endX;
  var endY = figure.endY;

  var width = endX - startX;
  var height = endY - startY;

  ctx.beginPath();

  if (figure.shape === "circle") {
    ctx.arc(
      startX,
      startY,
      Math.sqrt(width * width + height * height),
      0,
      2 * Math.PI
    );
  } else if (figure.shape === "square") {
    ctx.rect(startX, startY, width, height);
  } else if (figure.shape === "triangle") {
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + width, startY);
    ctx.lineTo(startX + width / 2, startY + height);
    ctx.closePath();
  }

  ctx.strokeStyle = figure.strokeColor;
  ctx.fillStyle = figure.fillColor;

  if (filling) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

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
  if (!painting && !isDrawing) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    if (isDrawing && selectedShape) {
      var currentX = event.clientX - canvas.offsetLeft;
      var currentY = event.clientY - canvas.offsetTop;

      var width = currentX - startX;
      var height = currentY - startY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Малюємо всі збережені фігури
      for (var i = 0; i < figures.length; i++) {
        var figure = figures[i];
        drawFigure(figure);
      }

      ctx.beginPath();

      if (selectedShape === "circle") {
        ctx.arc(
          startX,
          startY,
          Math.sqrt(width * width + height * height),
          0,
          2 * Math.PI
        );
      } else if (selectedShape === "square") {
        ctx.rect(startX, startY, width, height);
      } else if (selectedShape === "triangle") {
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + width, startY);
        ctx.lineTo(startX + width / 2, startY + height);
        ctx.closePath();
      }

      ctx.stroke();
    } else if (painting) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
}

function onMouseDown(event) {
  if (!selectedShape && !drawingLine) {
    painting = true;
  } else if (selectedShape) {
    isDrawing = true;
    startX = event.clientX - canvas.offsetLeft;
    startY = event.clientY - canvas.offsetTop;
  }
}

function changeColor(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color; // Змінюємо колір контуру ліній
  ctx.fillStyle = color; // Змінюємо колір заливки ліній
  figureStrokeColor = color; // Змінюємо колір контуру фігур
  figureFillColor = color; // Змінюємо колір заливки фігур
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

function downloadPicture() {
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

function drawLine(event) {
  startX = event.clientX - canvas.offsetLeft;
  startY = event.clientY - canvas.offsetTop;
  selectedShape = null;
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
  saveBtn.addEventListener("click", () => {
    localStorage.setItem("canvasData", JSON.stringify(figures)); // Зберігаємо масив фігур в Local Storage
    alert("Canvas data saved to Local Storage");
  });
}
if (downloadBtn) {
  downloadBtn.addEventListener("click", downloadPicture);
}
if (eraseBtn) {
  eraseBtn.addEventListener("click", eraseCanvas);
}
if (lineBtn) {
  lineBtn.addEventListener("click", drawLine);
}

// Новий код для малювання фігур
if (canvas) {
  document.getElementById("js-circle").addEventListener("click", function () {
    selectedShape = "circle";
  });

  document.getElementById("js-square").addEventListener("click", function () {
    selectedShape = "square";
  });

  document.getElementById("js-triangle").addEventListener("click", function () {
    selectedShape = "triangle";
  });

  canvas.addEventListener("mousedown", function (event) {
    if (selectedShape) {
      isDrawing = true;
      startX = event.clientX - canvas.offsetLeft;
      startY = event.clientY - canvas.offsetTop;
    }
  });

  canvas.addEventListener("mouseup", function (event) {
    if (isDrawing) {
      isDrawing = false;

      var figure = {
        shape: selectedShape,
        startX: startX,
        startY: startY,
        endX: event.clientX - canvas.offsetLeft,
        endY: event.clientY - canvas.offsetTop,
        strokeColor: figureStrokeColor, // Зберігаємо поточний колір контуру фігури
        fillColor: figureFillColor, // Зберігаємо поточний колір заливки фігури
      };

      figures.push(figure); // Додати фігуру до масиву
    }
  });

  canvas.addEventListener("mousemove", function (event) {
    if (!isDrawing || !selectedShape) return;

    var currentX = event.clientX - canvas.offsetLeft;
    var currentY = event.clientY - canvas.offsetTop;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var width = currentX - startX;
    var height = currentY - startY;

    ctx.beginPath();

    if (selectedShape === "circle") {
      ctx.arc(
        startX,
        startY,
        Math.sqrt(width * width + height * height),
        0,
        2 * Math.PI
      );
    } else if (selectedShape === "square") {
      ctx.rect(startX, startY, width, height);
    } else if (selectedShape === "triangle") {
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + width, startY);
      ctx.lineTo(startX + width / 2, startY + height);
      ctx.closePath();
    }

    ctx.stroke();

    // Малюємо всі збережені фігури
    for (var i = 0; i < figures.length; i++) {
      var figure = figures[i];
      drawFigure(figure);
    }
  });
}

// Відновлення даних полотна з Local Storage при завантаженні сторінки
window.addEventListener("load", function () {
  const savedData = localStorage.getItem("canvasData");
  if (savedData) {
    figures = JSON.parse(savedData);
    // Малюємо всі збережені фігури
    for (var i = 0; i < figures.length; i++) {
      var figure = figures[i];
      drawFigure(figure);
    }
  }
});
