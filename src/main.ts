import "./style.scss";
import * as faceapi from "face-api.js";

const uploadInput = document.getElementById("uploadInput") as HTMLInputElement;
const originalCanvas = document.getElementById(
  "originalCanvas"
) as HTMLCanvasElement;

const ctxOriginal = originalCanvas.getContext("2d");

async function start() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");

  console.log("Models loaded successfully!");
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
      originalCanvas.width = img.width;
      originalCanvas.height = img.height;
      ctxOriginal?.drawImage(img, 0, 0);

      const detectionWithLandmarks = await faceapi
        .detectAllFaces(originalCanvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      if (detectionWithLandmarks) {
        console.log("detectionWithLandmarks", detectionWithLandmarks);
        // Assuming only one face is detected in this example
        const box = detectionWithLandmarks[0].detection.box;
        if (!ctxOriginal) {
          return;
        }
        ctxOriginal.strokeStyle = "#00ff00";
        ctxOriginal.lineWidth = 2;
        ctxOriginal.strokeRect(box.x, box.y, box.width, box.height);
      } else {
        console.log("No face detected in the image.");
      }
    };
  };

  reader.readAsDataURL(file);
}
