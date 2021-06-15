function Dialog_ErrorLog(){
	let setHtml=`<el-dialog title="错误日志" :visible.sync="dialogTableVisible" style="" width="80%">
  <el-table :data="gridData" max-height='550'>
    <el-table-column property="address" label="错误信息"></el-table-column>
  </el-table>
</el-dialog>`;
	$('#app').append(setHtml);
}
Dialog_ErrorLog();

function ErrorLogAdd_Arr(str){
	let s_json={
		address:str
	}
	app.gridData.push(s_json);
}

function ErrorLogRmover_Arr(index,sum){
	if (sum==undefined) {
		sum=1;
	}
	app.gridData.splice(index,sum); 
}

function ErrorLogSplice_Arr(index,str){
	app.gridData.splice(index,1,str); 
}

