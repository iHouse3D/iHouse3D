function addDatas(reportType) {

	let bRet = GetFurnitureData();

	if(!bRet)
		return;

    if("0" == reportType)
		window.open("baojia/basic/index.html", "_blank");
}

function GetFurnitureData()
{
	// let data = "家具,a.jpg,现代艺布,1,1000,1000,备注|家具,b.jpg,现代艺布,2,3000,6000,备注|家具,c.jpg,haobu,2,3000,6000,备注";
	var data = mHouseClass.mFurnitureClass.mFurnitureArray;
	var strData = '';

	if(data.length == 0)
	{
		alert("没有模型数据");
		return false;
	}

	var newData = new Array();
	for(var i = 0; i< data.length; ++i )
	{
		var furnitureData  = data[i].mData;
		var tData= new Array();
		var bNew = true;
		for(var j = 0; j< newData.length; j++ )
		{
			if(furnitureData[1] == newData[j][0])
			{
				newData[j][4]++;
				newData[j][6]+=1000;
				bNew = false;
				break;
			}
		}

		if(bNew == true)
		{
			tData.push(furnitureData[1]);
			tData.push(furnitureData[6]);
			tData.push(m_strWebService +"ihouse/data/jiaju/" + furnitureData[1]);
			tData.push(furnitureData[7]);
			tData.push(1);
			tData.push(1000);
			tData.push(1000);
			tData.push(furnitureData[13]);
			tData.push(furnitureData[15]);
			newData.push(tData);
		}
	}

	for(let index = 0; index < newData.length; ++index)
	{
		strData+=newData[index][1];
		strData+=",";

		strData+=newData[index][2];
		strData+=",";

		strData+=newData[index][3];
		strData+=",";

		strData+=newData[index][4];
		strData+=",";

		strData+=newData[index][5];
		strData+=",";

		strData+=newData[index][6];
		strData+=",";

		strData+=newData[index][7];
		strData+=",";
		strData+=newData[index][8];
		strData+="|";
	}

	strData = strData.substr(0,strData.length-1);
	let SceneFileSrc = mPluginsClass.mCurrentOpenSceneFile;
	sessionStorage.setItem("m_strWebServiceStr", m_strWebService);
	sessionStorage.setItem("addDatas", strData);
	if(SceneFileSrc=="")
	{
		SceneFileSrc = `${m_strWebService}users/${mUserFolder}/${mUserAccount}/savefile/demo/data_`;
	}

	sessionStorage.setItem("SceneFile", SceneFileSrc);

	return true;
}