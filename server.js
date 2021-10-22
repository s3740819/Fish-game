const express = require('express');
const app = express();
const cors = require('cors');
const path = require ("path");

app.use(cors());
app.use(express.static('./'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen('4000',(err)=>{
    if(err) console.log(err);
    else console.log('server running at http://localhost:4000/');
})