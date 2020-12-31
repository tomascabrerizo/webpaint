const canvas = document.getElementById("canvas");
const bush_size = document.getElementById("bushSize");
const clear_button = document.getElementById("clear");

const color_red = document.getElementById("red");
const color_green = document.getElementById("green");
const color_blue = document.getElementById("blue");

const ctx = canvas.getContext("2d");

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;
const BACKGROUND_COLOR = 0xaaaaaaff;
const COMPONENT_SIZE = 4;

let backbuffer = [WINDOW_WIDTH * WINDOW_HEIGHT];
canvas.setAttribute("width", WINDOW_WIDTH);
canvas.setAttribute("height", WINDOW_HEIGHT);
canvas.style.backgroundColor = BACKGROUND_COLOR;
const canvas_dim = canvas.getBoundingClientRect();
let pixels = ctx.getImageData(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

let brush = parseInt(document.getElementById("bushSize").value);
let brush_color = 0xff0000ff;
let last_mouse_x = 0;
let last_mouse_y = 0;
let mouse_x = 0;
let mouse_y = 0;
let is_click_down = false;

clear_backbuffer(backbuffer, BACKGROUND_COLOR);
draw_wierd_gradient(backbuffer, 0x444444ff);

red.addEventListener("click", (e) => {
  brush_color = 0xff0000ff;
});
green.addEventListener("click", (e) => {
  brush_color = 0x00ff00ff;
});
blue.addEventListener("click", (e) => {
  brush_color = 0x0000ffff;
});

clear_button.addEventListener("click", (e) => {
  clear_backbuffer(backbuffer, BACKGROUND_COLOR);
  draw_wierd_gradient(backbuffer, 0x444444ff);
});
bush_size.addEventListener("change", (e) => {
  brush = parseInt(document.getElementById("bushSize").value);
});
canvas.addEventListener("mousedown", (e) => {
  is_click_down = true;
});
canvas.addEventListener("mouseup", (e) => {
  is_click_down = false;
});
canvas.addEventListener("mousemove", (e) => {
  last_mouse_x = mouse_x;
  last_mouse_y = mouse_y;
  mouse_x = e.clientX - canvas_dim.left;
  mouse_y = e.clientY - canvas_dim.top;
  if (is_click_down) {
    draw_line_scale(
      last_mouse_x,
      last_mouse_y,
      mouse_x,
      mouse_y,
      brush,
      brush_color,
      backbuffer
    );
  }
});

setInterval(main_loop, 16);

function main_loop() {
  bit_blits(backbuffer, pixels);
  ctx.putImageData(pixels, 0, 0);
}

function draw_rect(x, y, width, height, color, backbuffer) {
  for (dx = x; dx < width + x; dx++) {
    for (dy = y; dy < height + y; dy++) {
      draw_pixel(dx, dy, color, backbuffer);
    }
  }
}

function draw_line_scale(x0, y0, x1, y1, scale, color, backbuffer) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const side_leght = Math.abs(dx) >= Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
  const x_inc = dx / side_leght;
  const y_inc = dy / side_leght;
  let current_x = x0;
  let current_y = y0;

  for (i = 0; i <= side_leght; i++) {
    draw_rect(
      Math.round(current_x),
      Math.round(current_y),
      scale,
      scale,
      color,
      backbuffer
    );
    current_x += x_inc;
    current_y += y_inc;
  }
}

function draw_line(x0, y0, x1, y1, color, backbuffer) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const side_leght = Math.abs(dx) >= Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
  const x_inc = dx / side_leght;
  const y_inc = dy / side_leght;
  let current_x = x0;
  let current_y = y0;

  for (i = 0; i <= side_leght; i++) {
    draw_pixel(Math.round(current_x), Math.round(current_y), color, backbuffer);
    current_x += x_inc;
    current_y += y_inc;
  }
}

function draw_pixel(x, y, color, backbuffer) {
  if (x < 0 || x >= WINDOW_WIDTH || y < 0 || y >= WINDOW_HEIGHT) return;
  backbuffer[y * WINDOW_WIDTH + x] = color;
}

function bit_blits(pixels, image_data) {
  let dy = 0;
  for (y = 0; y < WINDOW_HEIGHT; y++) {
    let dx = 0;
    for (x = 0; x < WINDOW_WIDTH; x++) {
      let pixel = pixels[y * WINDOW_WIDTH + x];
      let r = (pixel >> 24) & 0xff;
      let g = (pixel >> 16) & 0xff;
      let b = (pixel >> 8) & 0xff;
      let a = (pixel >> 0) & 0xff;
      image_data.data[dy * WINDOW_WIDTH + dx + 0] = r;
      image_data.data[dy * WINDOW_WIDTH + dx + 1] = g;
      image_data.data[dy * WINDOW_WIDTH + dx + 2] = b;
      image_data.data[dy * WINDOW_WIDTH + dx + 3] = a;
      dx += COMPONENT_SIZE;
    }
    dy += COMPONENT_SIZE;
  }
}

function clear_backbuffer(backbuffer, color) {
  for (y = 0; y < WINDOW_HEIGHT; y++) {
    for (x = 0; x < WINDOW_WIDTH; x++) {
      backbuffer[y * WINDOW_WIDTH + x] = color;
    }
  }
}

function draw_wierd_gradient(backbuffer, color) {
  for (y = 0; y < WINDOW_HEIGHT; y++) {
    for (x = 0; x < WINDOW_WIDTH; x++) {
      if (y % 10 == 0 && x % 10 == 0) {
        backbuffer[y * WINDOW_WIDTH + x] = color;
      }
    }
  }
}
