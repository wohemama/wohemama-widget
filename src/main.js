import "./app.css";
import App from "./App.svelte";
import Big from "big.js";

window.WohemamaCartSettings = {
  publicApiKey: "wuzhenyu@mail.smallsticker.com",
};

const parsedCart = JSON.parse(localStorage.cartData ?? null) || [];

const target = document.querySelector("body");
let widget = undefined;

const itemCountTarget = document.querySelector(".wohemama-items-count");
if (itemCountTarget)
  itemCountTarget.textContent = parsedCart
    .map((i) => i.itemCount)
    .reduce((m, n) => new Big(m).plus(n), 0);

const totalPriceTarget = document.querySelector(".wohemama-total-price");
if (totalPriceTarget)
  totalPriceTarget.textContent = parsedCart
    .map((i) => new Big(i.itemPrice).times(i.itemCount))
    .reduce((m, n) => new Big(m).plus(n), 0);

document.addEventListener("click", (e) => {
  if (
    e.target.getAttribute("class") &&
    e.target.getAttribute("class").split(" ").includes("wohemama-cart-add-item")
  ) {
    if (widget) widget.$destroy();
    const detail = e.target.dataset;
    if (detail.itemUrl === undefined) detail.itemUrl = location.href;
    widget = new App({
      target,
      props: {
        detail,
        onlyShow: false,
      },
    });
  } else if (
    e.target.getAttribute("class") &&
    e.target.getAttribute("class").split(" ").includes("wohemama-cart")
  ) {
    if (widget) widget.$destroy();
    const detail = e.target.dataset;
    if (detail.itemUrl === undefined) detail.itemUrl = location.href;
    widget = new App({
      target,
      props: {
        detail,
        onlyShow: true,
      },
    });
  }
});
