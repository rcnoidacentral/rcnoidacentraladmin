import ImageKit from "imagekit-javascript";
import { IMAGEKIT_CONFIG } from "../config/api.config";
import apiService from "./adminApi.service";

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_CONFIG.PUBLIC_KEY,
  urlEndpoint: IMAGEKIT_CONFIG.URL_ENDPOINT,
});

class ImageKitService {
  validateFile(file) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PDF, DOC, DOCX allowed");
    }

    if (file.size > maxSize) {
      throw new Error("File must be under 10MB");
    }
  }

  async uploadFile(file, fileName, onProgress) {
    this.validateFile(file);

    // 🔹 1. Explicitly hit backend
    const authRes = await apiService.getImageKitAuth();
    const { token, expire, signature } = authRes.data;
console.log("auth res", authRes);
    if (!token || !expire || !signature) {
      throw new Error("ImageKit auth failed");
    }

    // 🔹 2. Upload using SDK with manual auth
    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file,
          fileName,
          folder: "/resumes",
          token,
          expire,
          signature,
          useUniqueFileName: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.url,
              fileId: result.fileId,
              fileName: result.name,
            });
          }
        },
        {
          progress: (event) => {
            if (onProgress && event.lengthComputable) {
              const percent = Math.round(
                (event.loaded / event.total) * 100
              );
              onProgress(percent);
            }
          },
        }
      );
    });
  }
}

export default new ImageKitService();
