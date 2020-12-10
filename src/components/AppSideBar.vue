<template>
  <div class="sidebar">
    <h1>주거 쾌적도 탐색기</h1>
    <p>검색창에 알고 싶은 장소를 입력하세요.</p>
    <el-input
      v-model="query"
      type="text"
      @keyup.native.enter="getAddress"
    >
      <i
        slot="suffix"
        class="el-input__icon el-icon-search"
      />
    </el-input>
    <el-button
      type="primary"
      icon="el-icon-place"
    >
      현재 위치 보기
    </el-button>
    <div class="content">
      <ul class="search-results">
        <li
          v-for="(result, index) in results"
          :key="index"
          class="search-result"
          @click="selectResult(result)"
        >
          <h3>{{ result.place_name }}</h3>
          <p>{{ result.address_name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      results: [],
    };
  },
  methods: {
    getAddress() {
      this.$http.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
        headers: { 'Authorization': `KakaoAK ${process.env.VUE_APP_KAKAO_REST_API_KEY}`},
        params: {
          query: this.query
        }
      }).then(({ data }) => { this.results = data.documents });
    },
    selectResult(result) {
      this.$emit('select-result', { latitude: result.y, longitude: result.x });
    },
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  background :white;
  padding: 2vh;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  row-gap: 1vh;

  h1 {
    margin-bottom: 0;
  }
}

.content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-flow: column;
}

.search-results {
  display: flex;
  flex-flow: column;
  gap: 1vh;
  padding: 0;
  margin: 0;
  list-style: none;
}

.search-result {
  padding: 2vh;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  flex: 1;

  &:hover {
    cursor: pointer;
    background: #f4f4f5;
  }
}
</style>