function hash(value,now=null) {
  if(now===null){
    now = Date.now();
  }
  /** @type Byte[] */
  var signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, `${now}${value}${now}`);

  /** @type String */
  var hexString = signature
  .map(function(byte) {
    // Convert from 2's compliment
    var v = (byte < 0) ? 256 + byte : byte;

    // Convert byte to hexadecimal
    return ("0" + v.toString(16)).slice(-2);
  }).join("");

  return Utilities.base64EncodeWebSafe(`${now}.${hexString}`);
}
function check(sign="",clave=""){
  if(sign === "" || clave === ""){
    return null;
  }

  let decoded = Utilities.newBlob(Utilities.base64Decode(sign)).getDataAsString();
  const now = decoded.split('.')[0];


  return sign === hash(clave,now);

}
function createJwt (privateKey="", expiresInHours=24, data = {} ){
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Date.now();
  const expires = new Date(now);
  expires.setHours(expires.getHours() + expiresInHours);

  // iat = issued time, exp = expiration time
  const payload = {
    exp: Math.round(expires.getTime() / 1000),
    iat: Math.round(now / 1000),
  };

  // add user payload
  Object.keys(data).forEach(function (key) {
    payload[key] = data[key];
  });

  const base64Encode = (text, json = true) => {
    const data = json ? JSON.stringify(text) : text;
    return Utilities.base64EncodeWebSafe(data).replace(/=+$/, '');
  };

  const toSign = `${base64Encode(header)}.${base64Encode(payload)}`;
  const signatureBytes = Utilities.computeHmacSha256Signature(toSign, privateKey);
  const signature = base64Encode(signatureBytes, false);
  return `${toSign}.${signature}`;
}
function payloadJwt(token) {
    let body = token.split('.')[1];
    let decoded = Utilities.newBlob(Utilities.base64Decode(body)).getDataAsString();
    return JSON.parse(decoded);
}
function getPrivateKey(hashed){
  let decoded = Utilities.newBlob(Utilities.base64Decode(hashed)).getDataAsString();
  const key = decoded.split('.')[1];
  return key
}
function parseJwt(jsonWebToken, privateKey){
  const [header, payload, signature] = jsonWebToken.split('.');
  const signatureBytes = Utilities.computeHmacSha256Signature(`${header}.${payload}`, privateKey);
  const validSignature = Utilities.base64EncodeWebSafe(signatureBytes);
  if (signature === validSignature.replace(/=+$/, '')) {
    const blob = Utilities.newBlob(Utilities.base64Decode(payload)).getDataAsString();
    const { exp, ...data } = JSON.parse(blob);
    if (new Date(exp * 1000) < new Date()) {
      throw new Error('The token has expired');
    }
    return (data);
  } else {
    throw new Error('🔴 Invalid Signature');
  }
}
function login(email,password,hours=24,data={}){
  const _email = users.columns.find(o=>o.column_name==="email").column_tag;
  const _password= users.columns.find(o=>o.column_name==="password").column_tag;
  const _id= users.columns.find(o=>o.column_name==="id").column_tag;
  const user= users.getAll(false,`${_id},${_email},${_password}`,`${_email}='${email}'`)[0] || null;
  if(!user)return false;
  if(!check(user.password,password))return false;
  const privateKey = getPrivateKey(user.password);
  const jwt = createJwt(privateKey,hours,{...data,user_id:user.id});
  users.updateRow(user.id,{jwt});
  return {
    user:users.find(user.id),
    token: jwt
  }
}
function registerUser(user_data={}){
  const cr = checkRegister(user_data.email);
  if(cr)return cr;
  const rr = users.checkRequired(user_data)
  if(!(rr === true)) return rr;
  users.addRow({...user_data, password:hash(user_data.password)});
  return login(user_data.email,user_data.password)
}
function checkJwt(jwt){
  const payload = payloadJwt(jwt);
  const _email = users.columns.find(o=>o.column_name==="email").column_tag;
  const _password= users.columns.find(o=>o.column_name==="password").column_tag;
  const _id= users.columns.find(o=>o.column_name==="id").column_tag;
  const user = users.find(payload.user_id,false,`${_id},${_email},${_password}`);
  if(!user)return false;
  const privateKey = getPrivateKey(user.password)
  const pjwt = parseJwt(jwt,privateKey);
  return{
    payload: pjwt,
    user: users.find(user.id)
  }
}
function testRegister(){
  console.log(checkJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDcyNzMzMDAsImlhdCI6MTcwNzE4NjkwMCwidXNlcl9pZCI6Mn0.HwU38ObgzermWrpaqGyBc1BIlnGoVzq50qACJ9bC1Yc'))
}
