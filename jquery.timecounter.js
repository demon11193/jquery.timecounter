/* 
 * Счётчик времени
 * @autor demon112
 */
(function( $ ){
    
    function div(val, by){
        return (val - val % by) / by;
    }

    function timer($target) {
        $target.each(function() {
            let data = $(this).data('timecounter');
            
            if (!data) {
                return;
            }
            
            if (data['pause']) {
                return;
            }
            
            let now_interval;
            if (data.reverse) {
                now_interval = data.start_interval + data.start_time - (Math.round(new Date().getTime() / 1000));
            }
            else {
                now_interval = Math.round(new Date().getTime() / 1000) - data.start_time + data.start_interval;
            }
            if (now_interval < 0) {
                now_interval = 0;
                if (!$(this).hasClass('empty')) {
                    $(this).addClass('empty');
                }
            }
            else if ($(this).hasClass('empty')) {
                $(this).removeClass('empty');
            }
            
            let sec = now_interval;
            let min = div(now_interval, 60);
            sec -= min * 60;
            let hour = div(min, 60);
            min -= hour * 60;
            
            if (data['tip'] == 2) {
                let text = ((hour<10)?'0'+hour:hour) + ':' + ((min<10)?'0'+min:min) + ':' + ((sec<10)?'0'+sec:sec);
                if ($(this).text() != text) {
                    $(this).text(text);
                }
                return;
            }
            
            let days = div(hour, 24);
            hour -= days * 24;
            let text = days + ' д. ' + hour + ' ч. ' + min + ' м. ' + sec + ' с.';
            if ($(this).text() != text) {
                $(this).text(days + ' д. ' + hour + ' ч. ' + min + ' м. ' + sec + ' с.');
            }
        });
        
        setTimeout(function() {
            timer($target);
        }, 500);
    }
    
    let methods = {
        init: function(options) {
            var $this = $(this);
            setTimeout(function() {
                timer($this);
            }, 500)
            return this.each(function(){
                let data = $(this).data('timecounter');
                // Если плагин ещё не проинициализирован
                if (!data ) {
                  $(this).data('timecounter', {
                        target : $(this),
                        start_time : Math.round(new Date().getTime() / 1000),
                        start_interval : parseInt($(this).attr('start_interval')),
                        reverse : !!$(this).attr('reverse'),
                        tip : !$(this).attr('tip')?1:$(this).attr('tip'),
                  });
                }
            });
        },
        pause: function(options) {
            console.log('timecounter pause');
            let data = $(this).data('timecounter');
            if (data && !data.pause) {
                data.pause = true;
                if (data.reverse) {
                    data.start_interval = data.start_interval + data.start_time - (Math.round(new Date().getTime() / 1000));
                }
                else {
                    data.start_interval = Math.round(new Date().getTime() / 1000) - data.start_time + data.start_interval;
                }
            }
        },
        resume: function(options) {
            console.log('timecounter resume');
            let data = $(this).data('timecounter');
            if (data && data.pause) {
                data.pause = false;
                data.start_time = Math.round(new Date().getTime() / 1000);
            }
        },
    };
    
    $.fn.timecounter = function(method) {        
        if (!method) {
            method = 'init';
        }
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.timecounter' );
        } 
    };
})( jQuery );