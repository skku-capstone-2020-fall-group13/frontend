<template>
  <div class="container">
    <app-side-bar
      class="sidebar"
      @select-result="updateCoords"
    />
    <app-base-map
      class="map"
      :latitude="latitude"
      :longitude="longitude"
    />
    <app-survey
      class="dialog"
      :show="surveyShow"
      @finished="finishSurvey"
    />
  </div>
</template>

<script>
import AppBaseMap from './components/AppBaseMap.vue';
import AppSurvey from './components/AppSurvey.vue';
import AppSideBar from './components/AppSideBar.vue';

export default {
  name: 'App',
  components: {
    AppBaseMap,
    AppSurvey,
    AppSideBar
  },
  data() {
    return {
      latitude: null,
      longitude: null,
      surveyShow: true,
      survey: null,
      currentPlace: null,
    };
  },
  methods: {
    finishSurvey(survey) {
      this.survey = survey;
      this.surveyShow = false;
    },
    updateCoords(coords) {
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.sidebar {
  width: 400px;
  height: 100%;
}

.map {
  flex: 1;
}
</style>
