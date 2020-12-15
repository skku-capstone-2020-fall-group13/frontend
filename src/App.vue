<template>
  <div class="container">
    <app-side-bar class="sidebar" />
    <div class="content">
      <app-base-map
        v-if="contentState === 'map'"
        class="map"
      />
      <app-analysis
        v-if="contentState === 'analysis'"
        class="analysis"
      />
    </div>
    <app-survey
      id="dialog-survey"
      :show="showSurvey"
      @finished="showSurvey = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AppBaseMap from './components/AppBaseMap.vue';
import AppSurvey from './components/AppSurvey.vue';
import AppSideBar from './components/AppSideBar.vue';
import AppAnalysis from './components/AppAnalysis.vue';

export default {
  name: 'App',
  components: {
    AppBaseMap,
    AppSurvey,
    AppSideBar,
    AppAnalysis
  },
  data() {
    return {
      showSurvey: true,
    };
  },
  computed: mapState(['contentState']),
  mounted() {
    this.$store.dispatch('setCurrentLocationCoords');
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

.content {
  flex: 1;
}

.map {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.analysis {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
