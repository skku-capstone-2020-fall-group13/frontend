<template>
  <div class="sidebar-container">
    <div class="sidebar-header">
      <h1>주거 쾌적도 탐색기🌳</h1>
      <el-input
        v-model="query"
        type="text"
        @keyup.native.enter="search"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="search"
        />
      </el-input>
      <div class="sidebar-nav">
        <el-button
          type="primary"
          class="sidebar-nav-button"
          icon="el-icon-search"
          :class="{ active: navState === 'search' }"
          @click="
            navState = 'search';
            contentState = 'map';
          "
        >
          검색
        </el-button>
        <el-button
          type="primary"
          class="sidebar-nav-button"
          icon="el-icon-collection-tag"
          :class="{ active: navState === 'analysis' }"
          @click="
            navState = 'analysis';
            contentState = 'analysis';
          "
        >
          분석
        </el-button>
        <el-button
          type="primary"
          class="sidebar-nav-button"
          icon="el-icon-user"
          :class="{ active: navState === 'my' }"
          @click="navState = 'my'"
        >
          MY
        </el-button>
      </div>
    </div>
    <div
      v-if="navState === 'search'"
      class="sidebar-content search"
    >
      <div
        v-if="results.length == 0"
        class="list-empty"
      >
        검색창에 알고 싶은 장소를 입력하세요.
      </div>
      <div v-if="results.length > 0">
        <div class="list-meta">
          <span>전체 결과 {{ results.length }}건</span>
          <el-button
            icon="el-icon-close"
            circle
            size="mini"
            @click="clearResults"
          />
        </div>
        <ul class="list-items">
          <li
            v-for="(result, index) in results"
            :key="index"
            class="list-item"
            :class="{ active: activeResult === result }"
          >
            <div class="list-item-content">
              <h4><i class="el-icon-place" />{{ result.meta.name }}</h4>
              <small>{{ result.meta.address }}</small>
            </div>
            <div class="list-item-actions">
              <el-button
                icon="el-icon-view"
                @click="selectResult(result)"
              >
                보기
              </el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="navState === 'analysis'"
      class="sidebar-content history"
    >
      <div
        v-if="histories.length == 0"
        class="list-empty"
      >
        분석 기록이 존재하지 않습니다.
      </div>
      <div v-if="histories.length > 0">
        <div class="list-meta">
          <span>전체 결과 {{ histories.length }}건</span>
        </div>
        <ul class="list-items">
          <li
            v-for="(history, index) in histories"
            :key="index"
            class="list-item"
            :class="{ active: isHistoryActivated(history) }"
          >
            <div class="list-item-content">
              <h4>
                <i class="el-icon-place" />{{ history.name || '미등록 장소' }}
              </h4>
              <small>{{ history.address }}</small>
            </div>
            <div>
              <h4>
                {{
                  getPersonalizedScore(
                    history.scores.score,
                    history.scores.criterion.personalize
                  ) | toFixed(2)
                }}점
              </h4>
            </div>
            <div class="list-item-actions">
              <el-button
                v-if="!isHistoryActivated(history) && analyses.length < 3"
                icon="el-icon-view"
                @click="selectHistory(history)"
              >
                보기
              </el-button>
              <el-button
                v-if="isHistoryActivated(history)"
                icon="el-icon-close"
                @click="unselectHistory(history)"
              >
                해제
              </el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="navState === 'my'"
      class="sidebar-content my"
    >
      <div>
        <h2>선호도 설정</h2>
        <div class="preference-item">
          <h4>선호 주거 형태</h4>
          <el-radio
            v-model="configHouseType"
            :label="true"
          >
            아파트
          </el-radio>
          <el-radio
            v-model="configHouseType"
            :label="false"
          >
            주택
          </el-radio>
        </div>
        <div class="preference-item">
          <h4>선호 주거 환경</h4>
          <el-radio
            v-model="configAreaType"
            :label="true"
          >
            시내
          </el-radio>
          <el-radio
            v-model="configAreaType"
            :label="false"
          >
            교외
          </el-radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      results: [],
      activeResult: null,
      configHouseType: null,
      configAreaType: null
    };
  },
  computed: {
    histories() {
      return this.$store.state.histories;
    },
    analyses() {
      return this.$store.state.analyses;
    },
    navState: {
      get() {
        return this.$store.state.navState;
      },
      set(navState) {
        this.$store.commit('setNavState', navState);
      }
    },
    contentState: {
      get() {
        return this.$store.state.contentState;
      },
      set(contentState) {
        this.$store.commit('setContentState', contentState);
      }
    },
    config: {
      get() {
        return this.$store.state.config;
      },
      set(config) {
        this.$store.commit('setConfig', config);
      }
    }
  },
  watch: {
    configHouseType() {
      this.changeConfig();
    },
    configAreaType() {
      this.changeConfig();
    },
    config() {
      this.configHouseType = this.config.houseType;
      this.configAreaType = this.config.areaType;
    },
    analyses() {
      this.$forceUpdate();
    }
  },
  mounted() {
    this.configHouseType = this.config.houseType;
    this.configAreaType = this.config.areaType;
  },
  methods: {
    async search() {
      this.navState = 'search';
      this.contentState = 'map';
      const { data } = await this.$http.get(
        'https://dapi.kakao.com/v2/local/search/keyword.json',
        {
          headers: {
            Authorization: `KakaoAK ${process.env.VUE_APP_KAKAO_REST_API_KEY}`
          },
          params: {
            query: this.query
          }
        }
      );

      this.results = data.documents.map(doc => ({
        meta: {
          name: doc.place_name,
          address: doc.address_name
        },
        coords: {
          latitude: doc.y,
          longitude: doc.x
        }
      }));

      if (this.results.length > 0) this.selectResult(this.results[0]);
    },
    selectResult(result) {
      this.activeResult = result;
      this.$store.commit('setCoords', result.coords);
    },
    requestAnalysis(result) {
      this.$store.dispatch('requestAnalysis', {
        ...result.meta,
        coords: result.coords
      });
    },
    clearResults() {
      this.query = '';
      this.results = [];
      this.activeResult = null;
    },
    selectHistory(history) {
      this.$store.commit('addAnalysis', history);
      this.$store.commit('setContentState', 'analysis');
    },
    unselectHistory(history) {
      this.$store.commit('removeAnalysis', history);
    },
    isHistoryActivated(history) {
      return this.analyses.indexOf(history) >= 0;
    },
    changeConfig() {
      this.config = {
        houseType: this.configHouseType,
        areaType: this.configAreaType
      };
    },
    getPersonalizedScore(score, personalizeCriterion) {
      return this.$store.getters.getPersonalizedScore(score, personalizeCriterion);
    }
  }
};
</script>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  background: white;
  display: flex;
  flex-flow: column;
}

