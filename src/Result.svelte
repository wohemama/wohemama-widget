<script>
  export let status;
  export let conent;
  let nodeRef;

  function destroySelf() {
    nodeRef.parentNode.removeChild(nodeRef);
  }
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div
  bind:this={nodeRef}
  class="fixed z-10 inset-0 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <div
    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      aria-hidden="true"
    />

    <span
      class="hidden sm:inline-block sm:align-middle sm:h-screen"
      aria-hidden="true">&#8203;</span
    >
    <div
      class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
    >
      <div>
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
        >
          <svg
            class="h-6 w-6 text-green-600"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3
            class="text-lg leading-6 font-medium text-gray-900"
            id="modal-title"
          >
            {status}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              {conent || '我们已收到您的订单，感谢您的购买，我们会第一时间发货，请耐心等待！'}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-6">
        <button
          on:click={destroySelf}
          type="button"
          class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >继续浏览</button
        >
      </div>
    </div>
  </div>
</div>
