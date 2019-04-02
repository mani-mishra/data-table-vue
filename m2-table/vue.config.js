// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/brite-core-task/" : "/",

  css: {
    loaderOptions: {
      sass: {
        data: `
              @import "@/scss/_variables.scss";
            `
      }
    }
  }
};
