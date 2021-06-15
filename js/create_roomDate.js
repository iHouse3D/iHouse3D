var created_myplan=0;//0 我的设计 1共享方案
var created_DateArr=[],created_curPage=0;
var myPlan_DateArr=[],myPlan_curPage=0

function myPlan(){
	var selectTime = new Date().getTime();//获取时间戳
	myPlan_DateArr=[];
	$.ajax({
	  url: m_strWebService+'users/'+mUserFolder+'/'+mUserAccount+'/savefile/scene.xml?'+selectTime,
	  type: 'get',
	  dataType: 'xml',
	  success: function (res) {
	  	$('.myDesign-list-info').html('');

	  	for (var i = 0; i < $(res).children().children().length; i++) {
		  //for (var i = $(res).children().children().length -1; i >= 0 ; --i) {
	  		let Name=$(res).children().children().eq(i).attr("Name");
	  		let Folder=$(res).children().children().eq(i).attr("Folder");
	  		let temp=Math.random();
	  		let html;
	  		if (Name!='临时') {
		  		html=`<li>
					<img src="${m_strWebService}users/${mUserFolder}/${mUserAccount}/savefile/${Folder}/data_icon.jpg?temp=${temp}" alt="" xml="${m_strWebService}users/${mUserFolder}/${mUserAccount}/savefile/${Folder}/data_scene.xml">
					<p>${Name}</p>
					<span class="created_icon el-icon-delete"></span>
				</li>`;
	  		}else{
	  			html=`<li>
					<img src="${m_strWebService}users/${mUserFolder}/${mUserAccount}/savefile/${Folder}/data_icon.jpg?temp=${temp}" alt="" xml="${m_strWebService}users/${mUserFolder}/${mUserAccount}/savefile/${Folder}/data_scene.xml">
					<p>${Name}</p>
				</li>`;
	  		}
			// $('.myDesign-list-info').append(html);
			myPlan_DateArr.push(html);
	  	}

		myPlan_curPage=0;
	  	setPager_myPlan();
		$('.myDesign_pag>input').attr("max",parseInt((myPlan_DateArr.length/12)+1));
	  }
	})
}
// myPlan();

function GetInfoFromShare_old()
{
	created_DateArr=[];
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', m_strWebService+'service1.asmx', true);
	var sr =
		'<?xml version="1.0" encoding="utf-8"?>'+
		'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'+
		'  <soap12:Body>'+
		'    <GetInfoFromShare xmlns="http://tempuri.org/">'+
		'    </GetInfoFromShare>'+
		'  </soap12:Body>'+
		'</soap12:Envelope>';

	xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	xmlhttp.send(sr);

	xmlhttp.onreadystatechange = function ()
	{
		if (xmlhttp.readyState == 4)
		{
			if (xmlhttp.status == 200)
			{
				var value = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent
				// console.log(value);
				value = value.split("#");
				var value_1=[];
				for (var i = value.length-1; i >= 1; i--) {
					let Data_arr=value[i].split("~");
					if( Data_arr[0].indexOf('diaoding')!=-1)
						continue;
					let temp=Math.random();
					let Data_html=`<li><img src="${m_strWebService}users/share/${mUserFolder}/savefile/${Data_arr[1]}/data_icon.jpg?temp=${temp}" alt="" xml="${m_strWebService}users/share/${mUserFolder}/savefile/${Data_arr[1]}/data_scene.xml"><p>${Data_arr[0]}</p></li>`;

					var data = [];
					data.push(Data_html);
					data.push(Data_arr);
					value_1.push(data);
				}
				created_DateArr=value_1;
				created_curPage=0;
				setPager_created();
				$('.myDesign_pag>input').attr("max",parseInt((created_DateArr.length/12)+1));
			}
		}
	}
}

