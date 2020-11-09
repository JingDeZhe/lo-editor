import Vue from 'vue'
import App from './App.vue'
import LoEditor from '../lib/lo-editor.umd.min';
// import LoEditor from '../packages/index';

Vue.use(LoEditor)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
