var vdUrl
var webUrl = localStorage.getItem('WebService');
var m_strWebService;
$(function () {

    if (null == webUrl) {
        webUrl = 'http://' + window.location.host + '/';
    }


    m_strWebService = webUrl;
    //var m_strWebService = 'http://www.ihouse3d.com.cn/';
    //获取方案大厅头部的四个点击事件源
    $(".tab-img>div>div").each(function (i) {
        // console.log($(this));
        $(this).click(function () {
            if (i == 3) {
                return
            } else {
                $(".tab-img>div>div").removeClass("img-list-link");
                $(".info-list>div").css("display", "none");
                $(".tab-img>div>div").eq(i).addClass("img-list-link");
                $(".info-list>div").eq(i).css("display", "block");
                init()
            }
        })
    });

    /*
    $(".tab-img>div>div").eq(2).click(function () {

        $.ajax({
            url: m_strWebService + 'service1.asmx/GetSchemeAnimation',
            type: "Post",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                strSchemeID: getURL,
            },
            success: function (data) {
                let strServiceAddr = this.url;
                let nPos = strServiceAddr.indexOf('/', 10);
                strServiceAddr = strServiceAddr.substr(0, nPos);
                // console.log(data);
                if (data.code == '1') {
                    $("#info-3").load(strServiceAddr + '/' + data.VideoUrl + ' video', function (responseTxt, statusTxt, xhr) {
                        if (statusTxt == "success")
                            console.log($('#info-3').children('video').attr('src'))
                        let s1 = data.VideoUrl.substring(0, data.VideoUrl.length - 10)
                        s1 = strServiceAddr + '/' + s1 + $('#info-3').children('video').attr('src')
                        $('#info-3').children('video').attr('src', s1)
                        console.log(s1)
                        vdUrl = s1
                        let btn = '<img src="../img/wxs.png" style="width: 23px;height: 23px;margin-top: 40px;margin-left: -30px" onclick="ShowWXImage(vdUrl,vdUrl,webUrl)"/>'
                        $('#info-3').append(btn)
                        if (statusTxt == "error")
                            alert("Error: " + xhr.status + ": " + xhr.statusText);
                    })

                }

            }
        })
    })
    */

    $(".tab-img>div>div").eq(2).click(function () {

        let folder = sessionStorage.getItem('userFolder');
        let userAccount = sessionStorage.getItem('userAccount');
        let sceneFilePath = sessionStorage.getItem('SceneFilePath');  //  (C:\inetpub\wwwroot\users\chenx\zhouqj\savefile\demo\
        let nPos = sceneFilePath.lastIndexOf('\\',sceneFilePath.length - 2);
        let sceneID = sceneFilePath.substring(nPos);

        $.ajax({
            url: m_strWebService + 'service1.asmx/GetSceneAnimation',
            type: "Post",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                Folder: folder,
                UserAccount: userAccount,
                SchemeID: sceneID
            },
            success: function (data) {
                let strServiceAddr = this.url;
                let nPos = strServiceAddr.indexOf('/', 10);
                strServiceAddr = strServiceAddr.substr(0, nPos);
                // console.log(data);
                if (data.code == '1') {
                    $("#info-3").load(strServiceAddr + '/' + data.VideoUrl + ' video', function (responseTxt, statusTxt, xhr) {
                        if (statusTxt == "success")
                            console.log($('#info-3').children('video').attr('src'))
                        let s1 = data.VideoUrl.substring(0, data.VideoUrl.length - 10)
                        s1 = strServiceAddr + '/' + s1 + $('#info-3').children('video').attr('src')
                        $('#info-3').children('video').attr('src', s1)
                        console.log(s1)
                        vdUrl = s1
                        let btn = '<img src="../img/wxs.png" style="width: 23px;height: 23px;margin-top: 40px;margin-left: -30px" onclick="ShowWXImage(vdUrl,vdUrl,webUrl)"/>'
                        $('#info-3').append(btn)
                        if (statusTxt == "error")
                            alert("Error: " + xhr.status + ": " + xhr.statusText);
                    })

                }

            }
        })
    })

    $(".btn-body>button").each(function (i) {
        $(this).click(function () {
            if (i == 0) {
                $("#model-1").hide();
            } else {
                return;
            }
        });
    });

    $("#model-1>.model-clear").click(function () {
        $("#model-1").hide();
        $('body').removeAttr('style')
    });

    $("#info-3>div").each(function () {
        $(this).children().children(".body-img").click(function () {
            $("#model-2").show();
        })
    })
    $("#model-2>.model-clear").click(function () {
        $("#model-2").hide();
    });

    $("#model-1>div").eq(0).click(function () {//执行左轮播按钮函数
        modelLeftMover(0);
    })

    $("#model-1>div").eq(1).click(function () {//执行右轮播按钮函数
        modelRightMover(0);
    })


    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    var getURL = getQueryString("houseid");
    // var getURL ='http://www.ihouse3d.com.cn/users/chenx/xg/savefile/145171AA-9C90-B1A8-B1E0-850AA11C2B76/data.xml';

    var dataURL = '', imgURL = '';

    var type = getQueryString("type");
    // var type = '1';

    var isHide = '';

    if (type == '1') {
        $('.img-list-top').hide();
        dataURL = getURL;
        imgURL = getURL.replace("data.xml", "");

        if (imgURL.indexOf("share") != -1) {
            isHide = `style="display:none;"`
        } else {
            isHide = '';
        }
        // console.log();

        ShareAJAX();
    } else {
        dataURL = m_strWebService + 'users/share/chenx/savefile/' + getURL + '/data.xml';
        imgURL = m_strWebService + 'users/share/chenx/savefile/' + getURL;
        ShareAJAX();
    }


    function ShareAJAX() {
        let timestamp = new Date().getTime().toString();
        $.ajax({
            url: dataURL + "?" + timestamp,
            type: "get",
            dataType: "xml",
            contentType: "application/x-www-form-urlencoded",
            // async:false,
            success: function (data) {
                // console.log($(data).find("bmp"));
                var intHtml3 = 0, setHtml_1 = "", setHtml_2 = "", setHtml_3 = "", setHtml_Model = "";

                $('#model-1>.moel-img', window.parent.document).html('');

                for (var i = $(data).find("bmp").length - 1; i >= 0; i--) {
                    var _this = $(data).find("bmp")[i];

                    var strImageName = $(_this).attr('Name'),
                        arrImageName = strImageName.split("\\"),
                        strRenderType = $(_this).attr('RenderType'),
                        imgWidth = $(_this).attr("imgWidth"),
                        imgHeight = $(_this).attr("imgHeight");

                    if (imgHeight == undefined) {
                        imgHeight = '';
                    }
                    if (imgWidth == undefined) {
                        imgWidth = '';
                    }
                    if (strRenderType == '1') { //全景
                        arrImageName = arrImageName[0].split(".");
                        setHtml_1 += `
	                	<div class="_floatBlock clearfix margin-buttom">
		                	<div class="list-information">
						  		<div class="body-img">
							  		<img src="${imgURL}/${strImageName}">
							  		<p class="mask"></p>
							  		<div class="btn-open" onclick="OnPanoramagramClick('${imgURL}/${arrImageName[0]}/ihouse.html')">打开</div>
						  		</div>
						  		<div class="footer-text" style="display: flex;justify-content: space-between">
					  				<div style="display: flex"><div class="pull-right ico-prohibit" ></div><p class="">尺寸:<span>${imgWidth}*${imgHeight}</span></p></div><div class="wxs" _hover="1,'${imgURL}/${arrImageName[0]}/ihouse.html','${imgURL}/${strImageName}','${m_strWebService}'"></div>
						  		</div>
						  	</div>
					  	</div>
	                	`;
                    } else if (strRenderType == '2') { //动画
                        setHtml_2 += `
	                	<div class="floatBlock clearfix margin-buttom">
							<div class="list-information">
						  		<div class="body-img">
						  			<img src="${imgURL}/${strImageName}">
						  			<p class="mask"></p>
						  			<div class="video-info"></div>
						  		</div>
						  		<div class="footer-text">
					  				<p class="pull-left">尺寸:<span>${imgWidth}*${imgHeight}</span></p><div class="wxs" _hover="'${imgURL}/video/video.html','${imgURL}/${strImageName}','${m_strWebService}'"></div><div class="pull-right ico-prohibit" ></div>
						  		</div>
						  	</div>
					  	</div>
	                	`;

                        // console.log(strImageName,"2");
                    } else { //效果图
                        intHtml3 += 1;
                        setHtml_3 += `
	                	<div class="floatBlock clearfix margin-buttom">
		                	<div class="list-information">
						  		<div class="body-img" onclick="OnShowModelClick(${type},${intHtml3})" setURL="${imgURL}/${strImageName}">
							  		<img src="${imgURL}/${strImageName}" class="pic">
							  		<p class="mask"></p>
							  		<div class="btn-open">打开</div>
						  		</div>
						  		<div class="footer-text clearfix">
					  				<p class="pull-left">尺寸:<span>${imgWidth}*${imgHeight}</span></p><div class="pull-right del-img" ${isHide} onclick="deleteImg(this)"></div><div class="wxs" _hover="${type},'${imgURL}/${strImageName}','${imgURL}/${strImageName}','${m_strWebService}'"></div>				  				
						  		</div>						  		
						  	</div>
					  	</div>
	                	`;
                    }
                }

                $("#info-1").html(setHtml_3 + $("#info-1").html()); //添加内容
                $("#info-2").html(setHtml_1 + $("#info-2").html());
                $("#info-3").html(setHtml_2 + $("#info-3").html());

                reload_html();
                init()
            }
        });

    }


})


