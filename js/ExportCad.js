function ExportCad()
{
    this.uuid=function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };

    //导出CAD
    this.BuildExportData=function ()
    {
        var strXMLData = '<iHouseFile><Version Num="20180425"/>';

        //1、墙体数据

        var strWallData = `<WallLine Num="${mHouseClass.mWallClass.mRenderLine.length}">`;
        for(var wallIndex=0; wallIndex < mHouseClass.mWallClass.mRenderLine.length; ++wallIndex)
        {
            let wallLine = mHouseClass.mWallClass.mRenderLine[wallIndex];
            for(var index = 0; index < wallLine.geometry.vertices.length ; ++index)
            {
                let begVertice = wallLine.geometry.vertices[index];

                if(index == wallLine.geometry.vertices.length-1)
                {
                    let nextVertice = wallLine.geometry.vertices[0];
                    strWallData += `<LineData StartX="${begVertice.x}" StartY="${-begVertice.y}" StartZ="${begVertice.z}" EndX="${nextVertice.x}" EndY="${-nextVertice.y}" EndZ="${nextVertice.z}" Label="false"/>`;
                }
                else
                {
                    let nextVertice = wallLine.geometry.vertices[index +1];
                    strWallData += `<LineData StartX="${begVertice.x}" StartY="${-begVertice.y}" StartZ="${begVertice.z}" EndX="${nextVertice.x}" EndY="${-nextVertice.y}" EndZ="${nextVertice.z}" Label="false"/>`;
                }
            }
        }
        strWallData += "</WallLine>";
        strXMLData += strWallData;

        //2、门
        var strDoorData = `<Door Num="${mHouseClass.mDoorClass.mDoorArray.length}">`;
        for(var doorIndex=0; doorIndex < mHouseClass.mDoorClass.mDoorArray.length; ++doorIndex)
        {
            let doorData = mHouseClass.mDoorClass.mDoorArray[doorIndex];
            let doorType = "单开门";

            if(2 == doorData.mData)
            {
                doorType = "双开门";
            }
            else if(3 == doorData.mData)
            {
                doorType = "推拉门";
            }

            strDoorData += `<DoorData PosX="${doorData.m_vPos.x}" PosY="${-doorData.m_vPos.y}" PosZ="${doorData.m_vPos.z}" Length="${doorData.m_fLength * 10}" Width="${doorData.m_fWidth * 10}" Height="${doorData.m_fHeight * 10}" Rotate="${doorData.m_fRotate}" Type="${doorType}" ModelType="3ds" Mode="0" Mirror="${doorData.m_iMirror}" uuid="${this.uuid()}"/>`;
        }
        strDoorData += "</Door>";
        strXMLData += strDoorData;

        //3、窗户
        var strWindowData = `<Windows Num="${mHouseClass.mWindowClass.mWindowArray.length}">`;
        for(var windowIndex=0; windowIndex < mHouseClass.mWindowClass.mWindowArray.length; ++windowIndex)
        {
            let windowData = mHouseClass.mWindowClass.mWindowArray[windowIndex];
            let windowType = "标准";

            if(0 != windowData.m_iStyle)
            {
                windowType = "外飘";
            }

            strWindowData += `<WinData PosX="${windowData.m_vPos.x}" PosY="${-windowData.m_vPos.y}" PosZ="${windowData.m_vPos.z}" Dist="${windowData.m_fHight * 10}" Length="${windowData.m_fLength * 10}" Width="${windowData.m_fWidth * 10}" Height="${windowData.m_fHeight}" Rotate="${windowData.m_fRotate}" Type="${windowType}" ModelType="a3d" Mode="0" Mirror="${windowData.m_iMirror}" uuid="${this.uuid()}"/>`;
        }
        strWindowData += "</Windows>";
        strXMLData += strWindowData;

        strXMLData += "</iHouseFile>";

        return strXMLData;
    };

    this.OnExportCAD=function()
    {
        var strXMLData = this.BuildExportData();

        $.ajax({
            url: m_strWebService + 'iHouse3dToDxfService.asmx/SaveToDxfFile' ,
            type: "Post",
            dataType:"json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                strXMLData: "" + strXMLData + "",
                strType:'1'
            },
            success: function (data)
            {
                if (data.success == 1)
                {
                   let strDxfFile = m_strWebService + data.file;

                    mHouseClass.mExportCad.DownloadFile( strDxfFile);
                }
                else if (data.success == 0)
                {
                    alert(data.msg);
                }
            },
            error: function ()
            {
                alert('error');
            }
        });
    };

    //下载生成的dxf文件
    this.DownloadFile= function(url)
    {
        try
        {
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
        catch(e)
        {

        }
    };
}