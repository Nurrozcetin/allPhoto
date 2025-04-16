const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { bucket } = require("./firebase");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync("temp")) {
    fs.mkdirSync("temp");
}

const upload = multer({ dest: "temp/" });

let imageStore = {}; 

app.post("/upload", upload.array("media"), async (req, res) => {
    const files = req.files;
    const username = req.body.username;

    if (!files || files.length === 0 || !username) {
        return res.status(400).json({ message: "Eksik bilgi" });
    }

    if (!imageStore[username]) imageStore[username] = [];

    for (const file of files) {
        const destination = `media/${Date.now()}_${file.originalname}`;
        await bucket.upload(file.path, {
            destination,
            metadata: {
                contentType: file.mimetype,
            },
        });

        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
        imageStore[username].push(fileUrl);

        fs.unlinkSync(file.path); 
    }

    res.json({ message: "Yükleme başarılı 🎉" });
});

app.get("/users", (req, res) => {
    res.json(Object.keys(imageStore));
});

app.get("/user-images/:username", (req, res) => {
    const username = req.params.username;
    const images = imageStore[username] || [];
    res.json(images);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
