import "./app.css";
import App from "./App.svelte";

window.WohemamaCartSettings = {
  publicApiKey: "wuzhenyu2@mail.smallsticker.com",
  shipping: 0,
};

const target = document.querySelector("body");
let widget = undefined;

document.addEventListener("click", (e) => {
  if (
    e.target.getAttribute("class") &&
    e.target.getAttribute("class").split(" ").includes("wohemama-cart-add-item")
  ) {
    if (widget) widget.$destroy();
    console.log(e.target.dataset)
    widget = new App({
      target,
      props: {
        detail: e.target.dataset,
        dataset: { shipping: window.WohemamaCartSettings.shipping },
      },
    });
  }
});
