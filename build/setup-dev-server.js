const fs = require("fs");
const chokidar = require("chokidar");
const path = require("path");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((r) => (ready = r));
  //监视构建 ——> 更新Renderer
  let serverBundle;
  let template;
  let clientManifest;

  //update调用callback去更新server-renderer
  const update = () => {
    if (serverBundle && template && clientManifest) {
      ready();
      //重新生成Renderer渲染器
      callback(serverBundle, template, clientManifest);
    }
  };

  const resolve = (fileName) => path.resolve(__dirname, fileName);

  const templatePath = resolve("../index.template.html");
  template = fs.readFileSync(templatePath, "utf-8");
  update();
  //监听构建template -> 调用update -> 更新renderer渲染器
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    update();
  });
  //监听构建serverBundle -> 调用update -> 更新renderer渲染器
  const serverConfig = require("./webpack.server.config");
  const serverCompiler = webpack(serverConfig);
  const serverDevMiddleware = devMiddleware(serverCompiler, {
    logLevel: "silent", //关闭日志输出， 由FriendlyErrorsWebpackPlugin处理
  });
  //每当编译结束后触发的钩子
  serverCompiler.hooks.done.tap("server", () => {
    serverBundle = JSON.parse(
      //内存读取
      serverDevMiddleware.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-server-bundle.json"),
        "utf-8"
      )
    );
    update();
  });
  // serverCompiler.watch({}, (err, status) => {
  //   if (err) throw err;
  //   if (status.hasErrors()) return;
  //require有缓存，加载后会把结果缓存起来，即便文件内容发生变化，它也不会重新加载新的内容
  //   serverBundle = JSON.parse(fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), "utf-8"));

  //   console.log(serverBundle);
  //   update();
  // });
  //监听构建clientManifest -> 调用update -> 更新renderer渲染器
  const clientConfig = require("./webpack.client.config");
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  clientConfig.entry.app = [
    "webpack-hot-middleware/client?quiet=true&reload=true", //和服务端交互处理热更新一个客户端脚本
    clientConfig.entry.app,
  ];
  clientConfig.output.filename = "[name].js"; //热更新模式下确保一致的 hash
  const clientCompiler = webpack(clientConfig);
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: "silent",
  });
  clientCompiler.hooks.done.tap("client", () => {
    clientManifest = JSON.parse(
      clientDevMiddleware.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-client-manifest.json"),
        "utf-8"
      )
    );
    update();
  });
  server.use(
    webpackHotMiddleware(clientCompiler, {
      log: false, //关闭它本身的日志输出
    })
  );
  //重要！！！将clientDevMiddleware挂载到Express服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddleware);
  return onReady;
};
