function PlaneLightClass()
{
    this.mPlaneLightArray = new Array();
    this.mCurPlaneLight = null;

    // 环境光
    this.m_bEnable = true;
    this.m_fIntensity= 0.3; 	  //光的强度 衰减
    this.m_fLightR = 1.0;
    this.m_fLightG = 1.0;
    this.m_fLightB = 1.0;

    // 阳光
    this.m_bSunEnbale= true;
    this.m_fSunAngle = 45;		//向西北

    this.OnLoadPlaneLight_XML = function(data)
    {
        var planeLight = new PlaneLight();

        planeLight.m_fPosX = parseFloat($(data).attr('PosX'));
        planeLight.m_fPosY = parseFloat($(data).attr('PosZ'));
        planeLight.m_fPosZ = -parseFloat($(data).attr('PosY'));

        planeLight.m_fRotateX = parseFloat($(data).attr('RotateX'))||0;
        planeLight.m_fRotateY = parseFloat($(data).attr('RotateY'))||0;

        planeLight.m_nLightType = parseFloat($(data).attr('iType'));	  // 0 点光源, 1 射灯 2:片灯

        planeLight.m_fColorR = parseFloat($(data).attr('ColorR'));
        planeLight.m_fColorG = parseFloat($(data).attr('ColorG'));
        planeLight.m_fColorB = parseFloat($(data).attr('ColorB'));

        planeLight.m_fLength = parseFloat($(data).attr('Length'));
        planeLight.m_fWidth = parseFloat($(data).attr('Width'));
        planeLight.m_fIntensity = parseFloat($(data).attr('Intensity'));
        planeLight.m_IES = parseFloat($(data).attr('IES'));

        planeLight.m_bEnable = eval($(data).attr('Enable'))||true;
        planeLight.m_bAreaShow = eval($(data).attr('AreaShow'))||false;
        planeLight.m_bAreaDouble = eval($(data).attr('AreaDouble'))||false;

        this.mPlaneLightArray.push(planeLight);
    };

    this.OnLoadEnvironmentAndSunLight = function($xml)
    {
        // 环境光
        if($xml.find("EnvironmentData").length > 0)
        {
            this.m_bEnable = eval($xml.find("EnvironmentData").attr('Enable'));
            this.m_fIntensity= parseFloat($xml.find("EnvironmentData").attr('Intensity')); 	  //光的强度 衰减
            this.m_fLightR = parseFloat($xml.find("EnvironmentData").attr('LightR'));
            this.m_fLightG = parseFloat($xml.find("EnvironmentData").attr('LightG'));
            this.m_fLightB = parseFloat($xml.find("EnvironmentData").attr('LightB'));
        }

        // 阳光
        if($xml.find("SunLightData").length > 0)
        {
            this.m_bSunEnbale = eval($xml.find("SunLightData").attr('Enable'));
            this.m_fSunAngle = parseInt($xml.find("SunLightData").attr('SunAngle'));
        }
    }

    // 保存灯光数据
    this.OnSave_XML = function()
    {
        //读取渲染端保存的灯光数据
        this.OnLoadStorageLight();

        let strXML= null;

        for(var i=0; i< this.mPlaneLightArray.length; i++)
        {
            if( strXML == null )
                strXML = this.mPlaneLightArray[i].OnSave();
            else
                strXML+= this.mPlaneLightArray[i].OnSave();
        }

        //环境光
        strXML += `<EnvironmentData Enable="${this.m_bEnable}" Intensity="${this.m_fIntensity}" LightR="${this.m_fLightR}" LightG="${this.m_fLightG}" LightB="${this.m_fLightB}"/>`;

        //太阳光
        strXML += `<SunLightData Enable="${this.m_bSunEnbale}" SunAngle="${this.m_fSunAngle}" />`;

        return strXML;
    };

    this.OnLoadStorageLight = function()
    {
        if("" != mPluginsClass.mSceneLightUUID)
        {
            $.ajax({
                url: m_strWebService +'Service1.asmx/GetStorageData',
                type: "post",
                dataType: "json",
                async:false,
                contentType: "application/x-www-form-urlencoded",
                data:
                    {
                        UUID: mPluginsClass.mSceneLightUUID
                    },
                success: function (data)
                {
                    if ("1" == data.code)
                    {
                        let strXMLData = decodeURIComponent(base64_decode(data.data));

                        var $xml = $(strXMLData);
                        if($xml)
                        {
                            mHouseClass.mPlaneLightClass.mPlaneLightArray.length = 0;

                            $xml.find("LightData").each(function(j)
                            {
                                mHouseClass.mPlaneLightClass.OnLoadPlaneLight_XML($(this));
                            });

                            mHouseClass.mPlaneLightClass.OnLoadEnvironmentAndSunLight($xml);
                        }
                    }
                    else
                    {
                        console.log(data.msg);
                    }
                },
                error: function (err)
                {
                    console.log(err);
                }
            });
        }
    }

    this.OnClear = function(strUUID)
    {
        this.mPlaneLightArray.length = 0;
        $.ajax({
            url: m_strWebService +'Service1.asmx/DeleteStorageData',
            type: "post",
            dataType: "json",
            async:false,
            contentType: "application/x-www-form-urlencoded",
            data:
                {
                    UUID: strUUID
                },
            success: function (data)
            {
                if ("1" == data.code)
                {
                }
                else
                {
                    console.log(data.msg);
                }
            },
            error: function (err)
            {
                console.log(err);
            }
        });
    }
}