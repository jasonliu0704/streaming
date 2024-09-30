import { inlineStyle, setTransform } from "./common";
import { MethodHandler } from "./hander";
const noop = function () {};

export class ActionSheet {
  options = {
    alertText: "",
    cancelText: "Cancel",
    itemList: [],
    itemColor: "#000000",
    success: noop,
    fail: noop,
    complete: noop,
  };

  style = {
    maskStyle: {
      position: "fixed",
      "z-index": "1000",
      top: "0",
      right: "0",
      left: "0",
      bottom: "0",
      background: "rgba(0,0,0,0.6)",
    },
    actionSheetStyle: {
      "z-index": "4999",
      position: "fixed",
      left: "0",
      bottom: "0",
      "-webkit-transform": "translate(0, 100%)",
      transform: "translate(0, 100%)",
      width: "100%",
      "line-height": "1.6",
      background: "#EFEFF4",
      "-webkit-transition": "-webkit-transform .3s",
      transition: "transform .3s",
      "border-radius": "15px 15px 0 0",
    },
    menuStyle: {
      "background-color": "#FCFCFD",
      "border-radius": "15px 15px 0 0",
    },
    cellStyle: {
      position: "relative",
      padding: "10px 0",
      "text-align": "center",
      "font-size": "18px",
    },
    titleStyle: {
      position: "relative",
      padding: "10px 0",
      "text-align": "center",
      "font-size": "16px",
      color: "rgba(0,0,0,0.8)",
      display: "none",
    },
    cancelStyle: {
      "margin-top": "6px",
      padding: "10px 0",
      "text-align": "center",
      "font-size": "18px",
      color: "#000000",
      "background-color": "#FCFCFD",
    },
  };

  lastConfig = {};
  el: HTMLDivElement;
  mask: HTMLDivElement;
  actionSheet: HTMLDivElement;
  menu: HTMLDivElement;
  cells: HTMLDivElement[];
  title: HTMLDivElement;
  cancel: HTMLDivElement;
  hideOpacityTimer: ReturnType<typeof setTimeout>;
  hideDisplayTimer: ReturnType<typeof setTimeout>;

  create(options = {}) {
    return new Promise<string | number>((resolve) => {
      // style
      const {
        maskStyle,
        actionSheetStyle,
        menuStyle,
        cellStyle,
        titleStyle,
        cancelStyle,
      } = this.style;

      // configuration
      const config = {
        ...this.options,
        ...options,
      };

      this.lastConfig = config;

      // wrapper
      this.el = document.createElement("div");
      this.el.className = "taro__actionSheet";
      this.el.style.opacity = "0";
      this.el.style.transition = "opacity 0.2s linear";

      // mask
      this.mask = document.createElement("div");
      this.mask.setAttribute("style", inlineStyle(maskStyle));

      // actionSheet
      this.actionSheet = document.createElement("div");
      this.actionSheet.setAttribute("style", inlineStyle(actionSheetStyle));

      // menu
      this.menu = document.createElement("div");
      this.menu.setAttribute(
        "style",
        inlineStyle({
          ...menuStyle,
          color: config.itemColor,
        })
      );

      // cells
      this.cells = config.itemList.map((item, index) => {
        const cell: HTMLDivElement = document.createElement("div");
        cell.className = "taro-actionsheet__cell";
        cell.setAttribute("style", inlineStyle(cellStyle));
        cell.textContent = item;
        cell.dataset.tapIndex = `${index}`;
        cell.onclick = (e) => {
          this.hide();
          const target = e.currentTarget as HTMLDivElement;
          const index = Number(target?.dataset.tapIndex) || 0;
          resolve(index);
        };
        return cell;
      });

      // title
      this.title = document.createElement("div");
      this.title.setAttribute("style", inlineStyle(titleStyle));
      this.title.className = "taro-actionsheet__cell";
      this.title.textContent = config.alertText;
      this.title.style.display = config.alertText ? "block" : "none";

      // cancel
      this.cancel = document.createElement("div");
      this.cancel.setAttribute("style", inlineStyle(cancelStyle));
      this.cancel.textContent = config.cancelText;

      // result
      this.menu.appendChild(this.title);
      this.cells.forEach((item) => this.menu.appendChild(item));
      this.actionSheet.appendChild(this.menu);
      this.actionSheet.appendChild(this.cancel);
      this.el.appendChild(this.mask);
      this.el.appendChild(this.actionSheet);

      // callbacks
      const cb = () => {
        this.hide();
        resolve("cancel");
      };
      this.mask.onclick = cb;
      this.cancel.onclick = cb;

      // show immediately
      document.body.appendChild(this.el);
      setTimeout(() => {
        this.el.style.opacity = "1";
        setTransform(this.actionSheet, "translate(0, 0)");
      }, 0);
    });
  }

