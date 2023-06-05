const { createProxyMiddleware } = require("http-proxy-middleware");

let middleware = null;

if (process.env.REACT_APP_ENVIRONMENT === "development") {
  middleware = createProxyMiddleware({
    target: "https://iseevision.fr", // URL de votre API distante
    changeOrigin: true,
    secure: true, // Utiliser true si votre API utilise HTTPS
    cookieDomainRewrite: {
      "*": "localhost", // Domaine du cookie pour les requêtes depuis localhost
    },
  });
}

module.exports = function (app) {
  if (middleware) {
    app.use("/api", middleware);
  }
};
