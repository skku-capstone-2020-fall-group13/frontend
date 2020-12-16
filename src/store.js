import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const criteriaMapper = {
  '주택/아파트 지수': 'houseType',
  '개발 지수': 'areaType'
};

const defaultCoords = {
  latitude: 37.290553,
  longitude: 126.9737686
};

const defaultConfig = {
  houseType: true,
  areaType: true,
};

const getCurrentLocationCoords = () => {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(({ coords }) =>
      resolve({ latitude: coords.latitude, longitude: coords.longitude })
    );
  });
};

export default new Vuex.Store({
  state: {
    config: defaultConfig,
    analyses: [],
    histories: [],
    coords: defaultCoords,
    currentLocationCoords: null,
    navState: 'search',
    contentState: 'map',
  },
  getters: {
    getPersonalizedScore: (state) => (score, personalizeCriterion) => {
      let finalScore = score;
      const personalizeWeight = 0.1;

      personalizeCriterion.forEach((criteria) => {
        if (state.config[criteriaMapper[criteria.name]])
          finalScore += personalizeWeight * criteria.score;
        else
          finalScore += personalizeWeight * (100 - criteria.score);
      });

      return finalScore;
    }
  },
  mutations: {
    setConfig: (state, config) => (state.config = config),
    setCoords: (state, coords) => (state.coords = coords),
    setCurrentLocationCoords: (state, currentLocationCoords) =>
      (state.currentLocationCoords = currentLocationCoords),
    setNavState: (state, navState) => (state.navState = navState),
    setContentState: (state, contentState) => (state.contentState = contentState),
    addAnalysis: (state, analysis) => (state.analyses.push(analysis)),
    removeAnalysis: (state, analysis) => (state.analyses.splice(state.analyses.indexOf(analysis), 1)),
    addHistory: (state, history) => (state.histories.push(history)),
  },
  actions: {
    async setCurrentLocationCoords({ commit, state }) {
      if (!state.currentLocationCoords)
        commit('setCurrentLocationCoords', await getCurrentLocationCoords());
      commit('setCoords', state.currentLocationCoords);
    },
    async requestAnalysis({ state, commit }, { coords, name, address }) {
      const existAnalyses = state.histories.filter(h => h.coords == coords);
      if (existAnalyses.length) {
        if (state.analyses.indexOf(existAnalyses[0]) < 0)
          commit('addAnalysis', existAnalyses[0]);
        return;
      }

      const { data } = await Vue.axios.get('https://capstone-backend.junbread.win/analyze', { params: { x: coords.longitude, y: coords.latitude }});
      
      const analysis = { coords, name, address, ...data };

      commit('addHistory', analysis);

      if (state.analyses.length < 3)
        commit('addAnalysis', analysis);
      else
        alert('분석은 최대 3개까지 동시에 볼 수 있습니다. 기존에 선택되어 있는 분석을 해제하고 새롭게 추가된 분석을 선택하세요.');
    },
  }
});
