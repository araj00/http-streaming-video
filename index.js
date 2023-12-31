const express = require('express');
const fs = require("fs");
const app = express();

app.get("/",(req,res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/video',function(req,res){
    const range = req.headers.range;
    console.log(range)
    if(!range){
        res.status(400).send("Required Range header");
    }

    // getting video stats
    const videoPath = "anime.mp4";
    const videoSize = fs.statSync(videoPath).size;
    console.log(videoSize)
    // parse range
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, {start,end});

    videoStream.pipe(res);
})

app.listen(8000,() => {
    console.log('listening on port 8000.');
})