function reload_html() {


    $('.wxs').hover(function () {
        let name = $(this).attr('_hover');
        name = name.split(',');
        $(this).parent().prev().children('.mask').css('background-color', 'rgba(0,0,0,0.3)');
        if ($(this).parent().prev().children('.wx-img').length > 0) {
            $(this).parent().prev().children('.wx-img').show();
        } else {
            ShowWXImage(name[0].replace(/\'/g, ""), name[1].replace(/\'/g, ""), name[2].replace(/\'/g, ""), name[3].replace(/\'/g, ""), $(this).parent().prev());
            // $(this).parent().prev().append('');
        }
    }, function () {
        $(this).parent().prev().children('.mask').css('background-color', '');
        $(this).parent().prev().children('.wx-img').hide();
    });


    let m_win = $(window).width();
    console.log(m_win)
    if (m_win >= 2000) {
        $('.floatBlock').width(270);
    } else if (m_win <= 2000 && m_win >= 1800) {
        $('.floatBlock').width('15.5%');
    } else if (m_win <= 1800 && m_win >= 1550) {
        $('.floatBlock').width('19%');
    } else if (m_win <= 1550 && m_win >= 1400) {
        $('.floatBlock').width('18%');
    } else if (m_win <= 1400 && m_win >= 1100) {
        $('.floatBlock').width('23.5%');
    } else if (m_win <= 1100 && m_win >= 500) {
        $('.floatBlock').width('31.5%');
    }

    $(window).resize(function () {
        let re_win = $(window).width();
        if (re_win >= 2000) {
            $('.floatBlock').width(270);
        } else if (re_win <= 2000 && re_win >= 1800) {
            $('.floatBlock').width('15.5%');
        } else if (re_win <= 1800 && re_win >= 1550) {
            $('.floatBlock').width('19%');
        } else if (re_win <= 1550 && re_win >= 1400) {
            $('.floatBlock').width('18.9%');
        } else if (re_win <= 1400 && re_win >= 1100) {
            $('.floatBlock').width('23.5%');
        } else if (re_win <= 1100 && re_win >= 500) {
            $('.floatBlock').width('31.5%');
        }
    })

}

var ppl = setInterval(function () {
    init()
    _init()
}, 100)

function init() {
    //width()  不包括 margin/padding/border
    //outerWidth(true) 包括padding/border  加参数true 能获取到argin
    var itemWidth = $(".floatBlock").outerWidth(true);//每个图片的宽度
    var cols = parseInt($(window).width() / itemWidth);//浏览器的宽度/图片的宽度=列数
    var heightArr = [];//创建一个存放每个图片的高度的数组
    for (var i = 0; i < cols; i++) { //每个数组的长度就是 列数的长度
        heightArr.push(0);//最开始的时候可以默认高度是0；【，0，0】
    }
    //循环每一条图片
    $('.floatBlock').each(function (index, item) {
        var idex = 0;//初始索引为0
        var minHeight = heightArr[0];//初始设置最小高度是数组的第一个
        for (var i = 0; i < heightArr.length; i++) {
            if (heightArr[i] < minHeight) {//判断数组中的每一个是否比默认设置的最小高度小，小于直接赋值给最小高度
                minHeight = heightArr[i];//最小高度
                idex = i;//当前索引
            }
        }
        //设置每个图片的样式
        $(item).css({
            left: itemWidth * idex,//图片距离左边的位置 就是当前图片的宽度*他的索引
            top: minHeight //图片距离顶部的位置就是最小高度
        })
        heightArr[idex] += $(item).outerHeight(true); //高度对应的索引值就是当前图片高度的值
    })
}
function _init() {
    //width()  不包括 margin/padding/border
    //outerWidth(true) 包括padding/border  加参数true 能获取到argin
    var itemWidth = $("._floatBlock").outerWidth(true);//每个图片的宽度
    var cols = parseInt($(window).width() / itemWidth);//浏览器的宽度/图片的宽度=列数
    var heightArr = [];//创建一个存放每个图片的高度的数组
    for (var i = 0; i < cols; i++) { //每个数组的长度就是 列数的长度
        heightArr.push(0);//最开始的时候可以默认高度是0；【，0，0】
    }
    //循环每一条图片
    $('._floatBlock').each(function (index, item) {
        var idex = 0;//初始索引为0
        var minHeight = heightArr[0];//初始设置最小高度是数组的第一个
        for (var i = 0; i < heightArr.length; i++) {
            if (heightArr[i] < minHeight) {//判断数组中的每一个是否比默认设置的最小高度小，小于直接赋值给最小高度
                minHeight = heightArr[i];//最小高度
                idex = i;//当前索引
            }
        }
        //设置每个图片的样式
        $(item).css({
            left: itemWidth * idex,//图片距离左边的位置 就是当前图片的宽度*他的索引
            top: minHeight //图片距离顶部的位置就是最小高度
        })
        heightArr[idex] += $(item).outerHeight(true); //高度对应的索引值就是当前图片高度的值
    })
}

function OnPanoramagramClick(urlAddr) { //跳转全景图地址
    window.open(urlAddr);
}

function ShowWXImage(t, shareAddr, thumbnail, serverAddr, el) {
    let url = serverAddr + 'service1.asmx';
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status == 200) {
            let blob = xhr.response;
            let img = document.createElement("img");

            img.onload = function (e) {
                window.URL.revokeObjectURL(img.src);
            }
            img.src = window.URL.createObjectURL(blob);
            if (t == '1') {
                // showImg(img.src);
                $(el).append('<div class="wx-img"><img src="' + img.src + '" /></div>');
            } else {
                window.parent.showImg(img.src);
            }
        }
    }

    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
        '  <soap12:Body>' +
        '    <GetWXShareImage xmlns="http://tempuri.org/">' +
        '      <ShareAddr>' + shareAddr + '</ShareAddr>' +
        '      <ShareThumbnail>' + thumbnail + '</ShareThumbnail>' +
        '      <ShareTitle></ShareTitle>' +
        '      <ShareDes></ShareDes>' +
        '    </GetWXShareImage>' +
        '  </soap12:Body>' +
        '</soap12:Envelope>';

    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(sr);
}

