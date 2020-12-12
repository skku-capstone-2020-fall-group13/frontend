<template>
  <div class="sidebar-container">
    <div class="sidebar-header">
      <h1>주거 쾌적도 탐색기🌳</h1>
      <el-input
        v-model="query"
        type="text"
        @keyup.native.enter="getAddress"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="getAddress"
        />
      </el-input>
      <div class="sidebar-nav">
        <el-button
          type="primary"
          class="sidebar-nav-button"
          icon="el-icon-search"
          :class="{ active: activeNavState == 0 }"
          @click="activeNavState = 0"
        >
          검색
        </el-button>
        <el-button
          type="primary"
          class="sidebar-nav-button"
          icon="el-icon-collection-tag"
          :class="{ active: activeNavState == 1 }"
          @click="activeNavState = 1"
        >
          분석 기록
        </el-button>
      </div>
    </div>
    <div
      v-if="activeNavState === 0"
      class="sidebar-content"
    >
      <div
        v-if="results.length == 0"
        class="search-results-empty"
      >
        검색창에 알고 싶은 장소를 입력하세요.
      </div>
      <div v-if="results.length > 0">
        <div class="search-results-meta">
          <span>전체 결과 {{ results.length }}건</span>
          <el-button
            icon="el-icon-close"
            circle
            size="mini"
            @click="clearResults"
          />
        </div>
        <ul class="search-results">
          <li
            v-for="(result, index) in results"
            :key="index"
            class="search-result"
            :class="{ active: activeResult === result }"
          >
            <a
              class="search-result-content"
              href="#"
              @click="selectResult(result)"
            >
              <h4><i class="el-icon-place" />{{ result.meta.name }}</h4>
              <small>{{ result.meta.address }}</small>
            </a>
            <div class="search-result-actions">
              <el-button icon="el-icon-magic-stick">
                분석
              </el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="activeNavState === 1"
      class="sidebar-content"
    >
      <ul class="history-items" />
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
      activeNavState: 0
    };
  },
  methods: {
    getAddress() {
      this.$http
        .get('https://dapi.kakao.com/v2/local/search/keyword.json', {
          headers: {
            Authorization: `KakaoAK ${process.env.VUE_APP_KAKAO_REST_API_KEY}`
          },
          params: {
            query: this.query
          }
        })
        .then(({ data }) => {
          this.results = data.documents.map(doc => ({
            meta: {
              name: doc.place_name,
              address: doc.road_address_name,
              category: doc.category
            },
            coords: {
              latitude: doc.y,
              longitude: doc.x
            }
          }));

          if (this.results.length > 0) this.selectResult(this.results[0]);
        });
    },
    selectResult(result) {
      this.activeResult = result;
      this.$store.commit('setPlace', result.place);
      this.$store.commit('setCoords', result.coords);
    },
    clearResults() {
      this.query = '';
      this.results = [];
      this.activeResult = null;
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
}

.search-results-empty {
  justify-self: center;
  align-self: center;
  display: flex;
}

.search-results-meta {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-results {
  display: flex;
  justify-self: stretch;
  flex-flow: column;
  padding: 0;
  margin: 0;
  list-style: none;
}

.search-result {
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

  .search-result-content {
    text-decoration: none;
    color: #000;
  }

  .search-result-actions {
    display: none;
  }

  &:hover .search-result-actions {
    display: flex;
    height: 100%;
    position: absolute;
    top: 0;
    right: 20px;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
