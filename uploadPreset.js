import { v2 as cloudinary } from "cloudinary";

// configure once in your backend
cloudinary.config({
  cloud_name: "drgwfcuzw",
  api_key: "615396276943642",
  api_secret: "fCEEHa2ZmkngMLWC_bpCgpcjzvM"
});

// create an unsigned preset
async function createUploadPreset() {
  try {
    const preset = await cloudinary.api.create_upload_preset({
      name: "default_preset",
      unsigned: true,
      folder: "rooms", // optional: auto-organize uploads
      allowed_formats: ["jpg", "png", "webp"], // restrict formats
    });

    console.log("Upload preset created:", preset);
  } catch (error) {
    console.error("Error creating upload preset:", error);
  }
}

createUploadPreset();
