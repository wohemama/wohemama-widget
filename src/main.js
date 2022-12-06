import './app.css'
import App from './App.svelte'

window.WohemamaCartSettings = {
  publicApiKey: 'wuzhenyu2@mail.smallsticker.com',
  shipping: 0,
}

const target = document.querySelector('body')

document.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'wohemama-cart-add-item') {
    new App({
      target,
      props: {
        detail: e.target.dataset,
        dataset: { shipping: window.WohemamaCartSettings.shipping },
      },
    })
  }
})
