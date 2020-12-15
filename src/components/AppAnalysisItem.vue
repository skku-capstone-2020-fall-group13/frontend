<template>
  <div class="item-container">
    <div class="item-header">
      <div class="item-header-left">
        <div class="item-meta">
          <div v-if="analysis.name">
            <h1>{{ analysis.name }}</h1>
            <span>{{ analysis.address }}</span>
          </div>
          <div v-else>
            <h1>{{ analysis.address }}</h1>
          </div>
          <span>위도: {{ analysis.coords.latitude | toFixed(4) }}, 경도:
            {{ analysis.coords.longitude | toFixed(4) }}</span>
          <el-button
            round
            size="mini"
            icon="el-icon-close"
            @click="$emit('remove')"
          >
            목록에서 제거
          </el-button>
        </div>
        <div class="item-score">
          <span>쾌적도</span>
          <h2>
            {{
              getPersonalizedScore(
                analysis.scores.score,
                analysis.scores.criterion.personalize
              ) | toFixed(2)
            }}점
          </h2>
        </div>
      </div>
      <app-analysis-image
        :original-image="analysis.original_image"
        :predict-image="analysis.predict_image"
        class="item-image"
      />
    </div>
    <div class="item-content">
      <el-menu
        default-active="0"
        mode="horizontal"
        @select="handleSelectMenu"
      >
        <el-menu-item index="0">
          기준별 점수
        </el-menu-item>
        <el-menu-item index="1">
          비율 보기
        </el-menu-item>
      </el-menu>
      <div
        v-if="activeMenuIndex === '0'"
        class="item-content-criterion"
      >
        <h3>기본 지수</h3>
        <ul>
          <li
            v-for="(criteria, index) in analysis.scores.criterion.basic"
            :key="index"
          >
            <div>
              <h4>{{ criteria.name }}</h4>
              <span>{{ criteria.desc }}</span>
            </div>
            <h4>
              {{ criteria.score | toFixed(2) }}
            </h4>
          </li>
        </ul>
        <h3>개인화 지수</h3>
        <ul>
          <li
            v-for="(criteria, index) in analysis.scores.criterion.personalize"
            :key="index"
          >
            <div>
              <h4>{{ criteria.name }}</h4>
              <span>{{ criteria.desc }}</span>
            </div>
            <h4>
              {{ criteria.score | toFixed(2) }}
            </h4>
          </li>
        </ul>
      </div>
      <div
        v-if="activeMenuIndex === '1'"
        class="item-content-classes"
      >
        <ul>
          <li
            v-for="(clz, index) in analysis.scores.classes"
            :key="index"
          >
            <div class="item-content-class-left">
              <span
                class="item-content-class-color"
                :style="{ background: clz.color }"
              />
              <h3>{{ clz.name }}</h3>
            </div>
            <h3>{{ clz.proportion | toFixed(2) }}%</h3>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AppAnalysisImage from './AppAnalysisImage.vue';
export default {
  components: {
    AppAnalysisImage
  },
  props: ['analysis'],
  data() {
    return {
      activeMenuIndex: '0'
    };
  },
  methods: {
    handleSelectMenu(index) {
      this.activeMenuIndex = index;
    },
    getPersonalizedScore(score, personalizeCriterion) {
      return this.$store.getters.getPersonalizedScore(
        score,
        personalizeCriterion
      );
    }
  }
};
</script>

<style scoped lang="scss">
.item-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #c0c4cc;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
}

.item-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 20px;
  gap: 20px;

  h1,
  h2 {
    color: black;
    margin: 0;
  }
}

.item-header-left {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.item-meta {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  row-gap: 10px;
}

.item-score {
  h2 {
    font-size: 36px;
  }
}

.item-image {
  max-width: 250px;
}

.item-content-criterion {
  margin-top: 20px;

  ul {
    list-style: none;
    padding-left: 0;
    display: flex;
    flex-flow: column;
    row-gap: 20px;

    li {
      padding: 15px;
      border-radius: 4px;
      background: #ecf5ff;
      display: flex;
      justify-content: space-between;

      h4 {
        margin: 0;
      }
    }
  }
}

.item-content-classes {
  margin-top: 20px;
  ul {
    list-style: none;
    padding-left: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    li {
      padding: 15px;
      border-radius: 4px;
      background: #ecf5ff;
      display: flex;
      justify-content: space-between;

      h3 {
        margin: 0;
      }
    }
  }
}

.item-content-class-left {
  display: flex;
  gap: 10px;
}

.item-content-class-color {
  height: 20px;
  width: 20px;
  border-radius: 100%;
  display: inline-block;
}
</style>
