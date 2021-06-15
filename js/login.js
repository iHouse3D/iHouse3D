var mUserAccount   = ""; //用户帐号
var mPWD		   = "";
var mCompanyID     = ""; //帐号所在公司的id
var mAccountType   = ""; //类型类型 11:超级帐号 0：企业  1：设计师  2：普通
var mUserFolder    = ""; //保存方案目录
var m_bDebugNow	   = false;
var m_UIType	   = 0;
var mPageName = '';

jQuery(document).ready(function() {
	//	SetLanguage('en');
	 LoginCheck();

	});

	function close(){
	   return $.i18n.prop('ExitNotify');
	}
	function Initialization(){
		var url = './img/login.jpg';
		_backgroundImg(url);
	}

	function main(){
		check();
	}
	
	function check(){
        var u = $('.mInputUser');
		var p = $('.mInputPassword');

        if (u.val() == '' || p.val() == '') {
            alert('用户名或密码不能为空');
            return false;
        }else{
            var reg = /^[0-9A-Za-z]+$/;
            if (!reg.exec(u.val())) 
            {
                alert('密码无效');
                return false;
            }
        }
        isLogin(u.val(),p.val());
    }
    
    function isLogin(userName,passWord){
        mUserAccount = userName;
        mPWD		 = passWord;
        sessionStorage.setItem('userAccount',mUserAccount);
		var strUUID = mPluginsClass.GenerateGuid();
    	var args = {
    		strName : userName,
    		strPSW : passWord,
            strAuthcode : strUUID,
            strIP:'',
    	};
    	getAjax(m_strWebService + "service1.asmx/Login", args, function (d, e) {
            if (e != null) {
                alert("服务器网络忙，请稍后再试!");
                return;
            }

            var strData = delHtmlTag(d);
            strData = strData.split('~');
            // console.log(strData);
            if (strData[0].replace(/[\r\n]/g,"")=='1') {
                if (new Date().getTime(strData[6])>new Date().getTime(strData[7])) {
                    alert($.i18n.prop('UserNameExpired'));
                }else{
					// 计算时间
					//================================================================================
					var strStartDate = strData[6];
					var arrStart 	 = strStartDate.split('-');

					//可以使用到的日期
					var strEndDate = strData[7];
					var arrEnd 	   = strEndDate.split('-');
					var startTime = new Date(arrStart[0], arrStart[1], arrStart[2]);
					//var endTime	  = new Date(arrEnd[0], parseInt(arrStart[1])-1, arrEnd[2]);
					var endTime = new Date(strEndDate);
					var curTime   = new Date();
					//if ( endTime.getTime() < curTime.getTime()) {
					if (curTime > endTime) {
						alert('用户账号已过期...')
						return false;
					}

                    sessionStorage.setItem('userAccount',strData[1]); //账户名
                    sessionStorage.setItem('userName',strData[2]); //用户名

                    //保存方案目录
                    mUserFolder = strData[2];
					sessionStorage.setItem('userFolder',mUserFolder);

                    //帐号所在公司的id
                    mCompanyID = strData[5];
					sessionStorage.setItem('companyID',mCompanyID);

                    //类型类型 11:超级帐号 0：企业  1：设计师  2：普通
                    mAccountType = strData[9];

                    try{
						document.getElementById("mCity").innerHTML =returnCitySN["cname"];
                    }catch(e){}

                    $('#mLoginBak').hide();	
                    $('#mLogin').hide();
                    $('#mLoginBK').hide();
                    

                    CheckUser1();
              			
              		mWebAPI	= new WebAPI();
              		mWebAPI.m_strUser = strData[1];
              		mWebAPI.m_strUUID = strUUID;
					mWebAPI.StartCheckLogin();

					//如果是设计师平台登录
					let loginType = localStorage.getItem('login_type');
					if('0' == loginType){
						let schemeaddr = localStorage.getItem('autologin_schemeaddr');
						//开启加载场景定时器
						loadSceneTimer = setInterval(LoadSceneTime,500,schemeaddr);
					}

					if("undefined" != typeof(m_PrivateLibrary) && true == m_PrivateLibrary)
					{	
						qyk_reload();
						grk_reload();
					}

                }
            }else{
                 alert(i18n.t(`Language.IncorrectUserNameOrPassword`));
            }
    	});
    }
    
    function CheckUser1()
    {
		$.ajax({
	        url: m_strWebService+'service1.asmx/GetFunctionList',
	        type: "get",
	        dataType: "text",
	        contentType: "application/x-www-form-urlencoded",
	        data: { CompanyID: mCompanyID},
		    success: function (data)
		    {
		    	var tNode = JSON.parse(data);
		    	var  xmlDoc = $.parseXML( tNode.function );
				if(xmlDoc == null)
				{
					alert("授权不存在，请联系技术支持!");
					return;
				}
								
				SetLogo();
				$('#mHZ0').hide();
								
				var $xml = $( xmlDoc );
				if($xml.find("结构").length > 0 && $xml.find("结构")[0].textContent == '1')
					InitAPI_Parts();

				if($xml.find("房间形状模板").length > 0 && $xml.find("房间形状模板")[0].textContent == '1')
					InitAPI_RoomTemplate();

				if($xml.find("门窗").length > 0 && $xml.find("门窗")[0].textContent == '1')
					InitAPI_DoorAndWindow();

				if($xml.find("快速预算").length > 0 &&  $xml.find("快速预算")[0].textContent != '1')
					$('#mBasicBudget').hide();
					

				if($xml.find("画墙").length > 0 && $xml.find("画墙")[0].textContent == '1')
					InitAPI_Base();

				if($xml.find("云币支付").length > 0 && $xml.find("云币支付")[0].textContent == '1')
					sessionStorage.setItem('UseYunbi','1');
					
				if($xml.find("渲染模块").length > 0 && $xml.find("渲染模块")[0].textContent == '0')
					$('#gRender').hide();
					
				if($xml.find("效果图册").length > 0 && $xml.find("效果图册")[0].textContent == '0')
					$('#gAlbum').hide();
				
		    },
		    error: function (err)
		    {
		        console.log(err);
		    }
	   });		
    }

    function SetLogo()
	{
		$('#mLogoText').hide();
		$('#shortcutIcon').attr('href','img/3d.png');
		$('.imgLogo > img').attr('src','img/3d.png');
		$('.imgLogoName').html("3D云设计");
	}

    function getAjax(url, params, callBack){
        $.ajax({
            type: 'get',
            dataType: "text",
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
    }

    function delHtmlTag(str){
      return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
    }

	function _backgroundImg(url){
		var Turl = url;
		var img = '<img id="bg_img" src='+Turl+'>';
		$('.bg').html(img);
	}

//-----------------------------自动登录------------------------------
//获取url中的参数
function GetParameterByName(url,name)
{
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function UnifiedLogin(userName,passWord)
{
	mUserAccount = userName;
	mPWD		 = passWord;
	sessionStorage.setItem('userAccount',mUserAccount);

	var args = {
		strName : userName,
		strPSW : passWord,
		strAuthcode : ' ',
		//  strIP : returnCitySN["cip"],
		strIP:'',
	};
	getAjax(`${m_strWebService}service1.asmx/AutoLogin`, args, function (d, e) {
		if (e != null) {
			console.log(e);
			alert('登录失败');
			return;
		}

		var strData = delHtmlTag(d);
		strData = strData.split('~');
		// console.log(strData);
		if (strData[0].replace(/[\r\n]/g,"")=='1') {
			if (new Date().getTime(strData[6])>new Date().getTime(strData[7])) {
				alert($.i18n.prop('UserNameExpired'));
			}else{
				sessionStorage.setItem('userAccount',strData[1]); //账户名
				sessionStorage.setItem('userName',strData[2]); //用户名

				//保存方案目录
				mUserFolder = strData[2];

				//帐号所在公司的id
				mCompanyID = strData[5];

				//类型类型 11:超级帐号 0：企业  1：设计师  2：普通
				mAccountType = strData[9];

				document.getElementById("mCity").innerHTML =returnCitySN["cname"];

				$('#mLoginBak').hide();
				$('#mLoginBK').hide();
				CheckUser1();
			}
		}else{
			alert(i18n.t(`Language.IncorrectUserNameOrPassword`));
		}
	});
}

function LoginCheck()
{
	let href =  window.location.href;

	//第三方调用打开方式
	if(-1 != href.indexOf('?type'))
	{
		//默认登录背景
		$('.pic-bg').append('<img id="mBackgroundImage" src="img/bg4.jpg" alt="">');

       let loginType = GetParameterByName(href,'type');

		//type=0 设计师平台，直接打开方案
        if('0' == loginType)
		{
			//?type=0&data=base64
			//base64= base64encode(&username=zhouqj&password=mfkydpl216&schemeaddr=http://www.ihouse3d.com.cn/users/share/chenx/savefile/E72F7967-1B74-D93B-BC68-F5999199B6DC/data_scene.xml)
			//username=用户帐号password=用户密码&schemeaddr=方案地址)

            let base64Data = GetParameterByName(href,'data');
            let data = base64_decode(base64Data);
			data = decodeURIComponent(data);
            let username =  GetParameterByName(data,'username');
			let password =  GetParameterByName(data,'password');
			let schemeaddr =  GetParameterByName(data,'schemeaddr');

			localStorage.setItem('login_type','0');
			localStorage.setItem('autologin_schemeaddr',schemeaddr);
			isLogin(username,password);
		}
	}
	else
	{


		//使用域名方式
		if(-1 == href.indexOf(".html"))
		{
			mPageName = "index";
		}
		else
		{
			let pos = href.lastIndexOf('/');
			let pos1 = href.toLowerCase().lastIndexOf('.html');
			let pageName = '';
			if(pos1 > pos)
			{
				mPageName = href.substring(pos+1,pos+pos1-pos);
			}
		}

		$('#mLogin').hide();
		$('#mLoginBK').show();

		//登录进度页面背景图
		$('.pic-bg').append(`<img id="mBackgroundImage" src="img/loading_${mPageName}.jpg" alt="">`);

		//登录背景图
		$('#mLoginBKImage').attr('src',`img/login_${mPageName}.jpg`);

		//登录输入帐号、密码背景
		$('#mLogin1').attr('src',`img/login_${mPageName}.png`);

	}
}

let loadSceneTimer = 0;
function LoadSceneTime(schemeaddr)
{
	if(mHouseClass.m_fontLoaded){
		clearInterval(loadSceneTimer);
		localStorage.setItem('login_type','')
		$('.createDesignClose').trigger("click");
		mPluginsClass.OnLoadScene(schemeaddr);
	}
}
