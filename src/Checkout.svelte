<script>
  import { redirectPayReturnHost, wohemamaApi } from "../utils";
  import { amapApi } from "../utils";
  import QrCode from "svelte-qrcode";
  import Result from "./Result.svelte";

  import Cart from "./Cart.svelte";
  import Big from "big.js";

  let shipping = 0

  const platform = navigator.platform;
  const isDesktop =
    /(Win32|Win16|WinCE|Mac68K|MacIntel|MacIntel|MacPPC|Linux mips64)/i.test(
      platform
    );

  let nodeRef;

  let name;
  let phone;

  let province;
  let city;
  let district;
  let street;

  let payMethod;

  let provinces = [];
  let cities = [];
  let districts = [];

  let check = true;
  let qrCodeValue = null;
  let payUrl = null;
  let timeID;

  async function getNext(current = "") {
    const res = await amapApi.get("/v3/config/district", {
      params: {
        keywords: current,
        subdistrict: 1,
        key: "98584feda0cc0dfe30da12ba75c12d8b",
      },
    });
    if (res.data.status === "1") {
      return res.data.districts[0].districts;
    } else {
      throw new Error(res.data.info);
    }
  }

  async function getProvince() {
    provinces = await getNext();
    cities = [];
  }

  async function getCity() {
    cities = await getNext(province);
    districts = [];
  }

  async function getDistrict() {
    districts = await getNext(city);
  }

  async function pay() {
    check = false;
    if (
      !!name &&
      !!phone &&
      !!province &&
      !!city &&
      !!district &&
      !!street &&
      !!payMethod
    ) {
      const res = await wohemamaApi.post("/api/orders", {
        name,
        phone,
        province,
        city,
        district,
        street,
        payMethod,
        cartData: localStorage.cartData,
        platform,
        seller: window.WohemamaCartSettings.publicApiKey,
      });
      qrCodeValue = null;
      const target = document.querySelector("body");

      if (res.status === 204) {
        console.log(403);
        return new Result({
          target,
          props: {
            status: "服务器拒绝请求！",
            conent: "服务器拒绝请求，请联系客服处理！",
          },
        });
      }

      if (res.data.isQrcode) {
        qrCodeValue = res.data.url;
        payUrl = res.data.url;

        const outTradeNo = res.data.outTradeNo;
        timeID = setInterval(async () => {
          const res = await wohemamaApi.get("/api/orders", {
            params: { outTradeNo },
          });
          if (res.data.status && res.data.status === "支付成功") {
            localStorage.cartData = null;
            destroySelf();

            new Result({
              target,
              props: {
                status: res.data.status,
                conent:
                  "我们已收到您的订单，感谢您的购买，我们会第一时间发货，请耐心等待！",
              },
            });
            clearInterval(timeID);
          }
        }, 1000);
      } else if (res.data.isH5) {
        location.href =
          res.data.url +
          "&redirect_url=" +
          encodeURIComponent(
            `${redirectPayReturnHost}/pay-return/?out_trade_no=${outTradeNo}`
          );
        return;
      } else {
        location.href = res.data.url;
      }
    }
  }

  function destroySelf() {
    nodeRef.parentNode.removeChild(nodeRef);
  }

  async function handleReGetShipping(e) {
    const res =  await wohemamaApi.get('/api/shipping', {params: {userEmail: window.WohemamaCartSettings.publicApiKey, count: e.detail.count, weight: e.detail.weight}})
    shipping = res.data.shipping
  }
</script>

<div
  bind:this={nodeRef}
  class="fixed inset-0 overflow-hidden mt-0 sm:mt-0 bg-gray-100 overflow-y-scroll"
