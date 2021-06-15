function Animation()
{
    this.pointsArray = [];
    this.Lines = [];
    this.tween = [];
    this.cameraMatrix4 = []; //保存相机经过所有路径数据
    this.position;
    this.camera = mCameraClass.m_Camera;

     this.onMouseDown = function(g_mouseX,g_mouseY,event) {

        this.pointsArray.push(new THREE.Vector3(g_mouseX,g_mouseY,0));

        if (this.pointsArray.length >= 2) {

            /* 创建线段 */
            var lineGeometry = new THREE.Geometry();
            var lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000,linewidth:5});
            lineGeometry.vertices.push(this.pointsArray[0], this.pointsArray[1]);

            this.Lines.push({Start:new THREE.Vector3(this.pointsArray[0].x,50,-this.pointsArray[0].y),
                              End:new THREE.Vector3(this.pointsArray[1].x,50,-this.pointsArray[1].y)});

            var line = new THREE.Line(lineGeometry, lineMaterial);
            line.name = "animation_line"
            this.pointsArray.shift();
            scene.add(line);
        }
    };

    /* 鼠标移动事件 */
    this.onMouseMove = function(g_mouseX,g_mouseY,event) {

        /* 鼠标左键未点击时线段的移动状态 */
        if (scene.getObjectByName('line_move')) {
            scene.remove(scene.getObjectByName('line_move'));
        }

        /* 创建线段 */
        var lineGeometry = new THREE.Geometry();
        var lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000,linewidth:5});

        if (this.pointsArray.length > 0){

            lineGeometry.vertices.push(this.pointsArray[0]);
            var mouseVector3 = new THREE.Vector3(g_mouseX, g_mouseY, 0);
            lineGeometry.vertices.push(mouseVector3);

            var line = new THREE.Line(lineGeometry, lineMaterial);
            line.name = 'line_move';
            scene.add(line);
        }
    };

    this.OnMouseRightUp2D = function()
    {
        /* 鼠标左键未点击时线段的移动状态 */
        if (scene.getObjectByName('line_move')) {
            scene.remove(scene.getObjectByName('line_move'));
        }

        /* 删除数组中的元素，否则的话再次重绘会链接之前的点接着重绘 */
        this.pointsArray = [];
    };

    this.DeleteLines = function()
    {
        for(let index = scene.children.length-1; index >= 0; --index)
        {
            let node = scene.children[index];
            if(node.name === "animation_line" ){
                scene.remove(node);
            }
        }

        this.Lines = [];
    };

    //路径预览
    this.PathPreview = function()
    {
        if(this.Lines.length < 1)
            return;

        this.tween = [];
        this.position = {x: this.Lines[0].Start.x, y: this.Lines[0].Start.y, z:this.Lines[0].Start.z, rotation: 0};

        mCameraClass.m_Camera3D.position.set(this.Lines[0].Start.x,this.Lines[0].Start.y,this.Lines[0].Start.z);
        mCameraClass.m_Camera3D.lookAt(new THREE.Vector3(this.Lines[0].End.x,this.Lines[0].Start.y,this.Lines[0].End.z));

        for(let index = 0; index < this.Lines.length; ++index)
        {
            this.tween[index] = new TWEEN.Tween(this.position);
            this.tween[index].to({x:this.Lines[index].End.x,
                             y:this.Lines[index].End.y,
                             z:this.Lines[index].End.z},5000);

            this.tween[index].onUpdate(this.UpdateCameraPos);
            this.tween[index].onComplete(function(){
                if(index+1  < mAnimation.Lines.length)
                    mCameraClass.m_Camera3D.lookAt(new THREE.Vector3(mAnimation.Lines[index+1].End.x,mAnimation.Lines[index+1].End.y,mAnimation.Lines[index+1].End.z));
            })

            if(index > 0)
            {
                this.tween[index-1].chain(this.tween[index]);
            }
        }

        if(this.tween.length > 0) {
            this.tween[0].start();
        }
    };

    this.UpdateCameraPos = function()
    {
        mCameraClass.m_Camera3D.position.set(mAnimation.position.x,mAnimation.position.y,mAnimation.position.z);
        //mAnimation.cameraMatrix4.push(mCameraClass.m_Camera3D.matrix.clone());
    };

    this.OnSaveAnimationMatrix = function(strXML)
    {
        this.InterpolationPoints(10);

        for (var i= 0; i < this.cameraMatrix4.length; i++)
        {
            let matrix4 =  this.cameraMatrix4[i];
            let matrixData = '';
            for(let index = 0; index < matrix4.elements.length; ++index)
            {
                matrixData += matrix4.elements[index];
                matrixData += ",";
            }

            matrixData = matrixData.substring(0,matrixData.length -1);
            strXML += `<AnimationMatrix data="${matrixData}"/>`;
        }

        return strXML;
    };

    this.GetLookAtVector3=function(point,lookatPoints)
    {
        var delta = 1e-5;
        let resPoint = new THREE.Vector3(9999,9999,9999);

        for(let index = 0; index < lookatPoints.length; ++index)
        {
            ltPoint = lookatPoints[index];

            if( Math.abs(point.x - ltPoint.StartPoint.x) < delta &&
                Math.abs(point.y - ltPoint.StartPoint.y) < delta &&
                Math.abs(point.z - ltPoint.StartPoint.z) < delta )
            {
                resPoint = new THREE.Vector3(ltPoint.EndPoint.x,ltPoint.EndPoint.y,ltPoint.EndPoint.z);
                lookatPoints.splice(index,1);
                break;
            }
        }

        return resPoint;
    };

    //step 插值数
    this.InterpolationPoints=function(step)
    {
        let linePoints = [];
        let lookatPoints = [];
        this.cameraMatrix4 = [];

        for(let index = 0; index < this.Lines.length; ++index)
        {
            let line = this.Lines[index];

            lookatPoints.push({StartPoint:new THREE.Vector3(line.Start.x,line.Start.y,line.Start.z),
                               EndPoint:new THREE.Vector3(line.End.x,line.End.y,line.End.z)});

            let lineLength = Math.sqrt( (line.End.x - line.Start.x) * (line.End.x - line.Start.x) +
                                           (line.End.y - line.Start.y) * (line.End.y - line.Start.y) +
                                           (line.End.z - line.Start.z) * (line.End.z - line.Start.z));

            let xStep = Math.abs(line.End.x - line.Start.x)/lineLength;
            let yStep = Math.abs(line.End.y - line.Start.y)/lineLength;
            let zStep = Math.abs(line.End.z - line.Start.z)/lineLength;

            for(let iStep = 0; iStep < lineLength; iStep+=step)
            {
                let newPos = new THREE.Vector3(line.Start.x + xStep * iStep,
                                               line.Start.y + yStep * iStep,
                                               line.Start.z + zStep * iStep);

                linePoints.push(newPos);

                //最后一个点处理
                if(line.Start.x + (xStep * (iStep + step)) > line.End.x )
                {
                    linePoints.push(new THREE.Vector3(line.End.x, line.End.y , line.End.z ));
                }
            }
        }

        for(let index = 0; index < linePoints.length; ++index)
        {
            let currPoint = linePoints[index];

            let point = this.GetLookAtVector3(currPoint,lookatPoints);

            mCameraClass.m_Camera3D.position.set(currPoint.x,currPoint.y,currPoint.z);

            if(point.x != 9999 && point.y != 9999 && point.z != 9999)
            {
                mCameraClass.m_Camera3D.lookAt(point);
            }
            mCameraClass.m_Camera3D.updateMatrix();
            mAnimation.cameraMatrix4.push(mCameraClass.m_Camera3D.matrix.clone());
        }
    };

    this.AnimationOper = function(nType)
    {
        //绘制路线
        if(0 === nType)
        {
            m_cPenType = 11;
        }
        //删除路线
        else if(1 === nType)
        {
           this.DeleteLines();
           this.cameraMatrix4 = [];
           this.pointsArray = [];
           this.tween = [];
        }
        //预览路线
        else if(2 === nType)
        {
            OnShow3D();
            this.PathPreview();
        }
        //动画预览停止
        else if(3 === nType)
        {
            if(this.tween.length > 0){
                this.tween[0].stop();
            }
        }
    };
}