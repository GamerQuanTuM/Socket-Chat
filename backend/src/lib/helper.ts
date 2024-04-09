interface FileData {
    mimetype: string;
    buffer: Buffer;
  }
  
  export const getBase64 = (file: FileData): string =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  