import "./style.scss";
import * as faceapi from "face-api.js";
import imglyRemoveBackground, { Config } from "@imgly/background-removal";
const originalCanvas = document.getElementById(
  "originalCanvas"
) as HTMLCanvasElement;
const croppedCanvas = document.getElementById(
  "croppedCanvas"
) as HTMLCanvasElement;
const ctxOriginal = originalCanvas.getContext("2d");
const ctxCropped = croppedCanvas.getContext("2d");

const uploadInput = document.getElementById("uploadInput") as HTMLInputElement;
const public_path = "https://example.com/assets/";
let config: Config = {
  publicPath: "/", // path to the wasm files
};
window.onload = init;

async function init() {
  if (!uploadInput) return;
  uploadInput.addEventListener("change", handleImageUpload);
}

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target || !target.files || target.files.length === 0) {
    return;
  }
  const file = target.files[0];

  imglyRemoveBackground(file, config).then((blob: Blob) => {
    // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
    const url = URL.createObjectURL(blob);
    const image = document.querySelector(".image");
    if (image && ctxCropped) {
      drawBlobToCanvas(blob, "croppedCanvas");
    }
  });
}

function drawBlobToCanvas(blob: Blob, canvasId: string) {
  // Step 1: Get the canvas element by its ID
  const canvas: HTMLCanvasElement | null = document.getElementById(
    canvasId
  ) as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  // Step 2: Create an image element and load the Blob into it
  const img: HTMLImageElement = new Image();
  img.src = URL.createObjectURL(blob);

  // Wait for the image to load before drawing it on the canvas
  img.onload = () => {
    // Step 4: Draw the image onto the canvas
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not supported!");
      return;
    }
    ctx.drawImage(img, 0, 0);
  };
}
