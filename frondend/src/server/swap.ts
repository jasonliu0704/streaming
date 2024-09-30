import { request, downloadFile, base64ToArrayBuffer } from "@tarojs/taro";
import { toUtf8Bytes } from "src/utils/formdata";
const BaseUrl = "https://api.photoceleb.xyz";

export async function requestImg(_url: string) {
  const isS3 = _url.indexOf("s3.amazonaws.com") > -1;
  let url = _url;
  if (isS3) {
    const res = await downloadFile({
      url: _url,
      withCredentials: false,
      success: (res) => {
        console.log("downloadFile success", res);
      },
      fail: (res) => {
        console.log("downloadFile fail", res);
      },
    });
    url = res.tempFilePath;
  }
  const res = await request<ArrayBuffer>({
    url,
    method: "GET",
    responseType: "arraybuffer",
    mode: "no-cors",
  });
  const buffer = res.data;
  console.log("requestImg buffer", buffer);
  return buffer;
}

function createFormData(params: Record<string, ArrayBuffer>, boundary = "") {
  let postArray: Array<number> = [];
  for (let i in params) {
    const buffer = params[i];
    const dataString = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="${i}"; filename="${i}.png"\r\nContent-Type: image/png\r\n\r\n`;
    postArray.push(...toUtf8Bytes(dataString));
    const fileArray = new Uint8Array(buffer);
    postArray = postArray.concat(Array.prototype.slice.call(fileArray));
  }
  //结尾
  let endBoundaryArray: Array<number> = [];
  endBoundaryArray.push(...toUtf8Bytes(`\r\n--${boundary}--`));
  postArray = postArray.concat(endBoundaryArray);
  return new Uint8Array(postArray).buffer;
}

export async function faceupload(file1: ArrayBuffer) {
  const boundary = `----FooBar${new Date().getTime()}`;
  //filebuffer to binary
  const formData = createFormData(
    {
      file1,
    },
    boundary
  );
  let url = `${BaseUrl}/faceswap/process-images/`;
  const res = await request<ArrayBuffer>({
    url,
    method: "POST",
    header: {
      Accept: "application/json",
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    data: formData,
    responseType: "arraybuffer",
    timeout: 1000 * 60 * 500,
    // mode: "no-cors",
  });
  const buffer = res.data;
  return buffer;
}

export async function chat(content: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(content);
    }, 300);
  });
}
