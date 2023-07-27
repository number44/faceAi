import * as faceapi from "face-api.js";
import imglyRemoveBackground, { Config } from "@imgly/background-removal";

const counter = document.querySelector("#counter") as HTMLElement;
const counting = document.querySelector(".counting") as HTMLElement;
const uploadInput = document.getElementById("uploadInput") as HTMLInputElement;
// const originalCanvas = document.getElementById("originalCanvas") as HTMLCanvasElement;
// const croppedCanvas = document.getElementById("croppedCanvas") as HTMLCanvasElement;
// const ctxCropped = croppedCanvas.getContext("2d");
// const ctxOriginal = originalCanvas.getContext("2d");

async function start() {
  console.log("Auto Lesio.eu");
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

  uploadInput.addEventListener("change", handleImageUpload);
}

start().catch(console.error);

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target || !target.files || target.files.length === 0) {
    return;
  }

  const file = target.files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const imageUrl = event.target?.result as string;

    // Create a new image object and load the image
    const img = new Image();
    img.src = imageUrl;

    img.onload = async function () {
      const originalCanvas = document.createElement("canvas") as HTMLCanvasElement;
      const ctxOriginal = originalCanvas.getContext("2d");

      originalCanvas.width = img.width;
      originalCanvas.height = img.height;
      ctxOriginal?.drawImage(img, 0, 0);
      const detection = await faceapi.detectSingleFace(originalCanvas, new faceapi.TinyFaceDetectorOptions());
      if (detection) {
        const box = detection.box;
        // Calculate the new width and height based on the factors
        const widthFactor = 0.8; // Reduce the width to 90%
        const heightIncreaseBottom = 0.1; // Increase the height at the bottom by 20%
        const heightIncreaseTop = 0.6; // Increase the height at the top by 50%

        // Calculate new height, new width, and new y position
        const newHeight = box.height * (1 + heightIncreaseBottom + heightIncreaseTop);
        const newWidth = newHeight * widthFactor;
        const newY = box.y - box.height * heightIncreaseTop;

        // Calculate new x position to center the face
        const newCenterX = box.x + box.width / 2;
        const newX = newCenterX - newWidth / 2;
        if (!ctxOriginal) {
          return;
        }
        // ctxOriginal.strokeStyle = "#00ff00";
        // ctxOriginal.lineWidth = 2;
        // ctxOriginal.strokeRect(newX, newY, newWidth, newHeight);
        const croppedCanvas = document.createElement("canvas") as HTMLCanvasElement;
        const ctxCropped = croppedCanvas.getContext("2d");

        croppedCanvas.width = newWidth;
        croppedCanvas.height = newHeight;
        if (!ctxCropped) {
          return;
        }

        ctxCropped.drawImage(originalCanvas, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
        const dataURL = croppedCanvas.toDataURL();
        let config: Config = {
          publicPath: "/models/", // path to the wasm files
          debug: false, // enable or disable useful console.log outputs
          proxyToWorker: false, // Whether to proxy the calculations to a web worker. (Default true)
          model: "medium", // The model to use. (Default "medium")
          progress: (key: string, current: string, total: string) => {
            if (counting) {
              counting.classList.remove("d-none");
            }
            if (counter) {
              counter.innerHTML = `Przetworzono ${current} z ${total}`;
            }
            console.log("key", key);
          },
        };
        imglyRemoveBackground(dataURL, config).then((blob: Blob) => {
          // The result is a blob encoded as PNG. It can be converted to a URL to be used as HTMLImage.src
          const url = URL.createObjectURL(blob);
          const finalImg = new Image();
          finalImg.src = url;
          finalImg.onload = async function () {
            const finalCanvas = document.createElement("canvas") as HTMLCanvasElement;
            const finalCtx = finalCanvas.getContext("2d");
            finalCanvas.width = finalImg.width;
            finalCanvas.height = finalImg.height;
            if (!finalCtx) return;
            finalCtx.fillStyle = "#e1e1e1";
            finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
            finalCtx.drawImage(finalImg, 0, 0);
            const dataURL = finalCanvas.toDataURL("image/jpeg", 1.0);
            const imageEl = document.querySelector(".image") as HTMLImageElement;
            if (!imageEl) return;
            // imageEl.src = url; // this is working
            imageEl.src = dataURL; // this is not working
            const btnDwnlad = document.querySelector(".buton-download") as HTMLAnchorElement;
            if (!btnDwnlad) return;
            btnDwnlad.classList.remove("d-none");
            btnDwnlad.href = dataURL;
            if (counting) {
              counting.classList.add("d-none");
            }
          };
        });
      } else {
        console.log("No face detected in the image.");
      }
    };
  };

  reader.readAsDataURL(file);
}
