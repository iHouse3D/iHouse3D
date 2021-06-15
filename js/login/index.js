var advPic = 1
// var changeBg = setInterval(advChange, 3000)
var itemArr = []
var m_strWebService = 'http://www.ihouse3d.com.cn/';
var mUserFolder = 'chenx'
var linkTo = ''

function GetRequest() {
    var url = document.cookie;
    var theRequest = {};
    var strs = url.split(";");
    // console.log(strs)
    for (var i = 0; i < strs.length; i++) {
        strs[i] = strs[i].replace(" ", "")
        theRequest[strs[i].split("=")[0].substring(0, 5)] = strs[i].split("=")[1];
    }

    return theRequest;
}

var a = GetRequest()
// console.log(a)
var name = a.name
var useId = a.useid
var headerImg = a.heade
var passWord = a.passW
var payData = {
    type: 2,
    user_account: name
}
/*window.onload = function () {

    if (name !== 'undefined') {
        document.getElementById('nameBox').innerHTML = name
        document.getElementById('nameBox').onclick = ''
        document.getElementById('informationName').innerHTML = name
        document.getElementById('_informationName').innerHTML = name
        document.getElementById('_nameBox').innerHTML = name
        document.getElementById('_nameBox').onclick = ''
        if (useId !== undefined) {
            name = useId
            payData.user_account = name
        }
        $.ajax({
            type: 'POST',
            url: 'http://www.ihouse3d.com.cn/PayWebService.asmx/Payment',
            dataType: 'json',
            data: {
                PayData: JSON.stringify(payData)
            },
            success: function (data) {
                // console.log(data)
                document.getElementById('information-bi').innerHTML = data.count
            }
        })


        if (headerImg !== undefined) {
            document.getElementById('headerImg').src = headerImg
        }
    }
}*/

function loginClose() {
    document.getElementById('login').style.display = 'none'
    document.getElementById('idLogin').style.display = 'block'
    document.getElementById('loginBtn-Box').style.display = 'block'
    document.getElementById('wx-qrcode').style.display = 'none'
}

// function advChange() {
//     if (advPic === 1) {
//         document.getElementById('bg').style.backgroundColor = '#3bc66f';
//         document.getElementById('dBtn').style.backgroundColor = '#178fff'
//         advPic = 2
//     } else if (advPic === 2) {
//         document.getElementById('bg').style.backgroundColor = '#178fff';
//         document.getElementById('dBtn').style.backgroundColor = '#3bc66f'
//         advPic = 1
//     }
// }
//
// function advPicChangeLeft() {
//     clearInterval(changeBg)
//     advChange()
//     changeBg = setInterval(advChange, 3000)
// }
//
// function advPicChangeRight() {
//     clearInterval(changeBg)
//     advChange()
//     changeBg = setInterval(advChange, 3000)
// }

function goTo3D() {
    //window.open('http://www.ihouse3d.com.cn/h5/')
    let cookie = GetRequest();
    if (!cookie.name) {
        window.open('http://www.ihouse3d.com.cn/h5/index.html')
    } else {
        let userName = cookie.name;
        let timeStamp = Date.parse(new Date());
        timeStamp = parseInt(timeStamp) / 1000;
        let random = timeStamp; //随机数
        let encodeData = `auth=${random}&timestamp=${timeStamp}&userid=${userName}&username=${userName}&key=PkRp3lrUAyL95Ku7FHzYvFA92LRugz0tFqrquFgzZQrHqZvFZpB2qqz`;
        let singData = hex_md5(encodeData).toLowerCase();

        window.open(`http://www.ihouse3d.com.cn/h5/index.html?auth=${random}&timestamp=${timeStamp}&userid=${userName}&username=${userName}&sign=${singData}`);
    }
}

