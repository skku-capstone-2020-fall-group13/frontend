<template>
  <div class="analysis-container">
    <div class="analysis-header">
      <h1>
        <a
          href="#"
          @click="closeAnalysis"
        ><i class="el-icon-arrow-left" /></a>쾌적도 분석
      </h1>
      <span>최대 3장소까지 비교 가능합니다.</span>
    </div>
    <ul class="items">
      <li
        is="app-analysis-item"
        v-for="(analysis, index) in analyses"
        :key="'item'+index"
        class="item"
        :analysis="analysis"
        @remove="removeAnalysis(analysis)"
      />
      <template v-if="analyses.length < 3">
        <li
          v-for="index in 3 - analyses.length"
          :key="'add'+index"
          class="item analysis-add"
        >
          <h1>분석을 추가하세요.</h1>
          <span>사이드바 > 분석에서 추가 가능합니다.</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import AppAnalysisItem from './AppAnalysisItem.vue';
export default {
  components: {
    AppAnalysisItem
  },
  data() {
    return {};
  },
  computed: {
    analyses() {
      return this.$store.state.analyses;
    }
  },
  methods: {
    closeAnalysis() {
      this.$store.commit('setContentState', 'map');
      this.$store.commit('setNavState', 'search');
    },
    removeAnalysis(analysis) {
      this.$store.commit('removeAnalysis', analysis);
    }
  }
};
</script>

<style scoped lang="scss">
.analysis-container {
  padding: 40px;
  display: flex;
  flex-flow: column;
  background: #1c1c1d;
  row-gap: 10px;

  h1 {
    text-decoration: none;
    color: white;
    margin: 0;

    a {
      color: white;
    }
  }
}

.analysis-header {
  display: flex;
  align-items: flex-end;
  gap: 10px;

  span {
    color: white;
    font-size: 16px;
  }
}

.items {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 40px;
}

.item {
  flex: 1;
}

.analysis-add {
  background: #303133;
  border-radius: 8px;
  display: flex;
  flex-flow: column;
  gap: 10px;
  color: white;
  justify-content: center;
  align-items: center;
}
</style>