//取得共享方案(公司共享+个人共享+购买共享)
function GetInfoFromShare()
	{
		created_DateArr=[];

		$.ajax({
			url: m_strWebService + 'service1.asmx/GetShareScene',
			type: "Post",
			contentType:"application/x-www-form-urlencoded",
			data:{
				CompanyID: mCompanyID,
				strUserAccount:mUserAccount
			},
			success: function (data) {
				let jData = JSON.parse(data);
				if(jData.code == "1")
				{
					value = jData.data.split("#");
					var value_1=[];
					for (var i = value.length-1; i >= 1; i--) {
						let Data_arr=value[i].split("~");
						if( Data_arr[0].indexOf('diaoding')!=-1)
							continue;
						let temp=Math.random();
						let Data_html=`<li><img src="${m_strWebService}users/share/chenx/savefile/${Data_arr[1]}/data_icon.jpg?temp=${temp}" alt="" xml="${m_strWebService}users/share/chenx/savefile/${Data_arr[1]}/data_scene.xml"><p>${Data_arr[0]}</p></li>`;

						var data = [];
						data.push(Data_html);
						data.push(Data_arr);
						value_1.push(data);
					}
					created_DateArr=value_1;
					created_curPage=0;
					setPager_created();
					$('.myDesign_pag>input').attr("max",parseInt((created_DateArr.length/12)+1));
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	// GetInfoFromShare();
function setPager_created()              
	{      
		var cont_page=created_DateArr.length/12;
		if (parseInt(cont_page)==cont_page) {
	    	cont_page=cont_page-1;
		}else{
	    	cont_page=parseInt(cont_page);
		}
    	if (created_curPage>=0 && created_curPage<=cont_page) {
	    	$('.myDesign-list-info').html('');
	    	for (var i = created_curPage*12; i < (created_curPage*12)+12; i++) {
	    		// 
	    		if(created_DateArr[i]==undefined){
	    			return;
	    		}
	    		$('.myDesign-list-info').append(created_DateArr[i][0]);
	    	}
    	}else if(created_curPage<0){
    		created_curPage=0;
    	}else if(created_curPage>cont_page){
    		created_curPage=cont_page;
    	}
	}

function setPager_myPlan()              
	{      
		var cont_page=myPlan_DateArr.length/12;
		if (parseInt(cont_page)==cont_page) {
	    	cont_page=cont_page-1;
		}else{
	    	cont_page=parseInt(cont_page);
		}
    	if (myPlan_curPage>=0 && myPlan_curPage<=cont_page) {
	    	$('.myDesign-list-info').html('');
	    	for (var i = myPlan_curPage*12; i < (myPlan_curPage*12)+12; i++) {
	    		// 
	    		if(myPlan_DateArr[i]==undefined){
	    			return;
	    		}
	    		$('.myDesign-list-info').append(myPlan_DateArr[i]);
	    	}
    	}else if(myPlan_curPage<0){
    		myPlan_curPage=0;
    	}else if(myPlan_curPage>cont_page){
    		myPlan_curPage=cont_page;
    	}
	}

$(function(){

	$('.myDesign_pag>span').eq(0).click(function(){
		if (created_myplan==0) {
			myPlan_curPage=0;
			setPager_myPlan();
			$('.myDesign_pag>input').val(myPlan_curPage+1);
		}else if(created_myplan==1){
			created_curPage=0;
			setPager_created();
			$('.myDesign_pag>input').val(created_curPage+1);
		}
	})
	$('.myDesign_pag>span').eq(1).click(function(){
		if (created_myplan==0) {
			myPlan_curPage+=-1;
			setPager_myPlan();
			$('.myDesign_pag>input').val(myPlan_curPage+1);
		}else if(created_myplan==1){
			created_curPage+=-1;
			setPager_created();
			$('.myDesign_pag>input').val(created_curPage+1);
		}
	})
	$('.myDesign_pag>span').eq(2).click(function(){
		if (created_myplan==0) {
			myPlan_curPage+=1;
			setPager_myPlan();
			$('.myDesign_pag>input').val(myPlan_curPage+1);
		}else if(created_myplan==1){
			created_curPage+=1;
			setPager_created();
			$('.myDesign_pag>input').val(created_curPage+1);
		}
	})
	$('.myDesign_pag>span').eq(3).click(function(){
		if (created_myplan==0) {
			myPlan_curPage=parseInt((myPlan_DateArr.length/12));
			setPager_myPlan();
			$('.myDesign_pag>input').val(myPlan_curPage+1);
		}else if(created_myplan==1){
			created_curPage=parseInt((created_DateArr.length/12));
			setPager_created();
			$('.myDesign_pag>input').val(created_curPage+1);
		}
	})

	$('.myDesign_pag>span').eq(4).click(function(){
		if (created_myplan==0) {
			myPlan_curPage=$('.myDesign_pag>input').val()-1;
			setPager_myPlan();
		}else if(created_myplan==1){
			created_curPage=$('.myDesign_pag>input').val()-1;
			setPager_created();
		}
	})

	$('.myDesign-list-info').delegate('li', 'click', function(event) {
		let imgAttr=$(this).children('img').attr('xml');
		if (created_myplan==0) {//我的设计
		//	alert(imgAttr);
			
			$('.createDesign_create').hide();
			$("#mBak").hide();	
			app.openFullScreen();
			mPluginsClass.OnLoadScene(imgAttr);
		}else if(created_myplan==1){	//共享方案
			
			$('.createDesign_create').hide();
			$("#mBak").hide();	
			app.openFullScreen();
			mPluginsClass.OnLoadScene(imgAttr);
		}
	});

	$('.myDesign-list-info').delegate('.created_icon', 'click', function(event) { 
		// app.create_open();
		// create_remover 删除  在上面

		app.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
			var xml=$(this).siblings('img').attr('xml'),xml_arr=xml.split('/'),strWebService=xml_arr[xml_arr.length-2];
			
			xml_arr.splice(xml_arr.length-2,2);
			// xml_arr;
			var SceneXML_Arr=xml_arr.join('/')+"/scene.xml";
			SceneXML_Arr = SceneXML_Arr.replace(m_strWebService,'');
			// console.log(xml_arr);
			// $(this).parent().remove();
			$('.myDesign_pag>input').val();
			$.ajax({
				url: m_strWebService+'service1.asmx/DeleteUserScene',
				type: 'POST',
				data: {UserSceneXML:SceneXML_Arr,SceneUUID:strWebService},
				success:function(data){
					// console.log(data);
					app.$message({
			            type: 'success',
			            message: '删除成功!'
			          });

					myPlan();
					setPager_myPlan();
				}
			});
        }).catch(() => {
          app.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });


		event.stopPropagation();
	});
})
