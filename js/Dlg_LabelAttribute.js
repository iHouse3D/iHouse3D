function Dlg_LabelAttribute()
{
	this.mLabel;		
	// 显示轮廓尺寸bar
	this.ShowBar = function(tLabel)
	{
		this.mLabel = tLabel
		$("#mOutlineBar").show();
		var div1=document.getElementById("mOutlineBar");
		div1.style.left= mouseScreen.x+10+'px';
		div1.style.top= mouseScreen.y-100+'px';
		
		if(this.mLabel.mbShowLabel == true )
		{
			$('#mOutlineBar .wallShow-icon i').attr('class','icon iconfont icon-hide');
			$('#mOutlineBar .wallShow-icon i').attr('wallShow','0');
		}
		else
		{
			$('#mOutlineBar .wallShow-icon i').attr('class','icon iconfont icon-show');
			$('#mOutlineBar .wallShow-icon i').attr('wallShow','1');		
		}
	};

	// 隐藏墙bar
	this.HideBar = function()
	{
		$("#mOutlineBar").hide();	
		$('.attributeInterface').hide();
	};
	
	// 显示尺寸
	this.OnShowLabel = function(bShow)
	{
		if( this.mLabel)
		{
			this.mLabel.mbShowLabel = bShow;
			this.mLabel.OnShowLabel(bShow);
		}
	//	this.HideBar();	
	};

}
	// 墙体弹出菜单

	$('#mOutlineBar .wallShow-icon i').click(function(){

		let wallShow=$(this).attr('wallShow');
		console.log(wallShow);
		// 1 转显示
		if (wallShow=="1") {
			$(this).attr('class','icon iconfont icon-hide');
			$(this).attr('wallShow','0');
			m_ParamLabelDlg.OnShowLabel(true);

		}
		// 0 转隐藏
		if (wallShow=="0") {
			$(this).attr('class','icon iconfont icon-show');
			$(this).attr('wallShow','1');
			m_ParamLabelDlg.OnShowLabel(false);

		}
	})