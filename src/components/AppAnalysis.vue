<template>
  <div class="analysis-container">
    <ul class="scores">
      <li class="score" v-for="(score, index) in scores" :key="index">
        <i class="el-icon-star-on" />
        <span class="score-name">{{ score.name }}</span>
        <span class="score-number">{{ score.score }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scores: [{
        name: '녹지',
        desc: '구역 내 녹지 비율',
        score: 0
      }]
    };
  }
};
</script>

<style scoped lang="scss">
.analysis-container {
  display: flex;
  align-items: flex-end;
}

.scores {
  width: 100%;
  list-style: none;
  padding-left: 0;
}

.score {
  background: white;
  border-radius: 3vh;
  padding: 1vh;
  display: flex;
}

.score-number {
  align-self: flex-end;
}
</style>