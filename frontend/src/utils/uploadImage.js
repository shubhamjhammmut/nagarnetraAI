import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageToFirebase = async (file) => {
  try {
    const fileName = `issues/${Date.now()}_${file.name}`;

    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL; // ✅ permanent URL
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};