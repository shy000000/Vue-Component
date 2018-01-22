<style type="text/css">
    *{
        margin:0px;
        padding:0px;
    }
    .v-nav{
        width: 100%;
        background: #ffffff;
        position: relative;
        font-size: 18px;
        margin: 0 auto;
        border-bottom: 1px solid #cccccc;
        box-sizing: content-box;
        height: 60px;
        line-height: 60px;
    }
    .v-nav-wrapper{
        width: 1260px;
    }
    .v-main-nav{
        width: 100%;
    }
    .v-main-nav>li{
        padding:10px;
        margin:0 15px;
        height: 100%;
        line-height: 100%;
        box-sizing: content-box;
    }
    .v-main-nav>li:hover{
        border-top: 3px solid #6190e8;
        transition: all 0.3s;
    }
    .v-sub-nav{
        transition: all 0.3s;
        display: none;
    }
</style>
<template>		
    <nav class="v-nav">
        <div class="v-nav-wrapper">
            <ul class="v-main-nav">
                <li>组件列表</li>
                <ul class="v-sub-nav">
                    <li>音频播放器</li>
                    <li>时间选择器</li>
                    <li>表格</li>
                </ul>
                <li>技术博客</li>
                <li>个人主页</li>        
            </ul>
        </div>
    </nav>
</template>
<script>
	import Vue from 'vue'
	export default {
		name:'nav-menu',
		data(){
			return {
	        	isCollapse: true
	      	};
	    },
	    methods: {
	      	handleOpen(key, keyPath) {
	        	console.log(key, keyPath);
	      	},
	      	handleClose(key, keyPath) {
	        	console.log(key, keyPath);
	      	}
	    }
	}
</script>