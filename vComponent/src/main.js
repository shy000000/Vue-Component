import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './config/routerConfig'
import App from './components/App.vue'
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