  show(options = {}) {
    return new Promise<string | number>((resolve) => {
      const config = {
        ...this.options,
        ...options,
      };

      this.lastConfig = config;

      if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer);
      if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer);

      // itemColor
      if (config.itemColor) this.menu.style.color = config.itemColor;

      // cells
      const { cellStyle } = this.style;

      config.itemList.forEach((item, index) => {
        let cell: HTMLDivElement;
        if (this.cells[index]) {
          // assign new content
          cell = this.cells[index];
        } else {
          // create new cell
          cell = document.createElement("div");
          cell.className = "taro-actionsheet__cell";
          cell.setAttribute("style", inlineStyle(cellStyle));
          cell.dataset.tapIndex = `${index}`;
          this.cells.push(cell);
          this.menu.appendChild(cell);
        }
        cell.textContent = item;
        cell.onclick = (e) => {
          this.hide();
          const target = e.currentTarget as HTMLDivElement;
          const index = Number(target?.dataset.tapIndex) || 0;
          resolve(index);
        };
      });
      const cellsLen = this.cells.length;
      const itemListLen = config.itemList.length;
      if (cellsLen > itemListLen) {
        for (let i = itemListLen; i < cellsLen; i++) {
          this.menu.removeChild(this.cells[i]);
        }
        this.cells.splice(itemListLen);
      }
      this.title.textContent = config.alertText;
      this.title.style.display = config.alertText ? "block" : "none";

      // callbacks
      const cb = () => {
        this.hide();
        resolve("cancel");
      };
      this.mask.onclick = cb;
      this.cancel.onclick = cb;

      // show
      this.el.style.display = "block";
      setTimeout(() => {
        this.el.style.opacity = "1";
        setTransform(this.actionSheet, "translate(0, 0)");
      }, 0);
    });
  }

  hide() {
    if (this.hideOpacityTimer) clearTimeout(this.hideOpacityTimer);
    if (this.hideDisplayTimer) clearTimeout(this.hideDisplayTimer);

    this.hideOpacityTimer = setTimeout(() => {
      this.el.style.opacity = "0";
      setTransform(this.actionSheet, "translate(0, 100%)");
      this.hideDisplayTimer = setTimeout(() => {
        this.el.style.display = "none";
      }, 200);
    }, 0);
  }
}

// 交互

let status = "default";

// inject necessary style
function init(doc) {
  if (status === "ready") return;

  const taroStyle = doc.createElement("style");
  taroStyle.textContent =
    '@font-face{font-weight:normal;font-style:normal;font-family:"taro";src:url("data:application/x-font-ttf;charset=utf-8;base64, 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") format("truetype");}@-webkit-keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}@keyframes taroLoading{0%{-webkit-transform:rotate3d(0, 0, 1, 0deg);}100%{-webkit-transform:rotate3d(0, 0, 1, 360deg);transform:rotate3d(0, 0, 1, 360deg);}}.taro-modal__foot:after {content: "";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);} .taro-model__btn:active {background-color: #EEEEEE}.taro-model__btn:not(:first-child):after {content: "";position: absolute;left: 0;top: 0;width: 1px;bottom: 0;border-left: 1px solid #D5D5D6;color: #D5D5D6;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleX(0.5);transform: scaleX(0.5);}.taro-actionsheet__cell:not(:last-child):after {content: "";position: absolute;left: 0;bottom: 0;right: 0;height: 1px;border-top: 1px solid #e5e5e5;color: #e5e5e5;-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);}';
  doc.querySelector("head").appendChild(taroStyle);

  status = "ready";
}

const actionSheet = new ActionSheet();

interface Options {
  cancel?: () => void;
  fail?: () => void;
  complete?: () => void;
  success?: () => void;
  itemList: string[];
  itemColor?: string;
  alertText?: string;
  cancelText?: string;
}

export const showActionSheet = async (
  options: Options = { itemList: [] },
  methodName = "showActionSheet"
): Promise<Taro.showActionSheet.SuccessCallbackResult> => {
  init(document);
  options = Object.assign(
    {
      itemColor: "#000000",
      itemList: [],
    },
    options
  );
  const { success, fail, complete } = options;
  const handle = new MethodHandler<Taro.showActionSheet.SuccessCallbackResult>({
    name: methodName,
    success,
    fail,
    complete,
  });

  // list item String
  if (!Array.isArray(options.itemList)) {
    console.error(
      "showActionSheet:fail parameter error: parameter.itemList should be Array"
    );
  }

  if (options.itemList.length < 1) {
    return handle.fail({
      errMsg: "parameter error: parameter.itemList should have at least 1 item",
    });
  }

  if (options.itemList.length > 6) {
    return handle.fail({
      errMsg: "parameter error: parameter.itemList should not be large than 6",
    });
  }

  for (let i = 0; i < options.itemList.length; i++) {
    if (typeof options.itemList[i] !== "string") {
      return handle.fail({
        errMsg:
          "parameter error: parameter.itemList's element should be String",
      });
    }
  }

  if (typeof options.itemColor !== "string") {
    return handle.fail({
      errMsg: "parameter error: parameter.itemColor should be String",
    });
  }

  let result: number | string = "";
  if (!actionSheet.el) {
    result = await actionSheet.create(options);
  } else {
    result = await actionSheet.show(options);
  }

  if (typeof result === "string") {
    return handle.fail({ errMsg: result });
  } else {
    return handle.success({ tapIndex: result });
  }
};
