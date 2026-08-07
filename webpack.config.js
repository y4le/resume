const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Optional base path for the dev server, used when serving behind a path-scoped
// proxy (e.g. Tailscale Serve at https://<node>.ts.net/resume/). Set via
// `DEV_BASE_PATH=/resume/`. Production is unaffected (assets stay relative,
// which is what GitHub Pages at /resume/ needs).
const RAW_BASE = process.env.DEV_BASE_PATH || '/';
const BASE = RAW_BASE.endsWith('/') ? RAW_BASE : RAW_BASE + '/';

module.exports = (env, argv) => {
  const isProd = argv && argv.mode === 'production';
  const scoped = !isProd && BASE !== '/';

  return {
    entry: './src/js/app.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      // Relative asset URLs in dev: Tailscale Serve strips the /resume prefix
      // before forwarding, so the browser must request assets under the prefix while
      // the dev server still serves them from root. Prod uses webpack's default
      // ('auto' → also relative, which is what GitHub Pages at /resume/ needs).
      publicPath: isProd ? undefined : '',
    },
    devServer: {
      static: { directory: path.join(__dirname, 'dist') },
      // accept the <node>.ts.net Host header forwarded by Tailscale Serve
      allowedHosts: 'all',
      // when path-scoped, advertise the live-reload socket under BASE so the browser
      // hits wss://<node>.ts.net/resume/ws (Tailscale strips the prefix and the
      // dev server's default /ws handler answers). 'auto://0.0.0.0:0' derives the
      // protocol/host/port from the page so it uses the public 443, not the dev port.
      client: scoped ? { webSocketURL: 'auto://0.0.0.0:0' + BASE + 'ws' } : undefined,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          use: ["babel-loader"]
        },
        {
          test: /\.(css)$/,
          include: path.resolve(__dirname, 'src'),
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.join(__dirname, 'src', 'index.html') }),
      // The PDF is no longer a webpack asset — the site links a static resume.pdf
      // written into dist/ by the prerender step. Only the favicon needs copying.
      new CopyPlugin({
        patterns: [
          { from: path.join(__dirname, 'src', 'assets', 'favicon.svg'), to: 'favicon.svg' }
        ]
      }),
    ],
    resolve: {
      alias: {
        'react': 'preact/compat',
        'react-dom': 'preact/compat'
      }
    }
  };
};
