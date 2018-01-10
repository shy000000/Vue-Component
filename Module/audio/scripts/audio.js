;(function( $, window, document, undefined ) {
    var isTouch       = 'ontouchstart' in window,
        eStart        = isTouch ? 'touchstart'  : 'mousedown',
        eMove         = isTouch ? 'touchmove'   : 'mousemove',
        eEnd          = isTouch ? 'touchend'    : 'mouseup',
        eCancel       = isTouch ? 'touchcancel' : 'mouseup',
        isStart       = false,
        isPause       = false,
        isEnd         = false,
        isIos      = getPlatform()=='iphone',
        secondsToTime = function( secs )
        {
            var hours = Math.floor( secs / 3600 ), minutes = Math.floor( secs % 3600 / 60 ), seconds = Math.ceil( secs % 3600 % 60 );
            return ( hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0'+hours+':' : hours+':' ) + ( minutes.toString().length < 2 ? '0'+minutes : minutes ) + ':' + ( seconds.toString().length < 2 ? '0'+seconds : seconds );
        },
        canPlayType   = function( file )
        {
            var audioElement = document.createElement( 'audio' );
            return !!( audioElement.canPlayType && audioElement.canPlayType( 'audio/' + file.split( '.' ).pop().toLowerCase() + ';' ).replace( /no/, '' ) );
        },
        getTime = function(){
            return Math.floor(new Date().getTime()/1000);
        };
        $.fn.audioPlayer = function( params )
        {
            var params      = $.extend( { classPrefix: 'audioplayer', strPlay: 'Play', strPause: 'Pause', strVolume: 'Volume', skin: 'dark' }, params ),
                cssClass    = {},
                cssClassSub =
                {
                    playPause:      'playpause',
                    playing:        'playing',
                    time:           'time',
                    timeCurrent:    'time-current',
                    timeDuration:   'time-duration',
                    barWrapper:     'bar-wrapper',
                    bar:            'bar',
                    barLoaded:      'bar-loaded',
                    barPlayed:      'bar-played',
                    volume:         'volume',
                    volumeButton:   'volume-button',
                    volumeAdjust:   'volume-adjust',
                    noVolume:       'novolume',
                    mute:           'mute',
                    mini:           'mini'
                },
                currentTimed = 0,
                bted = 0;
                for( var subName in cssClassSub )
                    cssClass[ subName ] = params.classPrefix + '-' + cssClassSub[ subName ];
                this.each( function()
                {
                    if( $( this ).prop( 'tagName' ).toLowerCase() != 'audio' )
                        return false;
                    var $this      = $( this ),
                    audioFile  = $this.attr( 'src' ),
                    isAutoPlay = $this.get( 0 ).getAttribute( 'autoplay' ), isAutoPlay = isAutoPlay === '' || isAutoPlay === 'autoplay' ? true : false,
                    isLoop     = $this.get( 0 ).getAttribute( 'loop' ),     isLoop     = isLoop     === '' || isLoop     === 'loop'     ? true : false,
                    isSupport  = false;

                if( typeof audioFile === 'undefined' )
                {
                    $this.find( 'source' ).each( function()
                    {
                        audioFile = $( this ).attr( 'src' );
                        if( typeof audioFile !== 'undefined' && canPlayType( audioFile ) )
                        {
                            isSupport = true;
                            return false;
                        }
                    });
                }
                else if( canPlayType( audioFile ) ) isSupport = true;
                isSupport = true;
                var thePlayer = $('.audioplayer');
                    theAudio  = isSupport ? thePlayer.find( 'audio' ) : thePlayer.find( 'embed' ), theAudio = theAudio.get( 0 );
                $this.parents('.audio-wrapper').addClass(params.classPrefix + '-' + params.skin);
                if( isSupport )
                {
                    thePlayer.find( 'audio' ).css( { 'width': 0, 'height': 0, 'visibility': 'hidden' } );
                    var theWrapper        = thePlayer.find( '.' + cssClass.bar ),
                        theWrapper        = thePlayer.find('.'+cssClass.barWrapper),
                        barPlayed         = thePlayer.find( '.' + cssClass.barPlayed ),
                        barLoaded         = thePlayer.find( '.' + cssClass.barLoaded ),
                        timeCurrent       = thePlayer.find( '.' + cssClass.timeCurrent ),
                        timeDuration      = thePlayer.find( '.' + cssClass.timeDuration ),
                        volumeButton      = thePlayer.find( '.' + cssClass.volumeButton ),
                        volumeAdjuster    = thePlayer.find( '.' + cssClass.volumeAdjust + ' > div' ),
                        volumeDefault     = 0,
                        adjustCurrentTime = function( e )
                        {
                            theRealEvent         = isTouch ? e.touches[ 0 ] : e;
                            theAudio.currentTime = Math.round( ( GLOBAL.audioLength* ( theRealEvent.pageX - theWrapper.offset().left ) ) / theWrapper.width() );
                            if(theAudio.currentTime==0){
                                bted = getTime();
                            }
                        },
                        adjustVolume = function( e )
                        {
                            theRealEvent    = isTouch ? e.touches[ 0 ] : e;
                            theAudio.volume = Math.abs( ( theRealEvent.pageY - ( volumeAdjuster.offset().top + volumeAdjuster.height() ) ) / volumeAdjuster.height() );
                        },
                        updateLoadBar = setInterval( function()
                        {
                            //to fix the javascript bug INDEX_SIZE_ERR.
                            var oaudio  = document.getElementsByClassName('news-audio')[0];
                            if(oaudio.buffered.length > 0){
                                if(GLOBAL.audioLength > 0){
                                    barLoaded.width( ( theAudio.buffered.end( 0 ) / GLOBAL.audioLength)  + '%' );
                                }
                                if( oaudio.buffered.end( 0 ) >= GLOBAL.audioLength ){
                                    clearInterval( updateLoadBar );
                                }
                            }
                        }, 100 ); 
                        var volumeTestDefault = theAudio.volume, volumeTestValue = theAudio.volume = 0.111;
                        if( Math.round( theAudio.volume * 1000 ) / 1000 == volumeTestValue ) theAudio.volume = volumeTestDefault;
                        else thePlayer.addClass( cssClass.noVolume );
                        timeDuration.html( '&hellip;' );
                        timeCurrent.text( secondsToTime( 0 ) );
                        theAudio.addEventListener( 'timeupdate', function()
                        {
                            if(theAudio.currentTime==0&&!theAudio.paused){
                                bted = getTime();
                            }
                            timeCurrent.text( secondsToTime( theAudio.currentTime ) );
                            barPlayed.width( ( theAudio.currentTime / GLOBAL.audioLength*0.97 ) * 100 + '%' );
                        });
                        theAudio.addEventListener( 'volumechange', function()
                        {
                            volumeAdjuster.find( 'div' ).height( theAudio.volume * 100 + '%' );
                            if( theAudio.volume > 0 && thePlayer.hasClass( cssClass.mute ) ) thePlayer.removeClass( cssClass.mute );
                            if( theAudio.volume <= 0 && !thePlayer.hasClass( cssClass.mute ) ) thePlayer.addClass( cssClass.mute );
                        });
                        theAudio.addEventListener( 'ended', function()
                        {
                            isEnd = true;
                            theAudio.currentTime = 0;
                            thePlayer.removeClass( cssClass.playing );
                        });
                        theAudio.addEventListener('onerror',function(){
                        });
                        theWrapper.on( eStart, function( e )
                        {
                            currentTimed = Math.ceil(theAudio.currentTime);
                            if(!isIos){
                                adjustCurrentTime( e );
                                theWrapper.on( eMove, function( e ) { adjustCurrentTime( e ); } );
                            }
                        })
                        .on(eCancel,function(e){
                            theWrapper.unbind(eMove);
                        })
                        .on( eEnd, function( e )
                        {
                            theRealEvent = isTouch ? e.changedTouches[ 0 ] : e;
                            if(isEnd){
                                var s = Math.round( ( GLOBAL.audioLength* ( theRealEvent.pageX - theWrapper.offset().left ) ) / theWrapper.width());
                                if(s>currentTimed){
                                }else{
                                }
                            }
                            theWrapper.unbind( eMove );
                        });
                        volumeButton.on( 'click', function()
                        {
                            if( thePlayer.hasClass( cssClass.mute ) )
                            {
                                thePlayer.removeClass( cssClass.mute );
                                theAudio.volume = volumeDefault;
                            }
                            else
                            {
                                thePlayer.addClass( cssClass.mute );
                                volumeDefault = theAudio.volume;
                                theAudio.volume = 0;
                            }
                            return false;
                        });
                        volumeAdjuster.on( eStart, function( e )
                        {
                            adjustVolume( e );
                            volumeAdjuster.on( eMove, function( e ) { adjustVolume( e ); } );
                        })
                        .on( eCancel, function()
                        {
                            volumeAdjuster.unbind( eMove );
                        });
                }
                else thePlayer.addClass( cssClass.mini );
                if( isAutoPlay ) thePlayer.addClass( cssClass.playing );

                thePlayer.find( '.' + cssClass.playPause ).on( 'click', function()
                {
                    if( thePlayer.hasClass( cssClass.playing ) )
                    {
                        $( this ).attr( 'title', params.strPlay ).find( 'a' ).html( params.strPlay );
                        thePlayer.removeClass( cssClass.playing );
                        isSupport ? theAudio.pause() : theAudio.Stop();
                    }
                    else
                    {
                        $( this ).attr( 'title', params.strPause ).find( 'a' ).html( params.strPause );
                        thePlayer.addClass( cssClass.playing );
                        if(theAudio.currentTime!=0){
                        }else if(theAudio.currentTime==0){
                            bted = getTime();
                        }
                        isSupport ? theAudio.play() : theAudio.Play();
                        isStart = true;
                        isEnd = true;
                    }
                    return false;
                });
                });
                return this;
        };
        var UrlRep = /(.*?)\.mp3/i;
        var audioTitle = GLOBAL.audioTitle;
        var audioUrl = GLOBAL.audioUrl;
        var audioLength = GLOBAL.audioLength;
        //鍒ゆ柇鑾峰彇URL鏄惁姝ｇ‘
        if(UrlRep.test(audioUrl)&&audioUrl&&audioTitle){
            var seq = GLOBAL.seq;
            var opentime = Math.floor(new Date().getTime()/1000);
            var cssText = '<style>body{background:#e4e4e4;tap-highlight-color:transparent;-webkit-tap-highlight-color:transparent}.audio-wrapper{margin-left:4.6%;margin-right:4.6%;margin-top:25px;}.audioplayer-title{overflow:hidden;background:#2a2a2d;border-radius:4px 4px 0 0;font-size:13px;padding:17px 10px 0;padding-left:52px;color:#d2d2d3;}.audioplayer{height:30px;color:#fff;position:relative;z-index:1;background:#2a2a2d;border-radius:0 0 4px 4px;}.audioplayer-playpause{width:30px;/*40*/height:30px;text-align:left;text-indent:-9999px;background:url(//s.thsi.cn/css/m/zixun/images/u8.png) no-repeat 0 0;background-size:100%;cursor:pointer;z-index:2;position:absolute;top:0%;margin-top:-18px;left:12px;}.audioplayer-light .audioplayer-playpause{background-image:url(//s.thsi.cn/css/m/zixun/images/u8.png);}.audioplayer-bar{position:absolute;height:2px;left:3px;right:0px;top:6px;}.audioplayer-bar-wrapper{position:absolute;height:30px;left:50px;right:12px;top:0px;}.audioplayer-bar-loaded,.audioplayer-bar-played{position:absolute;height:100%;left:0;top:0;border-radius:5px;}.audioplayer-bar{background:#333333;border-radius:3px;}.audioplayer-bar-played{background:#e93030;}.audioplayer-bar-played:after{content:"";position:absolute;right:0;margin-right:-9px;margin-top:-4px;width:6px;height:6px;border:2px solid #e93030;background:#e93030;border-radius:12px;}.audio-time-wrapper{position:absolute;top:-66.7%;right:12px;height:20px;line-height:20px;font-size:12px;color:#535354;}.audioplayer-volume{display:none;}.audioplayer-light .audioplayer-title{color:#333;background:#fff;}.audioplayer-light .audioplayer{background:#fff;}.audioplayer-light .audioplayer-bar{background:#d2d2d2;border-radius:3px;}.audioplayer-light .audioplayer-bar-played{background:#e93030;}.audioplayer-light .audio-time-wrapper{color:#999999;}.audioplayer-playing .audioplayer-playpause{background-image:url(//s.thsi.cn/css/m/zixun/images/u7.png);}.audioplayer-light .audioplayer-playing .audioplayer-playpause{background-image:url(//s.thsi.cn/css/m/zixun/images/u7.png);}</style>';           
            $('.audio-wrapper').show();
            $('.audio-wrapper').append(cssText);
            $('.audioplayer-title').text(audioTitle);
            $('.news-audio').attr('src',audioUrl);
            var ua = navigator.userAgent.toLowerCase(); 
            if (/android/.test(ua)) {
                $('.audio-wrapper').css({'background-color':'#373739'});
                $('.audioplayer-title').css({'background-color':'#373739'});
                $('.audioplayer').css({'background-color':'#373739'});
                $('.audioplayer-bar').css({'background-color':'#333333'});
            }
            $('.news-audio').eq(0).audioPlayer({
                skin: 'light'
            })
        }
        $('.audioplayer-time-duration').text(secondsToTime(audioLength));
})( $,window,document);




