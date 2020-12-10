const secrets = require('./secrets.json');

process.env.VUE_APP_KAKAO_APP_KEY = secrets.kakaoAppKey;
process.env.VUE_APP_KAKAO_REST_API_KEY = secrets.kakaoRestApiKey;

module.exports = {
  transpileDependencies: [],
};