var itemInt = 0;

function modelLeftMover(int) {//左轮播按钮函数
    if (itemInt <= 0) {
        itemInt = 0;
    } else {
        itemInt += -1;
    }
    let img_src = $("#info-1>div").eq(itemInt).children().children('.body-img').children('img').attr('src');

    if (int == 0) {
        $('#model-1>.moel-img').html('');
        $('#model-1>.moel-img').html('<div class="modelRowItem"><img src="' + img_src + '"></div>');
    } else {
        $("#model-1>.moel-img", parent.document).html('');
        $("#model-1>.moel-img", parent.document).html('<div class="modelRowItem"><img src="' + img_src + '"></div>');
    }
}

function modelRightMover(int) {//右轮播按钮函数
    // console.log($("#info-1>div").length);
    if (itemInt >= $("#info-1>div").length) {
        itemInt = $("#info-1>div").length;
    } else {
        itemInt += 1;
    }

    let img_src = $("#info-1>div").eq(itemInt).children().children('.body-img').children('img').attr('src');
    if (int == 0) {
        $('#model-1>.moel-img').html('');
        $('#model-1>.moel-img').html('<div class="modelRowItem"><img src="' + img_src + '"></div>');
    } else {
        $("#model-1>.moel-img", parent.document).html('');
        $("#model-1>.moel-img", parent.document).html('<div class="modelRowItem"><img src="' + img_src + '"></div>');
    }
}

