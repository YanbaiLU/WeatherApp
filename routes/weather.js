// routes/weather.js
const express = require("express");
const router = express.Router();
const db = require("../firebase");

const fs = require("fs");
const path = require("path");

// 新增或更新天气信息
router.post("/addData/:location/:date", (req, res) => {
    const { location, date } = req.params;
    const { condition, temperature } = req.body;

    db.ref(`weather/${location}/${date}`)
        .set({ condition, temperature })
        .then(() => res.send({ success: true }))
        .catch(err => res.status(500).send({ error: err.message }));
});

// 获取指定地点和日期的天气
router.get("/searchData/:location/:date", (req, res) => {
    const { location, date } = req.params;

    db.ref(`weather/${location}/${date}`)
        .once("value")
        .then(snapshot => res.send(snapshot.val()))
        .catch(err => res.status(500).send({ error: err.message }));
});

// 获取某地点所有日期的天气
router.get("/searchData/:location", (req, res) => {
    const { location } = req.params;

    db.ref(`weather/${location}`)
        .once("value")
        .then(snapshot => res.send(snapshot.val()))
        .catch(err => res.status(500).send({ error: err.message }));
});

// 更新天气信息（部分字段）
router.patch("/updateData/:location/:date", (req, res) => {
    const { location, date } = req.params;

    db.ref(`weather/${location}/${date}`)
        .update(req.body)
        .then(() => res.send({ success: true }))
        .catch(err => res.status(500).send({ error: err.message }));
});

// 删除天气信息
router.delete("/deleteData/:location/:date", (req, res) => {
    const { location, date } = req.params;

    db.ref(`weather/${location}/${date}`)
        .remove()
        .then(() => res.send({ success: true }))
        .catch(err => res.status(500).send({ error: err.message }));
});

router.get("/exportData", (req, res) => {
    console.log('Export route hit');
    const { location } = req.params;

    db.ref(`weather`)
        .once("value")
        .then(snapshot => {
            // res.send(snapshot.val())
            const data = snapshot.val();

            // 设置响应头，以便浏览器下载文件
            res.setHeader('Content-Disposition', 'attachment; filename=weather_data.json');
            res.setHeader('Content-Type', 'application/json');

            // 直接将 JSON 数据作为响应体返回
            res.send(JSON.stringify(data, null, 2));
        })
        .catch(err => res.status(500).send({ error: err.message }));
});

module.exports = router;
