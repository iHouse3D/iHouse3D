$(function () {
    $('.login_heager span').click(function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        let int = $(this).index();
        if (int == 0) {
            $('.login_1').show();
            $('.login_2').hide();
        } else if (int == 1) {
            $('.login_1').hide();
            $('.login_2').show();
        }
    });
});

function loginOpen() {
    $('#login').show();
    linkTO = ''
}

// login_cont();

function login_cont() {
    let html = `<div class="login-bg" id="login">
			    <div class="login-box">
			        <img src="image/11.jpg" class="login-img">
			        <div>
			            <div class="close-box">
			                <div class="close" onclick="loginClose()"></div>
			            </div>
			            <div id="idLogin">
			                <div class="login_heager">
			                    <span class="login-text active">登录</span>
			                    <span class="login-text">手机登录</span>
			                </div>
			                <div class="login_1">
			                    <input type="text" class="id-input" autocomplete="off" required="required" placeholder="输入手机号/邮箱" id="name">
			                    <input type="password" class="id-input" autocomplete="off" required="required" placeholder="输入密码"
			                           id="password">
			                    <p class="login-btn" onclick="handleLoginClick()">登录</p>
			                </div>
			                <div class="login_2" style="display: none;">
			                    <input type="text" class="id-input" autocomplete="off" required="required" placeholder="请输入手机号" id="phone">
			                    <div class="input-cont">  
			                        <input type="text" class="id-input" autocomplete="off" required="required" placeholder="输入验证码"
			                               id="verification">
			                        <span class="verificationCode-btn" onclick="getPhoneNum(this)">获取验证码</span>
			                    </div>
			                    <p class="login-btn" onclick="verificationCodeLoginClick()">登录</p>
			                </div>  
			            </div>
			            <div id="wx-qrcode" style="display: none;margin-left: 120px"></div>
			            <div id="loginBtn-Box">
			                <p class="other-title">第三方登录</p>
			                <div class="other-box">
			                    <div class="wx" onclick="weChat()"></div>
			                    <div class="qq" onclick="qqLogin()"></div>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>`;
    $('body').append(html);
}

function verificationCodeLoginClick() {
    let tcode = document.getElementById('verification').value
    if (phoneNum === '' || tcode === '') {
        alert('请输入手机号或者验证码！')
    } else {
        if (tcode !== smsCode) {
            alert('验证码错误！')
        } else {
            let password = "123456"
            let authcode = ''
            let ip = ''
            CreateUserAccount(phoneNum, phoneNum, password, authcode, ip, phoneNum)
        }
    }
}

var phoneNum = ''
var firstTime = 60
var smsCode = ''

function getPhoneNum(obj) {
    let int_phone = $('#phone').val(), verification_int = $('#verification').val();
    if (!(/^1[3456789]\d{9}$/.test(int_phone))) {
        alert("手机号码有误，请重填");
        $('#phone').val('');
        return false;
    }
    phoneNum = document.getElementById('phone').value
    $.ajax({
        type: 'POST',
        async: false,
        url: 'http://www.ihouse3d.com.cn/PhoneRegister.asmx/GetSMSCode',
        data: {
            PhoneNumber: phoneNum
        },
        success: function (data) {
            data = JSON.parse(data)
            if (data.code === '1') {
                smsCode = data.smscode
                let changeFun = setInterval(function () {
                    if (firstTime > 0) {
                        obj.innerHTML = firstTime + '秒后可获取'
                        firstTime = firstTime - 1
                    } else {
                        obj.innerHTML = '获取验证码'
                        firstTime = 60
                        clearInterval(changeFun)
                    }
                    console.log(firstTime)
                }, 1000)
            }
        }
    })
}


function CreateUserAccount(userID, userName, userPassword, authcode, loginIP, phoneNum) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://www.ihouse3d.com.cn/service1.asmx', true);
    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
        '  <soap12:Body>' +
        '    <AutoLogin_SJS xmlns="http://tempuri.org/">' +
        '      <strUserAccount>' + userID + '</strUserAccount>' +
        '      <strUserName>' + encodeURIComponent(userName) + '</strUserName>' +
        '      <strPSW>' + userPassword + '</strPSW>' +
        '      <strAuthcode>' + authcode + '</strAuthcode>' +
        '      <strIP>' + loginIP + '</strIP>' +
        '      <strPhoneNumber>' + phoneNum + '</strPhoneNumber>' +
        '    </AutoLogin_SJS>' +
        '  </soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var strRes = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent
                let arrRes = strRes.split('~');
                document.cookie = 'ut=' + arrRes[3]
                document.cookie = 'gsID=' + arrRes[5]
                document.cookie = 'name=' + arrRes[1]
                document.cookie = 'useid=' + arrRes[1]
                location.reload()
                if (arrRes[0] != '1') {
                    //创建失败
                    alert('创建失败!')
                }
            }
        }
    }
}