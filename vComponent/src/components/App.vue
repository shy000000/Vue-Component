<template>
  <div id="app">
    <el-container style="height: 500px; border: 1px solid #eee">      
        <el-aside style="width:200px">            
            <nav-menu class="nav-menu"></nav-menu>
        </el-aside>   
    </el-container>            
      <!-- <li><router-link to="/audio">音频</router-link></li>
      <li><router-link to="/timeselect">日期选择器</router-link></li> -->
<!--       <router-link></router-link> -->
    <router-view></router-view>
  </div>
</template>

<script>
import navMenu from './nav.vue' 
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    navMenu
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  text-decoration: none;
}
/* nav.nav-menu{
    display: flex;
    justify-content: space-around;
}
nav.nav-menu li{
    flex:1;
}
nav.nav-menu>li>a{
    text-decoration: none;
} */
h1, h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
