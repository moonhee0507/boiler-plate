import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 5000;

mongoose
    .connect(
        `mongodb+srv://moon-hee:${process.env.PW}@boiler-plate.zsdkkv9.mongodb.net/?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("몽고DB 연결 중..."))
    .catch((e) => console.error(e));

app.get("/", (req, res) => res.send("안녕하세요🥰"));
app.listen(port, () => console.log(`${port} 실행 중...`));
