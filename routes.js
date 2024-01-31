
function doGet(e) {
  return response().json({
    status:true,
    message:"success",
    result:{
      test:test()
      // getAll:models().users.getAll(),
      // getAll_:models().users.getAll(true),
      // find:models().users.find(5),
      // find2:models().users.find(2),
      // find_:models().users.find(5,true),
      // getPage:models().users.getPage(1,10,""),
      // getPage_:models().users.getPage(1,10,"",true),
    }
  })
}
