function WebAPI()
{
	this.mTimerID = 0;
	this.m_strUser = '';
	this.m_strUUID = '';
	
	this.StartCheckLogin = function()
	{
		this.mTimerID = window.setInterval(this.WaitForCheckLogin,5000);
	};
	
	this.EndCheckLogin = function()
	{
		window.clearInterval(this.mTimerID);
	};
	
    this.WaitForCheckLogin = function()
    {
		mWebAPI.CheckLogin(mWebAPI.m_strUser,mWebAPI.m_strUUID);
    };
	
	this.CheckLogin =function(strUser, strUUID)
	{
	    $.ajax({
	        url: m_strWebService+'service2.asmx/CheckLogin',
	        type: "get",
	        dataType: "text",
	        contentType: "application/x-www-form-urlencoded",
	        data: {
	                 strName: strUser,
	                 strAuthcode: strUUID
	             },
		    success: function (data)
		    {
		       var  xmlDoc = $.parseXML( data );
				if(xmlDoc == null)
				{
					alert("户型不存在，请联系技术支持!");
					return;
				}
				var  $xml = $( xmlDoc );
				let strBool = $xml.find("boolean")[0].textContent;
				if( strBool == 'false')
				{
					mWebAPI.EndCheckLogin();
					$('#mGifBak').show();
					$('#mGifBak p').show();
					$('#mGifBak img').show();
					alert("帐号被登录，强制下线。");
				}
		    },
		    error: function (err)
		    {
		        console.log(err);
		    }
	   });
	};
}