.sidebar-header {
  padding: 40px 20px 10px 20px;
  background: #409eff;
  color: white;
  display: flex;
  flex-flow: column;
  row-gap: 10px;

  h1 {
    margin: 0;
  }
}

.sidebar-nav {
  display: flex;

  &-button.active {
    background: #3a8ee6;
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  display: grid;

  &.my {
    padding: 20px;

    div {
      display: flex;
      flex-flow: column;
      row-gap: 20px;
    }
    h2 {
      margin: 0;
    }
  }
}

.list-empty {
  justify-self: center;
  align-self: center;
  display: flex;
}

.list-meta {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-items {
  display: flex;
  justify-self: stretch;
  flex-flow: column;
  padding: 0;
  margin: 0;
  list-style: none;
}

.list-item {
  padding: 20px;
  position: relative;
  border-bottom: 1px solid #dcdfe6;

  &:first-of-type {
    border-top: 1px solid #dcdfe6;
  }

  h4 {
    margin: 0;
  }

  &.active,
  &:hover {
    background: #ecf5ff;
  }

  .list-item-content {
    text-decoration: none;
    color: #000;
  }

  .list-item-actions {
    display: none;
  }

  &:hover .list-item-actions {
    display: flex;
    height: 100%;
    position: absolute;
    top: 0;
    right: 20px;
    justify-content: flex-end;
    align-items: center;
  }
}

.preference-item {
  background: #ecf5ff;
  border-radius: 4px;
  padding: 20px;

  h4 {
    margin: 0;
  }
}
</style>