function GetInfoFromShare() {
    let dataArr = []
    let nullArr = []
    $.ajax({
        type: 'POST',
        url: 'http://www.ihouse3d.com.cn/service1.asmx/GetShareScheme',
        async: false,
        success: function (data) {
            data = JSON.parse(JSON.parse(data).data)
            let newData = data.filter(function (ele) {
                return ele.scenename.includes('diaoding')
            })
            // console.log(data)
            let deleteNum = []
            for (let i = 0; i < newData.length; i++) {
                for (let a = 0; a < data.length; a++) {
                    if (data[a].scenename === newData[i].scenename) {
                        deleteNum.push(a)
                    }
                }
            }
            for (let i = 0; i < deleteNum.length; i++) {
                data.splice(deleteNum[deleteNum.length - i - 1], 1)
            }
            for (let i = 0; i < data.length; i++) {
                dataArr.push(data[data.length - i - 1])
            }

            for (let i = 0; i < dataArr.length; i++) {
                if (dataArr[i].modelcount === '0') {
                    nullArr.push(i)
                }
            }
            for (let i = 0; i < nullArr.length; i++) {
                let num = nullArr[i] - i
                dataArr.splice(num, 1)
            }
            // console.log(dataArr)
        }
    })
    dataArr = dataArr.filter(function (ele) {
        return ele.state === '1'
    })
    for (let i = 0; i < dataArr.length; i++) {
        let img1 = dataArr[i].thumbnail1.replace('3ds', 'jpg')
        let img2 = dataArr[i].thumbnail2.replace('3ds', 'jpg')
        let img3 = dataArr[i].thumbnail3.replace('3ds', 'jpg')
        // let img1=''
        // let img2=''
        // let img3=''
        itemArr[i] = `<div class="item" onclick="openCloud(this)" id='${dataArr[i].folder}'>
            <img src='http://www.ihouse3d.com.cn/users/share/chenx/savefile/${dataArr[i].folder}/data_icon_1.jpg' alt="" class="item-pic">
            <p class="item-title">${dataArr[i].scenename}</p>
            <div class="item-more-box">
                <img src='http://www.ihouse3d.com.cn/ihouse/data/jiaju/${img1}' alt="" class="small-pic">
                <img src='http://www.ihouse3d.com.cn/ihouse/data/jiaju/${img2}' alt="" class="small-pic">
                <img src='http://www.ihouse3d.com.cn/ihouse/data/jiaju/${img3}' alt="" class="small-pic">
                <a href="" class="first-item-more">
                        <span class="more-text">
                            <span>${dataArr[i].modelcount}</span>
                            个素材
                        </span>
                </a>
            </div>
        </div>`
    }
    // console.log(itemArr)
    for (let i = 0; i < 10; i++) {
        $('#box').append(itemArr[i])
    }
    // let created_DateArr = [];
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.open('POST', m_strWebService + 'service1.asmx', true);
    // var sr =
    //     '<?xml version="1.0" encoding="utf-8"?>' +
    //     '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
    //     '  <soap12:Body>' +
    //     '    <GetInfoFromShare xmlns="http://tempuri.org/">' +
    //     '    </GetInfoFromShare>' +
    //     '  </soap12:Body>' +
    //     '</soap12:Envelope>';
    //
    // xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    // xmlhttp.send(sr);
    //
    // xmlhttp.onreadystatechange = function () {
    //     if (xmlhttp.readyState === 4) {
    //         if (xmlhttp.status === 200) {
    //             var value = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent
    //             // console.log(value);
    //             value = value.split("#");
    //             // console.log(value)
    //             var value_1 = [];
    //             for (let i = value.length - 1; i >= 1; i--) {
    //                 let Data_arr = value[i].split("~");
    //                 if (Data_arr[0].indexOf('diaoding') !== -1)
    //                     continue;
    //                 let temp = Math.random();
    //                 let Data_html = `<li>< img src="${m_strWebService}users/share/${mUserFolder}/savefile/${Data_arr[1]}/data_icon.jpg?temp=${temp}" alt="" xml="${m_strWebService}users/share/${mUserFolder}/savefile/${Data_arr[1]}/data_scene.xml"><p>${Data_arr[0]}</p ></li>`;
    //
    //                 var data = [];
    //                 data.push(Data_arr);
    //                 value_1.push(data);
    //             }
    //             created_DateArr = value_1;
    //             // console.log(value_1)
    //             for (let i = 0; i < nullArr.length; i++) {
    //                 let num = nullArr[i] - i
    //                 value_1.splice(num, 1)
    //             }
    //
    //             // created_curPage=0;
    //             // setPager_created();
    //         }
    //     }
    // }
}

GetInfoFromShare()

function openCloud(obj) {
    document.cookie = 'modelId=' + obj.id
    window.open('info.html')
}

function timeDis(a, b) {
    var arr = a.split("-");
    var starttime = new Date(arr[0], arr[1], arr[2]);
    var starttimes = starttime.getTime();
    var arrs = b.split("-");
    var endTime = new Date(arrs[0], arrs[1], arrs[2]);
    var endTimes = endTime.getTime();
    // 进行日期比较
    if (endTimes >= starttimes) {
        let flag = "true";
        return flag;
    } else {
        let flag = "false";
        return flag;
    }
}

