/*! eventJS v1.0 by roomanl, https://github.com/roomanl/eventJS */
var Evt={
    callback:[],
    sendEvent:function(key,value){
        var uuid=this.uuid(8,16);
        localStorage.setItem('evt_'+key, uuid+'_'+value);
    },
    addEvent:function(key,callback){
        if(this.callback.length>0){
            var b=false;
            for(var i in this.callback){
                var item=this.callback[i];
                if(item.key==key){
                    this.callback[i].callback=callback;
                    b=true;
                }
            }
            if(!b){
                var data={key:key,callback:callback};
                this.callback.push(data);
            }
        }else{
            var data={key:key,callback:callback};
            this.callback.push(data);
        }
         
    },

    uuid:function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          var r;
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
     
        return uuid.join('');
    }
};
window.addEventListener("storage", function(event){  
    if(event.key.indexOf('evt_')<0) return;
    var key=event.key.split('_');
    if(Evt.callback.length>0){
        for(var j in Evt.callback){
            if(key[1]== Evt.callback[j].key){
                var start=event.newValue.indexOf('_')+1;
                var end=event.newValue.length;
                var value=event.newValue.substring(start,end);
                Evt.callback[j].callback(Evt.callback[j].key, value);
                break;
            }
        }
    }
});

