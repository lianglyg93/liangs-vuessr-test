const Vue = require("vue");
const renderer = require("vue-server-renderer").createRenderer();
const express = require("express");

const server = express();

server.get("/", (req, res) => {
  const app = new Vue({
    template: `<div class="app">
      <p>{{msg}}</p>
    </div>`,
    data: {
      msg: "测试demo1231",
    },
  });

  renderer
    .renderToString(app)
    .then((html) => {
      // console.log(html);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      // res.end(html);
      res.end(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        ${html}
      </body>
      </html>`);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).end("error");
    });
});
server.listen(3000);