function handleLoginClick() {
    name = document.getElementById('name').value
    passWord = document.getElementById('password').value
    // console.log(document.cookie)
    let password = document.getElementById('password').value
    let code = getRadomNum(6)
    let xmlhttp = new XMLHttpRequest();
    let ip = ''
    xmlhttp.open('POST', 'http://www.ihouse3d.com.cn/service1.asmx', true);
    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
        '  <soap12:Body>' +
        '    <Login xmlns="http://tempuri.org/">' +
        '      <strName>' + name + '</strName>' +
        '      <strPSW>' + password + '</strPSW>' +
        '      <strAuthcode>' + code + '</strAuthcode>' +
        '      <strIP>' + ip + '</strIP>' +
        '    </Login>' +
        '  </soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var value = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent
                let txt = value.split('~')
                let thisTime = txt[7]
                let year = new Date().getFullYear(); //得到年份
                let month = new Date().getMonth() + 1;//得到月份
                let date = new Date().getDate();//得到日期
                let time = year + '-' + month + '-' + date
                let duibi = timeDis(thisTime, time)
                if (duibi === 'false') {
                    let companyId = txt[5]
                    document.cookie = 'name=' + name
                    document.cookie = 'passWord=' + passWord
                    document.cookie = 'gsID=' + companyId
                    document.cookie = 'fold=' + txt[2]
                    document.cookie = 'ut=' + txt[9]
                    if (value.slice(0, 1) === '1') {
                        location.reload()
                    } else {
                        alert('账号或者密码错误！')
                    }
                } else {
                    alert('该账号已到期！')
                }
            }
        }
    }
    if (linkTO === 'pano') {
        window.open('http://www.ihouse3d.com.cn/h5/Panoramagram/index.html?username=' + name)
    } else if (linkTO === 'recharge') {
        window.location.href = 'information.html?type=recharge'
    }
}

function getRadomNum(capacity) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < capacity; i++) {
        var id = Math.ceil(Math.random() * chars.length);
        res += chars[id];
    }
    return res;
}

function handleOutClick() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
    location.reload()
}

function signOver() {
    if (document.getElementById('nameBox').innerHTML !== '登录') {
        document.getElementById('signBox').style.display = 'block'
    }
}

function signOut() {
    document.getElementById('signBox').style.display = 'none'
}

function _signOver() {
    if (document.getElementById('_nameBox').innerHTML !== '登录') {
        document.getElementById('_signBox').style.display = 'block'
    }
}

function _signOut() {
    document.getElementById('_signBox').style.display = 'none'
}

function weChat() {
    document.getElementById('idLogin').style.display = 'none'
    document.getElementById('loginBtn-Box').style.display = 'none'
    document.getElementById('wx-qrcode').style.display = 'block'
    thirdLogin.wx("wx-qrcode");
}

function qqLogin() {
    document.getElementById('idLogin').style.display = 'none'
    document.getElementById('loginBtn-Box').style.display = 'none'
    var url = thirdLogin.qq();
    $("#sn-qq iframe").attr("src", url);
}

function openPanoClick() {
    if (name === 'undefined') {
        document.getElementById('login').style.display = 'block'
        linkTO = 'pano'
    } else {
        window.open('http://www.ihouse3d.com.cn/h5/Panoramagram/index.html?username=' + name)
    }
}

var scrollTopInt = 12
window.onscroll = lazyload;

function lazyload() {
    var itemOffsetTop = $('.box .item:last-child').offset().top;
    // itemOffsetTop = itemOffsetTop - 600
    // 可见区域高度
    var seeHeight = document.documentElement.clientHeight;
    // 滚动条距离顶部高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (itemOffsetTop < (seeHeight + scrollTop) + 600) {
        for (var i = scrollTopInt; i < scrollTopInt + 12; i++) {
            $('.box').append(itemArr[i]);
        }
        scrollTopInt += 12;
    }
    var a = document.documentElement.scrollTop || document.body.scrollTop;
    if (a > 50) {
        document.getElementById('_header').style.display = 'block'
    } else {
        document.getElementById('_header').style.display = 'none'
    }
}

function firstItem() {
    document.cookie = 'modelId=2390B27F-74E8-84C9-2F05-43AF5860B664'
    window.open('info.html')
}

function gotoRecharge() {
    if (name !== 'undefined') {
        window.location.href = 'information.html?type=recharge'
    } else {
        linkTO = 'recharge'
        document.getElementById('login').style.display = 'block'
    }
}