function OnShowModelClick(type, int) {//跳转到效果图相应位置
    let img_src = $("#info-1>div").eq(int - 1).children().children('.body-img').children('img').attr('src');
    itemInt = int - 1;
    // console.log();
    if (type == 1) {
        $('#model-1>.moel-img').html('<div class="modelRowItem"><img src="' + img_src + '"></div>');
        $('body').css('overflow', 'hidden');
        $('#model-1').show();
    } else {
        $('#model-1>.moel-img', parent.document).html('<div class="modelRowItem"><img src="' + img_src + '"></div>');
        $('body', parent.document).css('overflow', 'hidden');
        $('#model-1', parent.document).show();
    }
}

// function showImg(img){
//   $("#model-2 img").attr("src",img);
// }
function deleteImg(obj) {
    let father = obj.parentNode.parentNode
    let imgBox = $(father).children('.body-img')[0]
    let img = $(imgBox).children('.pic')[0].src
    if (confirm('确定要删除吗') === true) {
        let http = new XMLHttpRequest()
        //http.open('POST', 'https://www.ihouse3d.com.cn/service1.asmx', true);
        http.open('POST', m_strWebService + 'service1.asmx', true);
        let data =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
            '  <soap12:Body>' +
            '    <DeleteScenePicture xmlns="http://tempuri.org/">' +
            '<strHttpPic>' + img + '</strHttpPic>' +
            '    </DeleteScenePicture>' +
            '  </soap12:Body>' +
            '</soap12:Envelope>'
        http.setRequestHeader('Content-Type', 'text/xml');
        http.send(data)
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status == 200) {
                    alert('删除成功！')
                    location.reload()
                }
            }
        }
    }
}