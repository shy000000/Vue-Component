window.onload = function(){
    const ca = document.querySelector('#img-canvas');
    const ctx2 = ca.getContext('2d');
    const upload = document.getElementById('img-upload');
    const btn = document.getElementsByClassName('dirlog-upload')[0];
    btn.onclick = function(){
        $('#img-upload').click();
    }
    var img = new Image();
    img.src = './images/sun.jpg';
    /*img.onload = function(){
        ctx2.drawImage(img,0,0);
    }*/
    ctx2.drawImage(img,0,0,500,400);
}
nie.define(function() {
    /*图像处理部分*/
    Vue.config.devtools = true;
    /*Vue*/
    var wrapper = new Vue({
        el:'.wrapper',
        data:{
            isopacity:false,
            isClick:false,
            dirlogSeen:true,
            dirlogOpacity:0,
            dirlogHeight:0,
            dirlogIndex:0,
            imgSrc:'',
            rotateY:'translate(-50%,-50%) rotateY(0deg)',
            rotateY2:'translate(-50%,-50%) rotateY(-180deg)',
            backdirlogSeen:true,
            dirlogOpacity2:0,
            dirlogHeight2:0,
            dirlogIndex2:0,
            isLogin:false,
            isActive:true
        },
        computed:{
            maskSeen(){
                return this.dirlogOpacity===0?false:true;
            }
        },
        methods:{
            loginre(e,id){
                console.log(id);
                let user = this.user;
                let password = this.password;
                var self = this;
                $.ajax({
                    url:'http://localhost/test/test/plugin/php/user.php',
                    data:{
                        username:user,
                        password:password,
                        type:id?'login':''
                    },
                    success:function(data){
                        var data = JSON.parse(data);
                        switch(data.errorcode){
                            case 0:alert('登录成功');sessionStorage.setItem('user',user);break;
                            case -1:alert('密码错误');break;
                            case 1:alert('注册成功');sessionStorage.setItem('user',user);break;
                            case -99:alert('网络异常');break;
                            case -2:alert('用户名已存在');break;
                        }
                        /*self.dirlogOpacity = 0;
                        self.dirlogHeight = 0;
                        self.dirlogOpacity2 = 0;
                        self.dirlogHeight2 = 0;
                        self.rotateY = 'translate(-50%,-50%) rotateY(0deg)';
                        self.rotateY2 = 'translate(-50%,-50%) rotateY(-180deg)';
                        self.isLogin = true;*/
                        self.backdirlogSeen = true;
                        self.rotateY = 'translate(-50%,-50%) rotateY(180deg)',
                        self.rotateY2 = 'translate(-50%,-50%) rotateY(0deg)'
                    },
                    error:function(){
                        alert('网络异常')
                    }
                })
            },
            dirlogHide(){
                this.dirlogOpacity = 0;
                this.dirlogHeight = 0;
                this.dirlogOpacity2 = 0;
                this.dirlogHeight2 = 0;
                this.rotateY = 'translate(-50%,-50%) rotateY(0deg)';
                this.rotateY2 = 'translate(-50%,-50%) rotateY(-180deg)';
                this.isLogin = false;
            },
            dirlogUpload(){
                if(!sessionStorage.getItem('user')){
                    this.isLogin = true;
                }else{
                    this.backdirlogSeen = true;
                    this.rotateY = 'translate(-50%,-50%) rotateY(180deg)',
                    this.rotateY2 = 'translate(-50%,-50%) rotateY(0deg)'
                }
            },
            choosefile(){
                var file = $('input',{type:'file'});
                file.appendTo($('body'));
                console.log(file);
                file.click();
            }
        }
    })
    //相机最近距离
    const near =1;
    //相机最远距离
    const far = 1000;
    //相机距离场景长度
    var fov = 45;
    document.onmousewheel = scrollFunc;
    document.getElementsByTagName('body')[0].addEventListener('click',onDocumentMouseDown); 
    /*鼠标滚轮事件*/
    function scrollFunc(e){
        e.wheelDelta<0?fov+=(fov<far?1:0):fov-=(fov>near?1:0);
        camera.fov = fov;
        camera.updateProjectionMatrix();
    }
    /*获取鼠标点击物体*/
    function onDocumentMouseDown( event ) {
          event.preventDefault();
          var vector = new THREE.Vector3();//三维坐标对象
          vector.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );
          vector.unproject( camera );
          var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
          var intersects = raycaster.intersectObjects(scene.children);
          if (intersects.length > 0) {
            console.log(intersects);
            var selected = intersects[0];//取第一个物体
            showdirlog(selected);//显示行星弹窗*/
        }
    }
    /*显示弹窗*/
    function showdirlog(obj){
        wrapper.dirlogSeen = true;
        wrapper.dirlogOpacity = 1;
        wrapper.dirlogHeight = '400px';
        wrapper.dirlogIndex = 200;
        wrapper.dirlogSeen2 = true;
        wrapper.dirlogOpacity2 = 1;
        wrapper.dirlogHeight2 = '500px';
        wrapper.dirlogIndex2 = 200;
        $.ajax({
            url:'http://localhost/test/test/plugin/php/imgSrc.php',
            data:{
                name:obj.object.name
            },
            dataType:'json',
            success:function(data){
                console.log(data);
                wrapper.imgSrc = data.imgSrc;
                wrapper.message = data.content;
            },
            error:function(e){
                console.log(e.msg);
            }
        })
    }
    const canvas = document.querySelector('#main-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = '#000';
    /*画布点击全屏*/
    /*canvas.addEventListener('click',function(){
        wrapper.maskSeen = true;
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if(canvas.webkitEnterFullscreen){
            canvas.webkitEnterFullscreen();
        }
    },false);*/
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias : true
    });
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; //辅助线
    renderer.shadowMapSoft = true; //柔和阴影
    renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight, 1 ,2000);
    camera.position.set(0,20,80);
    camera.lookAt(new THREE.Vector3(0,0,0));
    var controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(
        camera.position.x,
        camera.position.y,
        camera.position.z - 0.15
    );
    controls.noPan = true;
    controls.noZoom = true;
    function setOrientationControls(e){
        if (e.alpha) {
            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
        }
        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);
    // Apply VR stereo rendering to renderer.
    /*var effect = new THREE.StereoEffect(renderer);*/
    scene.add(camera);
    //环境光
    var ambient = new THREE.AmbientLight(0x777777);
    scene.add(ambient);
    /*太阳光*/
    var sunLight = new THREE.PointLight(0xddddaa,3,500);
    scene.add(sunLight);
    /*太阳皮肤*/
    var sunSkinPic = THREE.ImageUtils.loadTexture('./images/sun.jpg');
    /*地球皮肤*/
    var earthSkinPic = THREE.ImageUtils.loadTexture('./images/earth.jpg');
    /*木星皮肤*/
    var jupiterSkinPic = THREE.ImageUtils.loadTexture('./images/jupiter.jpg');
    /*水星皮肤*/
    var mercurySkinPic = THREE.ImageUtils.loadTexture('./images/mercury.jpg');
    /*火星皮肤*/
    var marsSkinPic = THREE.ImageUtils.loadTexture('./images/mars.jpg');
    /*金星皮肤*/
    var venusSkinPic = THREE.ImageUtils.loadTexture('./images/venus.png');
    var initPlanet = function(name,revolutionSpeed,color,distance,volume,map) {
        var material;
        if(name == 'Sun'){
            material = new THREE.MeshLambertMaterial({
                emissive: 0xdd4422,
                map: map || ''
            });
        }else{
            material = new THREE.MeshLambertMaterial({
                color: color,
                map: map || ''
            });
        }
        var mesh = new THREE.Mesh( new THREE.SphereGeometry( volume, 50,50 ), material);
        mesh.position.x = -distance;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.name = name;
        var star = {
            name: name,
            angle: 0,
            revolutionSpeed: revolutionSpeed,
            distance: distance,
            volume: volume,
            Mesh : mesh
        };
        scene.add(mesh);
        var track = new THREE.Mesh( new THREE.RingGeometry(distance - 0.2, distance + 0.2, 100, 1),
            new THREE.MeshBasicMaterial( { color: 0xffffff,transparent: true, opacity: 0.1, side: THREE.DoubleSide } )
        );
        track.rotation.x = - Math.PI / 2;
        scene.add(track);
        return star;
    };
    var stars = {
        Sun: initPlanet('Sun',0,'rgb(237,20,0)',0,12,sunSkinPic),
        Mercury: initPlanet('Mercury',0.02,'rgb(124,131,203)',20,2,mercurySkinPic),
        Venus: initPlanet('Venus',0.012,'rgb(190,138,44)',30,4,venusSkinPic),
        Earth: initPlanet('Earth',0.01,'rgb(46,69,119)',40,5,earthSkinPic),
        Mars: initPlanet('Mars',0.008,'rgb(210,81,16)',50,4,marsSkinPic),
        Jupiter: initPlanet('Jupiter',0.006,'rgb(254,208,101)',70,9,jupiterSkinPic),
        Saturn: initPlanet('Saturn',0.005,'rgb(210,140,39)',100,7),
        Uranus: initPlanet('Uranus',0.003,'rgb(49,168,218)',120,4),
        Neptune: initPlanet('Neptune',0.002,'rgb(84,125,204)',150,3)
    };

    var revolution = function(star){
        if(!star.revolutionSpeed) return false;
        star.angle += star.revolutionSpeed;
        if (star.angle > Math.PI * 2) {
            star.angle -= Math.PI * 2;
        }
        star.Mesh.position.x = -star.distance * Math.cos(star.angle);
        star.Mesh.position.z = star.distance * Math.sin(star.angle);
    };
    /*背景星星*/
    var particles = 10000;  //星星数量
    /*buffer做星星*/
    var bufferGeometry = new THREE.BufferGeometry();

    /*32位浮点整形数组*/
    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );

    var color = new THREE.Color();

    var gap = 1000; // 定义星星的最近出现位置
    var zgap = 1000; //定义Z轴距离
    console.log(camera.position.z);
    for ( var i = 0; i < positions.length; i += 3 ) {
        // positions

        /*-2gap < x < 2gap */
        var x = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
        var y = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
        var z = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);

        /*找出x,y,z中绝对值最大的一个数*/
        var biggest = Math.abs(x) > Math.abs(y) ? (Math.abs(x) > Math.abs(z) ? 'x' : 'z') : (Math.abs(y) > Math.abs(z) ? 'y' : 'z');

        var pos = { x: x, y: y, z: z};

        /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
        if(Math.abs(pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap;

        x = pos['x'];
        y = pos['y'];
        z = pos['z'];

        positions[ i ]     = x;
        positions[ i + 1 ] = y;
        positions[ i + 2 ] = z;

        /*70%星星有颜色*/
        var hasColor = Math.random() < 0.3;
        var vx, vy, vz;

        if(hasColor){
            vx = (Math.random()+1) / 2 ;
            vy = (Math.random()+1) / 2 ;
            vz = (Math.random()+1) / 2 ;
        }else{
            vx = 1 ;
            vy = 1 ;
            vz = 1 ;
        }

        color.setRGB( vx, vy, vz );

        colors[ i ]     = color.r;
        colors[ i + 1 ] = color.g;
        colors[ i + 2 ] = color.b;

    }
    console.log(positions[2]);
    bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    bufferGeometry.computeBoundingSphere();

    /*星星的material*/
    var material = new THREE.PointsMaterial( { size: 6, vertexColors: THREE.VertexColors } );
    var particleSystem = new THREE.Points( bufferGeometry, material );
    scene.add( particleSystem );


    window.addEventListener('resize', function(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        /*effect.setSize(window.innerWidth, window.innerHeight);*/
    }, false );
    function limit(){
        var i=0;
        return function(){
            return ++i
        }
    }
    var add = limit();
    (function render(timestamp) {
        requestAnimationFrame(render);
        controls.update();
        /*太阳自转*/
        stars.Sun.Mesh.rotation.y = (stars.Sun.Mesh.rotation.y == 2*Math.PI ? 0.0008*Math.PI : stars.Sun.Mesh.rotation.y+0.0008*Math.PI);
        /*地球自转*/
        stars.Earth.Mesh.rotation.y = (stars.Earth.Mesh.rotation.y == 2*Math.PI ? 0.02*Math.PI : stars.Earth.Mesh.rotation.y+0.02*Math.PI);
        for(var k in stars){
            revolution(stars[k]);
        }
        renderer.render(scene, camera);
        /*effect.render(scene, camera);*/
    }());
});
