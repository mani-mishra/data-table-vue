// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
              @import "@/scss/_variables.scss";
              @import "@/scss/_checkbox.scss";
            `
      }
    }
  }
};
