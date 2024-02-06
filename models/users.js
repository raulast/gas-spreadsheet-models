const users = {
  ...model('users'),
  columns:[
    {column_num:1,column_tag:"A",column_name:"id"},
    {column_num:2,column_tag:"B",column_name:"name", required:true},
    {column_num:3,column_tag:"C",column_name:"email", required:true},
    {column_num:4,column_tag:"D",column_name:"password",hidden:true, required:true},
    {column_num:5,column_tag:"E",column_name:"jwt",hidden:true},
    {column_num:6,column_tag:"F",column_name:"roles", required:true},
    {column_num:7,column_tag:"G",column_name:"created_at"},
    {column_num:8,column_tag:"H",column_name:"updated_at"},
    {column_num:9,column_tag:"I",column_name:"deleted_at"}
  ]
};

