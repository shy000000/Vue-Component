var carousel = {
	//轮播初始化
	init:function(has_Btn){
		var self = this;
		var othis = this;
		this.container = document.getElementById('carousel-container');
		this.obanner   = document.getElementById('carousel-banner');
		this.oli       = this.obanner.getElementsByTagName('li');
		this.obtnlist  = document.getElementById('carousel-btn-list');
		this.olength   = this.oli.length;
		this.owidth    = this.oli[0].offsetWidth;
		this.oindex    = 0;
		this.eStart    = 'ontouchstart' in window?'touchstart':'mousedown';
		this.eMove     = 'ontouchmove'  in window?'touchmove':'mouseover';
 		this.eEnd      = 'ontouchend'   in window?'touchend':'mouseup';
		this.eCancel   = 'ontouchcancel'in window?'touchcancel':'mouseup';
		if(has_Btn){
			var oleftbtn        =  document.createElement('div');
			var orightbtn       =  document.createElement('div');
			oleftbtn.innerHTML  =  '<';
			orightbtn.innerHTML =  '>';
			oleftbtn.className  =  'carousel-left-btn';
			orightbtn.className =  'carousel-right-btn';
			oleftbtn.addEventListener(this.eStart,function(){
				othis.prev();
			})
			orightbtn.addEventListener(this.eStart,function(){
				othis.next();
			})
			this.container.appendChild(oleftbtn);
			this.container.appendChild(orightbtn);
		}
		if(this.olength===1){
			return 
		}else{
			for(var i=0;i<this.olength;i++){
				(function(i){
					var obtn          =	document.createElement('li');
					obtn.className    = 'carousel-btn';
					obtn.onclick      =	function(){
						self.move(i);
					};
					self.obtnlist.appendChild(obtn);
				})(i)
			}
			this.obtn   = this.obtnlist.getElementsByClassName('carousel-btn');
			this.obtn[0].style.backgroundColor = '#FF9224';
			this.oclock = setInterval(function(){
				self.next()
			},3000);
			this.container.addEventListener(this.eStart,function(e){
				clearInterval(othis.oclock);
				othis.startX = e.touches[0].pageX;
			})
			this.obanner.addEventListener(othis.eMove,function(e){
					clearInterval(othis.oclock);
					othis.endX  =  e.touches[0].pageX;
					var moveX   =  othis.endX-othis.startX;
					othis.obanner.style.transform = 'translateX('+moveX+'px)';
			})
			this.container.addEventListener(this.eEnd,function(e){
				othis.endX   = e.changedTouches[ 0 ].pageX;
				/*othis.endX-othis.startX<0?othis.next():othis.prev();*/
				if(othis.endX-othis.startX<0){
					othis.next();
				}else if(othis.endX-othis.startX>0){
					othis.prev();
				}
				othis.oclock = setInterval(function(){
					othis.next();
					othis.obanner.removeEventListener(othis.eMove,function(e){
						e.preventDefault();
						clearInterval(othis.oclock);
						othis.endX  =  e.touches[0].pageX;
						console.log(othis.endX);
						var moveX   =  othis.endX-othis.startX;
						othis.obanner.style.transform = 'translateX('+moveX+'px)';
					});
				},3000);
			})
		}
	},
	move: function(index){
		var startLeft  =  this.obanner.offsetLeft,
		    endLeft    =  -index*this.owidth+'px',
		    othis      =  this;
		for(var i=0;i<this.obtn.length;i++){
			i==index?this.obtn[i].style.backgroundColor='#FF9224':this.obtn[i].style.backgroundColor='#ADADAD';
		}
		this.obanner.style.transform = 'translateX('+endLeft+')';
	},
	next:function(){
		this.oindex++;
		this.oindex>this.olength-1?this.oindex = 0:'';
		this.move(this.oindex);
	},
	prev:function(){
		this.oindex--;
		this.oindex<0?this.oindex=this.olength-1:'';
		this.move(this.oindex);
	}
}
carousel.init(true);
