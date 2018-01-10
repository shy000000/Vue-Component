import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './config/routerConfig'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './components/App.vue'
Vue.use(ElementUI,{size:'small'})
/*new Vue({
  el: '#app',
  render: h => h(App)
})
*/
const app = new Vue({
	el:'#app',
	router,
	render:h=>h(App)
})