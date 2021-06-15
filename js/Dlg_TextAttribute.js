function Dlg_TextAttribute()
{
	this.mText = null; 
	// 显示属性窗口
	this.Show = function(tObj)
	{
		if(m_version=='kz'){
			$("#roomText .md-itemList").eq(1).hide();
			$('#roomText').css("left",'60px');
		}
		this.mText = tObj;

		$('#roomText').show();
		this.ShowBar();
		
	};
	
	this.ShowBar = function()
	{
		
		$("#mTextBar").show();
		var div1=document.getElementById("mTextBar");
		div1.style.left= mouseScreen.x+10+'px';
		div1.style.top= mouseScreen.y-100+'px';		
	};
	
	// 隐藏墙bar
	this.HideBar = function()
	{
		$("#mTextBar").hide();
		$("#roomText").hide();
	};	
	
	this.Delete = function()
	{
		if(this.mText)
		{
			mHouseClass.mTextClass.OnDelete(this.mText);
		}
		
		this.mText = null;
		this.HideBar();	
	};
}

// 房间文字
$('.customize-text>button').click(function(){
	let roomVal=$('.customize-text>input').val();
	if (roomVal!='' && mHouseClass.mTextClass.m_pMoveText) {
		mHouseClass.mTextClass.m_pMoveText.OnUpdateName(roomVal);
	}
})

$('.roomText-scrollbar>li').click(function(event) {

	let roomText=$(this).children('p').text();
	if(mHouseClass.mTextClass.m_pMoveText)
		mHouseClass.mTextClass.m_pMoveText.OnUpdateName(roomText);

});