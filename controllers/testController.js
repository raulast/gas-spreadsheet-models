function test(e={}){
  return response().json({
    status:true,
    message:"success",
    result:{
      data:1
    }
  });
}

function inlineImage() {
  var googleLogoUrl = "https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png";
  var youtubeLogoUrl =
        "https://developers.google.com/youtube/images/YouTube_logo_standard_white.png";
  var googleLogoBlob = UrlFetchApp
                         .fetch(googleLogoUrl)
                         .getBlob()
                         .setName("googleLogoBlob");
  var youtubeLogoBlob = UrlFetchApp
                          .fetch(youtubeLogoUrl)
                          .getBlob()
                          .setName("youtubeLogoBlob");
  MailApp.sendEmail({
    to: "******@gmail.com",
    subject: "Test App Script",
    htmlBody: "inline Google Logo<img src='cid:googleLogo'> images! <br>" +
              "inline YouTube Logo <img src='cid:youtubeLogo'>",
    inlineImages:
      {
        googleLogo: googleLogoBlob,
        youtubeLogo: youtubeLogoBlob
      }
  });
}

function cuotaMail(){
  const cuota = MailApp.getRemainingDailyQuota();
  Logger.log(`CuotaMail: ${cuota}`);
  return [`CuotaMail: ${cuota}`];
}