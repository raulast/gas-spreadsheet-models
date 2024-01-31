
const ssid = '***<_spreadsheet_id_>***'
function models(){
  return{
    users,
    posts
  }
}
function model(tableName){
  return{
    ssid,
    addRow: (d)=>(addRow(tableName,d)),
    getAll:(d=false,s="",qq="1=1")=>(getAll(tableName,d,s,qq)),
    find: (id,d=false)=>(find(tableName,id,d)),
    getPage: (pg=1,ppg=10,q="",d=false,qq="1=1")=>(getPage(tableName,q,pg,ppg,d,qq)),
    updateRow: (id,d)=>(updateRow(tableName,id,d)),
    deleteRow: (id)=>(deleteRow(tableName,id)),
  }
}



