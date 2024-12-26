function imgURLs(folder = "", fileName = "") {
    if (!folder || !fileName) {
        return null;
    }
    const dir = folder;
    const img = fileName;

    const file = DriveApp.getFolderById(dir).getFilesByName(img).next();
    const fid = file.getId();
    // const f = Drive.Files.get(fid);
    return {
        // ...f,
        thumbnail: `https://lh3.googleusercontent.com/d/${fid}=s220`,
        url: `https://lh3.googleusercontent.com/d/${fid}`
    }
}