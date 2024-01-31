function getAll(tableName,deleted=false,sel="",qq="1=1"){
  const select = sel || selectAll(tableName).join(',')
  const sp = getSpSh(tableName);
  const sheet = sp.getSheetByName(tableName);
  const range = sheet.getDataRange().getA1Notation();
  var req = query(tableName,`=QUERY('${tableName}'!${range},"SELECT ${select} WHERE ${qq} ${deleted?"":`${headers(tableName).includes("deleted_at")?`and ${selectColumns(tableName,['deleted_at']).join('')} is null`:""}`}",1)`);
  return req;
}
function getSpSh(tableName){
  const ssid = models()[tableName].ssid;
  return SpreadsheetApp.openById(ssid);
}
function query(tableName,request) { 
  const sp = getSpSh(tableName);
  var sheet = sp.insertSheet();
  var r = sheet.getRange(1, 1).setFormula(request);

  var reply = sheet.getDataRange().getValues();
  sp.deleteSheet(sheet);

  return arregloToJson(reply);
}
function arregloToJson(arr=[]){
  const result = [];
  const headers = arr[0];
  arr.forEach((rr,i)=>{
    if(i==0)return;
    const obj = {};
    headers.forEach((h,j)=>{
      obj[h]=rr[j];
    })
    result.push(obj);
  });
  return result;
}
function headers(table) { 
  const mod = models()[table]
  return mod.columns.map((obj)=>(obj.column_name))  
}
function selectAll(table) { 
  const mod = models()[table]
  return mod.columns.filter(h=>!h.hidden).map((obj)=>(obj.column_tag))  
}
function selectColumns(table,columns) { 
  const mod = models()[table]
  return mod.columns.filter(h=>!h.hidden).filter(c=>columns.includes(c.column_name)).map((obj)=>(obj.column_tag))  
}
function find(tableName,id, deleted=false){
  const select = selectAll(tableName).join(',')
  const sp = getSpSh(tableName);
  const sheet = sp.getSheetByName(tableName);
  const range = sheet.getDataRange().getA1Notation();
  var req = query(tableName,`=QUERY('${tableName}'!${range},"SELECT ${select} WHERE A=${id} ${deleted?"":`${headers(tableName).includes("deleted_at")?`and ${selectColumns(tableName,['deleted_at']).join('')} is null`:""}`}",1)`);
  return req[0]||null;
}
function getPage(tableName,q,page,perpage,deleted=false,qq="1=1"){
  const sel = selectAll(tableName);
  const select = sel.join(',');
  const sp = getSpSh(tableName);
  const sheet = sp.getSheetByName(tableName);
  const range = sheet.getDataRange().getA1Notation();
  const formula = `=QUERY('${tableName}'!${range},"SELECT ${select} WHERE ${q?
    sel.map(c=>(`${c} like '%${q}%' `)).join('or ')
  :`${qq}`} ${deleted?"":`${headers(tableName).includes("deleted_at")?`and ${selectColumns(tableName,['deleted_at']).join('')} is null`:""}`} limit ${perpage} offset ${(page-1)*perpage}",1)`;
  const formula2 = `=QUERY('${tableName}'!${range},"SELECT count(A) WHERE ${q?
    sel.map(c=>(`${c} like '%${q}%' `)).join('or ')
  :"1=1"} ${deleted?"":`${headers(tableName).includes("deleted_at")?`and ${selectColumns(tableName,['deleted_at']).join('')} is null`:""}`} label count(A) 'total'",1)`;
  Logger.log(formula2)
  const total = Math.ceil(query(tableName,formula2)[0]?.total||0.0);
  const req = query(tableName,formula);
  return {
    page:page,
    perpage:perpage,
    pages:Math.ceil(total/perpage),
    total:total,
    data:req
  }||null;
}
function addRow(tableName,data){
  const sp = getSpSh(tableName);
  const sheet = sp.getSheetByName(tableName);
  const range = sheet.getDataRange().getA1Notation();
  const formula = `=QUERY('${tableName}'!${range},"SELECT MAX(A) label MAX(A) 'max_id'",1)`;
  const max_id = Math.ceil(query(tableName,formula)[0]?.max_id||0.0);
  const hh = headers(tableName);
  const info = [];
  const now = new Date();
  data.id = max_id+1
  data.updated_at = Math.ceil(now.getTime()/1000);
  data.created_at = Math.ceil(now.getTime()/1000);
  hh.forEach((h)=>{
    info.push(data[h]||"")
  })
  if(info.join("")!==`${max_id+1}`){
    sheet.appendRow(info);
    return arregloToJson([hh,info])[0];
  }
  return null;
}
function updateRow(tableName,id,data){
  const sp = getSpSh(tableName);
  const sheet = sp.getSheetByName(tableName);
  const rows = getAll(tableName,true,'*');
  let row = rows.findIndex((r)=>(`${r.id}`===`${id}`))
  if(row===-1)return null;
  data = {...rows[row],...data};
  row =row +2;
  const hh = headers(tableName);
  const info = [];
  const now = new Date();
  data.id = id;
  data.updated_at = Math.ceil(now.getTime()/1000);
  hh.forEach((h)=>{info.push(data[h]||"")});
  if(info.join("")!==`${id}`){
    sheet.getRange(row,1,1,hh.length).setValues([info]);
    return find(tableName,id,true);
  }
  return null;
}
function deleteRow(tableName,id){
  const hh = headers(tableName);
  if(hh.includes("deleted_at")){
    const now = new Date();
    return updateRow(tableName,id,{deleted_at:Math.ceil(now.getTime()/1000)})
  }
  const sp = getSpSh(tableName);
  const sheet = sp.getSheetByName(tableName);
  const rows = getAll(tableName,true,'*');
  let row = rows.findIndex((r)=>(`${r.id}`===`${id}`))
  if(row===-1)return null;
  row =row +2;
  sheet.deleteRow(row);
  return true;
}


