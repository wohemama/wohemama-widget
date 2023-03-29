<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Big from "big.js";
  export let parsedCart;

  const dispatch = createEventDispatcher();
  function recomputeShiping() {
    dispatch("reGetShipping", {
      count: Number(totalCount),
      weight: Number(totalWeight),
    });
  }
  onMount(() => {
    recomputeShiping();
  });

  const itemCountTarget = document.querySelector(".wohemama-items-count");
  const totalPriceTarget = document.querySelector(".wohemama-total-price");

  $: {
    localStorage.cartData = JSON.stringify(parsedCart);
  }

  $: {
    if (itemCountTarget)
      itemCountTarget.textContent = parsedCart
        .map((i) => i.itemCount)
        .reduce((m, n) => new Big(m).plus(n), 0);

    if (totalPriceTarget)
      totalPriceTarget.textContent = parsedCart
        .map((i) => new Big(i.itemPrice).times(i.itemCount))
        .reduce((m, n) => new Big(m).plus(n), 0);
  }
  $: totalWeight = parsedCart
    .map((i) => i.itemWeight || 0)
    .reduce((m, n) => new Big(m).plus(n), 0);
  $: totalCount = parsedCart
    .map((i) => i.itemCount)
    .reduce((m, n) => new Big(m).plus(n), 0);
  $: totalPrice = parsedCart
    .map((i) => new Big(i.itemPrice).times(i.itemCount))
    .reduce((m, n) => new Big(m).plus(n), 0);

  function removeItem(i) {
    parsedCart.splice(i, 1);

    parsedCart = [...parsedCart];

    totalWeight = parsedCart
      .map((i) => i.itemWeight || 0)
      .reduce((m, n) => new Big(m).plus(n), 0);

    totalCount = parsedCart
      .map((i) => i.itemCount)
      .reduce((m, n) => new Big(m).plus(n), 0);
  }
</script>

<div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
  <slot name="close" />

  <div class="mt-8">
    <div class="flow-root">
      <ul class="my-6 divide-y divide-gray-200">
        {#each parsedCart as item, i}
          <li class="py-6 flex">
            {#if item.itemImage}
              <div
                class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden"
              >
                <img
                  src={item.itemImage}
                  alt="product"
                  class="w-full h-full object-center object-cover"
                />
              </div>
            {/if}

            <div class="ml-4 flex-1 flex flex-col">
              <div>
                <div
                  class="flex justify-between text-base font-medium text-gray-900"
                >
                  <h3>
                    {item.itemName}
                  </h3>
                  <p class="ml-4">
                    {new Big(item.itemPrice).times(item.itemCount)}
                  </p>
                </div>
              </div>
              <div class="flex-1 flex items-end justify-between text-sm">
                <p class="text-gray-500">
                  数量： <input
                    class="bg-white w-16 border rounded border-gray-200 text-center"
                    type="number"
                    min="1"
                    bind:value={item.itemCount}
                    on:change={recomputeShiping}
                  />
                </p>
                <div class="flex">
                  <button
                    type="button"
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                    on:click={() => {
                      removeItem(i);
                      recomputeShiping();
                    }}>删除</button
                  >
                </div>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
<div class="border-t border-gray-200 py-6 px-4 sm:px-6">
  <div class="flex justify-between text-base font-medium text-gray-900">
    <p>小计：</p>
    <p>{totalPrice}</p>
  </div>

  <slot name="checkout" {totalPrice} />
</div>
