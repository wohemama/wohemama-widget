import "./app.css";
import App from "./App.svelte";

window.WohemamaCartSettings = {
  publicApiKey: "wuzhenyu@mail.smallsticker.com",
  shipping: 13,
};

const target = document.querySelector("body");
let widget = undefined;

document.addEventListener("click", (e) => {
  if (
    e.target.getAttribute("class") &&
    e.target.getAttribute("class").split(" ").includes("wohemama-cart-add-item")
  ) {
    if (widget) widget.$destroy();
    const detail = e.target.dataset;
    console.log(detail, detail.itemUrl === undefined);
    if (detail.itemUrl === undefined) detail.itemUrl = location.href;
    console.log("detail2", detail, location.href);
    widget = new App({
      target,
      props: {
        detail,
        onlyShow: false,
        dataset: { shipping: window.WohemamaCartSettings.shipping },
      },
    });
  } else if (
    e.target.getAttribute("class") &&
    e.target.getAttribute("class").split(" ").includes("wohemama-cart")
  ) {
    if (widget) widget.$destroy();
    const detail = e.target.dataset;
    console.log(detail, detail.itemUrl === undefined);
    if (detail.itemUrl === undefined) detail.itemUrl = location.href;
    console.log("detail2", detail, location.href);
    widget = new App({
      target,
      props: {
        detail,
        onlyShow: true,
        dataset: { shipping: window.WohemamaCartSettings.shipping },
      },
    });
  }
});
