import { getSystemInfoSync } from "@tarojs/taro";

export function isPC() {
  const platform = getSystemInfoSync().platform;
  return platform === "Windows" || platform === "Mac";
}

export function isWebsite() {
  return process.env.TARO_ENV === "h5";
}

import { v4 as uuidv4 } from "uuid";
export function randomUUID() {
  return uuidv4();
}

export function setTransform(el: HTMLElement, val: string) {
  el.style.webkitTransform = val;
  el.style.transform = val;
}

export function inlineStyle(style: Record<string, string>) {
  let res = "";
  for (const attr in style) res += `${attr}: ${style[attr]};`;
  if (res.indexOf("display: flex;") >= 0)
    res += "display: -webkit-box;display: -webkit-flex;";
  res = res.replace(
    /transform:(.+?);/g,
    (s, $1) => `${s}-webkit-transform:${$1};`
  );
  res = res.replace(
    /flex-direction:(.+?);/g,
    (s, $1) => `${s}-webkit-flex-direction:${$1};`
  );
  return res;
}
