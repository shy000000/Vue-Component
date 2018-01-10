import Vue from 'vue'
import VueRouter from 'vue-router'
import Audio from '../components/Audio.vue'
Vue.use(VueRouter);
const routes = [
	{path:'/audio',component:Audio}
	/*{path:'/timeselect',component:TimeSelect}*/
]
const router = new VueRouter({
	routes
})
export default router