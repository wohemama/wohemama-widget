<script>
  import Big from 'big.js';
	export let parsedCart = JSON.parse(localStorage.cartData ?? null) || []
  export let dataset
  
	$: {
		localStorage.cartData = JSON.stringify(parsedCart)
	}

	$: totalPrice = parsedCart.map(i => (new Big(i.itemPrice)).times(i.itemCount)).reduce((m, n) => (new Big(m)).plus(n), 0)

	function removeItem(i) {
		parsedCart.splice(i, 1)
		parsedCart = [...parsedCart]
	}

</script>

<div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
  
  <slot name="close" />

  <div class="mt-8">
    <div class="flow-root">
      <ul class="-my-6 divide-y divide-gray-200">
        {#each parsedCart as item, i }
        <li class="py-6 flex">
          <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
            <img src="https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg" alt="product" class="w-full h-full object-center object-cover">
          </div>
          <div class="ml-4 flex-1 flex flex-col">
            <div>
              <div class="flex justify-between text-base font-medium text-gray-900">
                <h3>
                  {item.itemName}
                </h3>
                <p class="ml-4">
                  {(new Big(item.itemPrice)).times(item.itemCount)}
                </p>
              </div>

            </div>
            <div class="flex-1 flex items-end justify-between text-sm">
              <p class="text-gray-500">
                数量： <input class="bg-white w-16 border rounded border-gray-200 text-center" type="number" min="1" bind:value={item.itemCount} />
              </p>         
              <div class="flex">
                <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" on:click="{() => removeItem(i)}">删除</button>
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
    <p>总计：</p>
    <p>{(new Big(totalPrice)).plus(dataset.shipping)}</p>
  </div>

  <slot name="checkout" />

</div>


