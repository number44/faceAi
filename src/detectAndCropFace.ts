import * as faceapi from "face-api.js";

// Load the face-api.js models and weights
async function loadFaceApiModels(): Promise<void> {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
}

// Function to detect face, cut the rectangle, and return the base64 representation of the cropped image
export async function detectAndCropFace(file: File): Promise<string | null> {
  try {
    // Load the face-api.js models
    await loadFaceApiModels();

    // Load the image from the file
    const image = await faceapi.bufferToImage(file);

    // Detect a single face in the image
    const detection = await faceapi.detectSingleFace(
      image,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detection) {
      // Calculate the dimensions of the rectangle
      const targetWidth = detection.box.width;
      const targetHeight = targetWidth * (45 / 35);
      const x = detection.box.x;
      const y = detection.box.y - targetHeight * 0.25;

      // Create a canvas to draw the rectangle
      const canvas = faceapi.createCanvasFromMedia(image);
      const displaySize = { width: image.width, height: image.height };
      faceapi.matchDimensions(canvas, displaySize);

      // Draw the rectangle around the face
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return null;
      }
      ctx.drawImage(image, 0, 0, displaySize.width, displaySize.height);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, targetWidth, targetHeight);

      // Crop the face area
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = targetWidth;
      croppedCanvas.height = targetHeight;
      const croppedCtx = croppedCanvas.getContext("2d");
      if (!croppedCtx) {
        return null;
      }
      croppedCtx.drawImage(
        image,
        x,
        y,
        targetWidth,
        targetHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      // Convert the cropped canvas to base64 representation
      const croppedBase64 = croppedCanvas.toDataURL("image/png");

      // Return the base64 representation of the cropped image
      return croppedBase64;
    } else {
      console.log("No face detected in the image.");
      return null;
    }
  } catch (error) {
    console.error("Error processing the image:", error);
    return null;
  }
}
