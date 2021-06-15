//Define
var localStorage_key_prefix = "housecloud";

tools = {

    ajaxGet: function (url, params, callBack) {
        $.ajax({
            type: 'get',
            dataType:'jsonp',
            url: url,
            data: params,
            success: function (d) {
                if (callBack !== null && callBack !== undefined && typeof callBack === "function") {
                    callBack(d);
                }
            },
            error: function (d) {
                if (callBack !== null && callBack !== undefined && typeof callBack === "function") {
                    callBack(null, d);
                }
            }
        });
    },
    ajaxPost: function (url, postData, callBack) {
        $.ajax({
            type: 'post',
            dataType: "text",
            url: url,
            data: postData,
            cache: false,
            async: false,
            success: function (d) {
                if (callBack !== null && callBack !== undefined && typeof callBack === "function") {
                    callBack(d);
                }
            },
            error: function (e) {
                if (callBack !== null && callBack !== undefined && typeof callBack === "function") {
                    callBack(null, e);
                }
            }
        });
    },
    objHasValue: function (e, key, v) {
        for (var i = 0; i < e.length; i++) {
            if (e[i][key] === v) {
                return true;
            } else {
                continue;
            }
        }
        return false;
    },
    objGetValue: function (e, key, v, el) {
        for (var i = 0; i < e.length; i++) {
            if (e[i][key] === v) {
                return e[i][el];
            } else {
                continue;
            }
        }
        return null;
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return unescape(r[2]);
        }
        return null;
    },
    randomString: function (n) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
};

//���ش洢
localData = {
    hname: location.hostname ? location.hostname : 'localStatus',
    isLocalStorage: window.localStorage ? true : false,
    dataDom: null,

    initDom: function () { //��ʼ��userData
        if (!this.dataDom) {
            try {
                this.dataDom = document.createElement('input');//����ʹ��hidden��inputԪ��
                this.dataDom.type = 'hidden';
                this.dataDom.style.display = "none";
                this.dataDom.addBehavior('#default#userData');//����userData���﷨
                document.body.appendChild(this.dataDom);
                var exDate = new Date();
                exDate = exDate.getDate() + 30;
                this.dataDom.expires = exDate.toUTCString();//�趨����ʱ��
            } catch (ex) {
                return false;
            }
        }
        return true;
    },
    set: function (key, value) {
        if (this.isLocalStorage) {
            try {
                window.localStorage.setItem(key, value);
            } catch (oException) {
                if (oException.name === 'QuotaExceededError') {
                    console.log('�Ѿ��������ش洢�޶���С��');
                    this.clear();
                    //localStorage.setItem(key, value);
                }
            }
        } else {
            if (this.initDom()) {
                this.dataDom.load(this.hname);
                this.dataDom.setAttribute(key, value);
                this.dataDom.save(this.hname)
            }
        }
    },
    get: function (key) {
        if (this.isLocalStorage) {
            return window.localStorage.getItem(key);
        } else {
            if (this.initDom()) {
                this.dataDom.load(this.hname);
                return this.dataDom.getAttribute(key);
            }
        }
    },
    remove: function (key) {
        if (this.isLocalStorage) {
            localStorage.removeItem(key);
        } else {
            if (this.initDom()) {
                this.dataDom.load(this.hname);
                this.dataDom.removeAttribute(key);
                this.dataDom.save(this.hname)
            }
        }
    },
    clear: function () {
        if (this.isLocalStorage) {
            localStorage.clear();
        }
    }
}
thirdLogin = {
    wx: function (contianer) {
        var state = tools.randomString(16); //todo:v��ֹ��վ�÷��������
        localData.set("Housecloud:WxStateCode", state);
        return new WxLogin({
            id: contianer,
            appid: "wx5df9ca19a01bb06d",
            scope: "snsapi_login",
            redirect_uri: encodeURIComponent("http://www.ihouse3d.com/wxcallback.html"),
            state: state,
            style: "blank",
            href: ""//https://121.196.198.119/css/open.css
        });
    },
    //APP 101856356
    //APP 登录qq互联管理查看
    qq: function () {
        var state = tools.randomString(16); //todo:v��ֹ��վ�÷��������
        localData.set("Housecloud:QqStateCode", state);
        var params = [];
        params.push('client_id=101856356');
        params.push('redirect_uri=http://www.ihouse3d.com/qqcallback.html');
        params.push('scope=get_user_info,list_album,upload_pic,add_feeds,do_like');
        params.push('state=' + state);
        params.push('response_type=code');
        params.push('display=pc');//pc,mobile
        //return 'https://graph.qq.com/oauth2.0/authorize?' + params.join('&');
        window.open('https://graph.qq.com/oauth2.0/authorize?' + params.join('&'), '_self');

    }
};

thirdPay = {
    //args:{ trade_no: trade_no, subject: subject, amout: amout, remark: remark }
    ali: function (args) {

    }
}


