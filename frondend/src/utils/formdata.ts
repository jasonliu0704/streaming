export function toUtf8Bytes(str: string) {
  const bytes: Array<number> = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(...utf8CodeAt(str, i));
    const code = str.codePointAt(i);
    if (code && code > 0xffff) {
      i++;
    }
  }
  return bytes;
}

function utf8CodeAt(str: string, i: number) {
  const out: Array<number> = [];
  let p = 0;
  let c = str.charCodeAt(i);
  if (c < 128) {
    out[p++] = c;
  } else if (c < 2048) {
    out[p++] = (c >> 6) | 192;
    out[p++] = (c & 63) | 128;
  } else if (
    (c & 0xfc00) == 0xd800 &&
    i + 1 < str.length &&
    (str.charCodeAt(i + 1) & 0xfc00) == 0xdc00
  ) {
    // Surrogate Pair
    c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
    out[p++] = (c >> 18) | 240;
    out[p++] = ((c >> 12) & 63) | 128;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  } else {
    out[p++] = (c >> 12) | 224;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  }
  return out;
}
