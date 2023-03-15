<script>
  import Cart from "./Cart.svelte";
  import Checkout from "./Checkout.svelte";
  export let detail;
  export let dataset;
  export let onlyShow;

  let nodeRef;

  let slideOver = true;

  let parsedCart = JSON.parse(localStorage.cartData ?? null) || [];

  if (!onlyShow) {
    const findedItemIndex = parsedCart.findIndex(
      (i) => i.itemId === detail.itemId
    );
    if (findedItemIndex !== -1) {
      parsedCart[findedItemIndex].itemCount += 1;
    } else {
      const item = { ...detail, itemCount: 1 };
      parsedCart.push(item);
    }
  }

  function destroySelf() {
    nodeRef.parentNode.removeChild(nodeRef);
  }

  function openCheckout() {
    destroySelf();
    const target = document.querySelector("body");
    new Checkout({
      target,
      props: {
        dataset: dataset,
      },
    });
  }

  function clickOutside(node) {
    const handleClick = (event) => {
      if (!node.contains(event.target)) {
        node.dispatchEvent(new CustomEvent("outclick"));
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }
</script>

<div
  class="fixed inset-0 overflow-hidden"
  aria-labelledby="slide-over-title"
  role="dialog"
  aria-modal="true"
  bind:this={nodeRef}
>
  <div class="absolute inset-0 overflow-hidden">
    <!--
      todo
      Background overlay, show/hide based on slide-over state.

      Entering: "ease-in-out duration-500"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in-out duration-500"
        From: "opacity-100"
        To: "opacity-0"
    -->
    {#if slideOver}
      <div
        class="absolute inset-0  bg-opacity-75 transition-opacity"
        aria-hidden="true"
      />

      <div
        class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
      >
        <!--
        todo
        Slide-over panel, show/hide based on slide-over state.

        Entering: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-full"
          To: "translate-x-0"
        Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-0"
          To: "translate-x-full"
      -->
        <div
          class="pointer-events-auto w-screen max-w-md"
          use:clickOutside
          on:outclick={() => {
            slideOver = false;
            destroySelf();
          }}
        >



        <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
          <Cart {parsedCart} {dataset}>
            <div slot="close" class="flex items-start justify-between">
              <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">
                购物车
              </h2>
              <div class="ml-3 h-7 flex items-center">
                <button
                  type="button"
                  class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                  on:click={destroySelf}
                >
                  <span class="sr-only">Close panel</span>
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
    
            <div slot="checkout">
              <p class=" mt-0.5 text-sm text-gray-500">
                不包括运费，在结算时计算运费
              </p>
              <div class="mt-6">
                <button
                  on:click={openCheckout}
                  class="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >结算</button
                >
              </div>
              <div
                class="mt-6 flex justify-center text-sm text-center text-gray-500"
              >
                <p>
                  或 <button
                    on:click={destroySelf}
                    type="button"
                    class="text-indigo-600 font-medium hover:text-indigo-500"
                    >继续购物<span aria-hidden="true"> &rarr;</span></button
                  >
                </p>
              </div>
            </div>
          </Cart>
        </div>


        </div>
      </div>
    {/if}
  </div>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind utilities;
</style>
