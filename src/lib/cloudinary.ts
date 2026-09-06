/* ─── Cloudinary unsigned upload ─── */

export type CloudinaryResult = {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
  width: number;
  height: number;
};

export type UploadErrorCode =
  "FILE_TOO_LARGE" | "UNSUPPORTED_TYPE" | "NETWORK_ERROR" | "UPLOAD_REJECTED";

export class UploadError extends Error {
  code: UploadErrorCode;
  constructor(code: UploadErrorCode, message: string) {
    super(message);
    this.name = "UploadError";
    this.code = code;
  }
}

const CLOUD_NAME = import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"];
const UPLOAD_PRESET = import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface UploadOptions {
  folder?: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

export function uploadToCloudinary(
  file: File,
  { folder = "gorebalance/payments", onProgress, signal }: UploadOptions = {},
): Promise<CloudinaryResult> {
  return new Promise((resolve, reject) => {
    /* ─── Pre-flight checks ─── */
    if (!ACCEPTED_TYPES.includes(file.type)) {
      reject(new UploadError("UNSUPPORTED_TYPE", "Only JPG, PNG or WEBP files are accepted."));
      return;
    }

    if (file.size > MAX_SIZE) {
      reject(
        new UploadError(
          "FILE_TOO_LARGE",
          "That file is over 5 MB — please upload a smaller screenshot.",
        ),
      );
      return;
    }

    /* ─── Build form data ─── */
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    /* ─── XHR for progress tracking ─── */
    const xhr = new XMLHttpRequest();
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    xhr.open("POST", url);

    /* progress */
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    /* success */
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            secure_url: data.secure_url,
            public_id: data.public_id,
            bytes: data.bytes,
            format: data.format,
            width: data.width,
            height: data.height,
          });
        } catch {
          reject(
            new UploadError("UPLOAD_REJECTED", "Upload succeeded but the response was invalid."),
          );
        }
      } else {
        reject(new UploadError("UPLOAD_REJECTED", `Upload failed with status ${xhr.status}.`));
      }
    };

    /* network error */
    xhr.onerror = () => {
      reject(
        new UploadError("NETWORK_ERROR", "Network error — check your connection and try again."),
      );
    };

    /* abort */
    xhr.onabort = () => {
      reject(new UploadError("NETWORK_ERROR", "Upload was cancelled."));
    };

    /* external abort signal */
    if (signal) {
      signal.addEventListener("abort", () => xhr.abort(), { once: true });
    }

    xhr.send(formData);
  });
}
