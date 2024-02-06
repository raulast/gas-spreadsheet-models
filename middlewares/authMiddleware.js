function authMiddleware(e={}){
  return null
}

function checkRegister(email){
  const _email = users.columns.find(o=>o.column_name==="email").column_tag;
  const _id= users.columns.find(o=>o.column_name==="id").column_tag;
  const user= users.getAll(false,`${_id},${_email}`,`${_email}='${email}'`)[0] || null;
  if(user)return {status:false,message:"User Registered",result:null};
  return null;
}