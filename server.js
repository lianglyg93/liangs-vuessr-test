const express = require("express");
const Vue = require("vue");
const fs = require("fs");

const { createBundleRenderer } = require("vue-server-renderer");
const setupDevServer = require('./build/setup-dev-server')
const server = express();

//express.static处理的是物理磁盘文件
server.use("/dist", express.static("./dist"));
const template = fs.readFileSync("./index.template.html", "utf-8");

let renderer;

const isProd = process.env.NODE_ENV === "production";
let onReady;
if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const template = fs.readFileSync("./index.template.html", "utf-8");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  renderer = createBundleRenderer(serverBundle, {
    template, // （可选）页面模板
    clientManifest, // （可选）客户端构建 manifest
  });
} else {
  //开发模式->监听打包构建->重新生成Renderer渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template, // （可选）页面模板
      clientManifest, // （可选）客户端构建 manifest
    });
  });
}
const render = (req, res) => {
  renderer.renderToString(
    {
      title: "标题",
      meta: `<meta name="description" content="liangs">`,
    },
    (err, html) => {
      console.log(err);
      if (err) {
        res.status(500).end("error");
        return;
      }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      // res.end(html);
      res.end(html);
    }
  );
};
//代码从上至下执行，生产环境通过自己打包文件已经生成了Renderer渲染器，直接获取
//开发环境时，需要等待打包构建->生成renderer渲染器
server.get(
  "/",
  isProd
    ? render
    : async (req, res) => {
        //等待有了renderer渲染器以后，调用render进行渲染
        await onReady;
        render(req, res);
      }
);
server.listen(3000, () => {
  console.log("监听3000！");
});
