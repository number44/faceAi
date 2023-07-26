import "./style.scss";
import * as faceapi from "face-api.js";
import imglyRemoveBackground from "@imgly/background-removal";

const uploadInput = document.getElementById("uploadInput") as HTMLInputElement;
const originalCanvas = document.getElementById(
  "originalCanvas"
) as HTMLCanvasElement;
const croppedCanvas = document.getElementById(
  "croppedCanvas"
) as HTMLCanvasElement;
const ctxOriginal = originalCanvas.getContext("2d");
const ctxCropped = croppedCanvas.getContext("2d");

async function start() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
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

      // Detect faces in the image
      const detections = await faceapi.detectSingleFace(
        originalCanvas,
        new faceapi.TinyFaceDetectorOptions()
      );
      if (detections) {
        // Assuming only one face is detected in this example
        const faceRect = detections.box;
        const faceWidth = faceRect.width;
        const faceHeight = faceRect.height;
        const faceCenterX = faceRect.x + faceWidth / 2;
        const faceCenterY = faceRect.y + faceHeight / 2;

        // Calculate the desired size for the cropped face
        const targetFaceWidth = img.width * 0.75;
        const targetFaceHeight = img.height * 0.75;

        // Calculate the cropping coordinates
        const cropX = faceCenterX - targetFaceWidth / 2;
        const cropY = faceCenterY - targetFaceHeight / 2;

        // Ensure that the cropping coordinates stay within the image boundaries
        const croppedX = Math.max(0, cropX);
        const croppedY = Math.max(0, cropY);
        const croppedWidth = Math.min(targetFaceWidth, img.width - croppedX);
        const croppedHeight = Math.min(targetFaceHeight, img.height - croppedY);

        // Draw the cropped image onto the croppedCanvas
        croppedCanvas.width = croppedWidth;
        croppedCanvas.height = croppedHeight;
        ctxCropped?.drawImage(
          img,
          croppedX,
          croppedY,
          croppedWidth,
          croppedHeight,
          0,
          0,
          croppedWidth,
          croppedHeight
        );
      } else {
        // If no face is detected, display an error message or perform an alternate action
        console.log("No face detected in the image.");
      }
    };
  };

  reader.readAsDataURL(file);
}
