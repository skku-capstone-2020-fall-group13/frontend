import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const defaultPlace = {
  name: '성균관대학교 자연과학캠퍼스',
  address: '경기도 수원시 장안구 율천동 서부로 2066'
};

const defaultCoords = {
  latitude: 37.290553,
  longitude: 126.9737686
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
    survey: null,
    scores: [],
    place: defaultPlace,
    placeHistory: [],
    coords: defaultCoords,
    currentLocationCoords: null,
  },
  mutations: {
    setSurvey: (state, survey) => (state.survey = survey),
    setPlace: (state, place) => (state.place = place),
    setCoords: (state, coords) => (state.coords = coords),
    setCurrentLocationCoords: (state, currentLocationCoords) =>
      (state.currentLocationCoords = currentLocationCoords)
  },
  actions: {
    async setCurrentLocationCoords({ commit, state }) {
      if (!state.currentLocationCoords)
        commit('setCurrentLocationCoords', await getCurrentLocationCoords());
      commit('setCoords', state.currentLocationCoords);
    }
  }
});
