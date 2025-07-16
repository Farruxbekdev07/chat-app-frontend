export const uploadToImgBB = async (file: File): Promise<string | null> => {
  const apiKey = "7a3c4553d53bd949dd51ef9bcd96f126"; // o'zingiznikini qo'ying

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      return data.data.url; // bu URL'ni Firestore'ga saqlaysiz
    } else {
      console.error("Upload failed:", data);
      return null;
    }
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
};
