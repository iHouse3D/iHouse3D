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
    if(key.length>0){       
       if(key[1]== "GetHouseType"){
			$("#mBak").hide()
			$('.createDesign').hide();
			var i = event.newValue.indexOf("//");
			var str=event.newValue;
			    str=str.substring(i);
			console.log("GetHouseType=" + str);
			mPluginsClass.OnLoadHouse(str);       	
       }
       if(key[1]== "GetModelXML"){
			$("#mBak").hide()
			$('.createDesign').hide();
      		var infoXML  = sessionStorage.getItem("ihouse_model_xml");
      		var bType  = sessionStorage.getItem("ihouse_model_type");
      		if( bType == 1)
      			m_ParamObjDlg.OnUpdate3DModel(infoXML);
      		return;
       }  
    }
});





