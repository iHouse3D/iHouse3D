function PlaneLight()
{
    this.m_fColorR = 255;
    this.m_fColorG = 255;
    this.m_fColorB = 255;
    this.m_fLength = 100;
    this.m_fWidth  = 100;
    this.m_fIntensity = 1.0;
    this.m_nLightType = 2;	  // 0 点光源, 1 射灯 2:片灯

    this.m_fPosX  = 0;
    this.m_fPosY  = 0;
    this.m_fPosZ  = 0;
    this.m_LightShow = 1;				// 1 不显示 0 显示
    this.m_IES = 1;

    this.m_bEnable = true;
    this.m_bAreaShow   = false;
    this.m_bAreaDouble = false;	 // 是否双面发光

    this.m_fRotateX = -90;
    this.m_fRotateY = 0;

    this.OnSave = function()
    {
        let strXML = `<LightData PosX="${this.m_fPosX}" PosY="${-this.m_fPosZ}" PosZ="${this.m_fPosY}"  RotateX="${this.m_fRotateX}"  RotateY="${this.m_fRotateY}" iType="${this.m_nLightType}" ColorR="${this.m_fColorR}" ColorG="${this.m_fColorG}" ColorB="${this.m_fColorB}" Length="${this.m_fLength}" Width="${this.m_fWidth}" Intensity="${this.m_fIntensity}" IES="${this.m_IES}"  Enable="${this.m_bEnable}" AreaShow="${ this.m_bAreaShow}" AreaDouble="${this.m_bAreaDouble}"/>`;

        return strXML;
    };
}