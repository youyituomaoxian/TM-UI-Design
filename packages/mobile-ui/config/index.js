/**
 * Taro CLI 约定入口：config/index.js（真实配置在 taro.config.js，此处转发）
 */
const config = require('./taro.config');

module.exports = function (merge) {
  if (typeof merge === 'function') {
    return merge({}, config);
  }
  return config;
};
