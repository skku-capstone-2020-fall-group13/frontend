const secrets = require('./secrets.json');

process.env.VUE_APP_NAME = '주거 쾌적도 탐색기';
process.env.VUE_APP_KAKAO_APP_KEY = secrets.kakaoAppKey;
process.env.VUE_APP_KAKAO_REST_API_KEY = secrets.kakaoRestApiKey;

module.exports = {
  transpileDependencies: [],
};
