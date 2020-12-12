import Vue from 'vue';
import App from './App.vue';

import './plugins/element.js';
import './plugins/axios.js';

import store from './store.js';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
}).$mount('#app');
