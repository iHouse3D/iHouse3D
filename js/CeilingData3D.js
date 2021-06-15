
function CeilingData3D()
{
	//墙面信息类
	this.mCeilingMesh;
	this.mTextureData;								// 材质数据

	this.OnClear = function()
	{
		scene3D.remove(this.mCeilingMesh);
		this.mCeilingMesh  = null;

	};

	this.OnCreate = function(tMesh)
	{
		this.mCeilingMesh = tMesh;
	};

	this.OnUpdateTex = function(ab)
	{
		this.mCeilingMesh.geometry.computeBoundingBox();
		this.mTextureData = new TextureData();
		this.mTextureData.OnCreate(ab,this.mCeilingMesh);

		this.mCeilingMesh.material.map = this.mTextureData.mTexture;
		this.mCeilingMesh.material.needsUpdate = true;
	};

	/*
	this.OnInit = function()
	{
	}
	this.OnCreate = function(x1,y1)
	{
	}
	*/
}