>
  <div class="mt-5 ml-5 flex  text-sm text-center text-gray-500">
    <p>
      <button
        on:click={destroySelf}
        type="button"
        class="text-indigo-600 font-medium hover:text-indigo-500"
        ><span aria-hidden="true"> &larr;</span> 继续购物</button
      >
    </p>
  </div>
  <div class="md:grid md:grid-cols-3 md:gap-6">
    <div class="mt-5 md:mt-0 md:col-span-2">
      <div class="px-4 py-5 sm:p-6">
        <h1 class="text-md font-medium leading-6 text-gray-900">收货人信息</h1>
        <div class="grid grid-cols-6 gap-6 mt-5">
          <div class="col-span-6 sm:col-span-3 ">
            <label for="name" class="block text-sm font-medium text-gray-700"
              >姓名</label
            >
            <input
              type="text"
              bind:value={name}
              id="name"
              autocomplete="name"
              class="mt-1 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            <span class="text-red-500" class:hidden={check || !!name}
              >姓名是必填项</span
            >
          </div>
          <div class="col-span-6 sm:col-span-3">
            <label for="phone" class="block text-sm font-medium text-gray-700"
              >电话</label
            >
            <input
              type="text"
              bind:value={phone}
              id="phone"
              autocomplete="phone"
              class="mt-1 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            <span
              class="text-red-500"
              class:hidden={check ||
                (!!phone &&
                  /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/.test(
                    phone
                  ))}>电话是必填项，并且是格式正确的</span
            >
          </div>
          <div class="col-span-6 sm:col-span-3">
            <label
              for="province"
              class="block text-sm font-medium text-gray-700">省份</label
            >
            <select
              bind:value={province}
              on:focus={async () => await getProvince()}
              id="province"
              name="province"
              autocomplete="province"
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>请选择省份</option>
              {#if provinces.length > 0}
                {#each provinces as province}
                  <option value={province.name}>{province.name}</option>
                {/each}
              {/if}
            </select>
            <span
              class="text-red-500"
              class:hidden={check || (province !== "请选择省份" && !!province)}
              >省份是必选项</span
            >
          </div>
          <div class="col-span-6 sm:col-span-6 lg:col-span-3">
            <label for="city" class="block text-sm font-medium text-gray-700"
              >城市</label
            >
            <select
              bind:value={city}
              on:focus={async () => await getCity()}
              id="city"
              name="city"
              autocomplete="country"
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>请选择城市</option>
              {#if cities.length > 0}
                {#each cities as city}
                  <option value={city.name}>{city.name}</option>
                {/each}
              {/if}
            </select>
            <span
              class="text-red-500"
              class:hidden={check || (city !== "请选择城市" && !!city)}
              >城市是必选项</span
            >
          </div>
          <div class="col-span-6 sm:col-span-3 lg:col-span-3">
            <label
              for="district"
              class="block text-sm font-medium text-gray-700">区县</label
            >
            <select
              bind:value={district}
              on:focus={async () => await getDistrict()}
              id="district"
              name="district"
              autocomplete="district"
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>请选择区县</option>
              {#if districts.length > 0}
                {#each districts as district}
                  <option value={district.name}>{district.name}</option>
                {/each}
              {/if}
            </select>
            <span
              class="text-red-500"
              class:hidden={check || (district !== "请选择区县" && !!district)}
              >区县是必选项</span
            >
          </div>
          <div class="col-span-6">
            <label for="street" class="block text-sm font-medium text-gray-700"
              >详细地址</label
            >
            <input
              type="text"
              bind:value={street}
              id="street"
              autocomplete="street"
              class="mt-1 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            <span class="text-red-500" class:hidden={check || !!street}
              >详细地址是必填项</span
            >
          </div>
        </div>
        <div class="hidden sm:block" aria-hidden="true">
          <div class="py-5">
            <div class="border-t border-gray-200" />
          </div>
        </div>
        <h1 class="text-md font-medium leading-6 text-gray-900">
          支付相关信息
        </h1>
        <div class="grid grid-cols-6 gap-6 mt-5">
          <div class="col-span-3">
            <label for="street" class="block text-sm font-medium text-gray-700"
              >支付方式</label
            >
            <select
              bind:value={payMethod}
              id="pay-method"
              name="pay-method"
              autocomplete="pay-method"
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">请选择支付方式</option>
              <option value="tenpay">微信支付</option>
              <option value="alipay">支付宝</option>
            </select>
            <span class="text-red-500" class:hidden={check || !!payMethod}
              >支付方式是必选项</span
            >
            <div class="mt-6">
              <button
                on:click={pay}
                class="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >{isDesktop
                  ? "确认信息并显示支付二维码"
                  : "确认信息并跳转到支付APP"}</button
              >
            </div>
          </div>
          <div class="col-span-3 flex justify-center">
            {#if qrCodeValue}
              <QrCode size={150} value={qrCodeValue} />
            {:else if payMethod === "alipay"}
              <iframe src={payUrl} title="支付宝二维码" />
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="md:col-span-1 mt-5">
      <div class="px-4 sm:px-0 mr-5">
        <h1 class="text-md font-medium leading-6 text-gray-900">订单摘要</h1>
        <div class="bg-white rounded-md mt-2 h-full flex flex-col">
          <Cart let:totalPrice on:reGetShipping={handleReGetShipping}>
            <div slot="checkout">
              <dl class="border-t border-gray-200  py-4">
                <div
                  class="flex justify-between text-base font-medium text-gray-900 "
                >
                  <dt>运费：</dt>
                  <dd>{shipping}</dd>
                </div>

                <div
                  class="flex items-center justify-between border-t border-gray-200 pt-6"
                >
                  <dt class="text-base font-medium">总计</dt>
                  <dd class="text-base font-medium text-gray-900">
                    {(new Big(Number(totalPrice)).plus(Number(shipping)))}
                  </dd>
                </div>
              </dl>
            </div>
          </Cart>
        </div>
      </div>
    </div>
  </div>
</div>
