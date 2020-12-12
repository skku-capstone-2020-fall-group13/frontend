<template>
  <el-dialog
    class="dialog"
    center
    :close-on-click-modal="false"
    :show-close="false"
    :visible.sync="show"
    width="600px"
  >
    <span
      slot="title"
      class="dialog-header"
    >
      간단한 설문조사로 당신의 주거 성향을 파악합니다.
    </span>
    <span>
      주거 쾌적도란? ㅇㅇㅇ
    </span>
    <el-steps
      :active="step"
      finish-status="success"
      align-center
    >
      <el-step title="주거 형태" />
      <el-step title="주거 환경" />
    </el-steps>
    <div
      v-if="step == 0"
      class="survey-step"
    >
      <p>어떤 주거 형태가 더 좋으세요?</p>
      <div class="survey-items">
        <div
          class="survey-item"
          :class="{ active: houseType == 'apartment' }"
          @click="houseType = 'apartment'"
        >
          <div class="survey-item-icon">
            <img src="@/assets/apartment.svg">
          </div>
          <span>아파트</span>
        </div>
        <div
          class="survey-item"
          :class="{ active: houseType == 'flat' }"
          @click="houseType = 'flat'"
        >
          <div class="survey-item-icon">
            <img src="@/assets/home.svg">
          </div>
          <span>주택</span>
        </div>
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-right"
          round
          @click="nextStep(houseType)"
        >
          다음
        </el-button>
      </div>
    </div>
    <div
      v-if="step == 1"
      class="survey-step"
    >
      <p>어디서 사는 게 더 좋으세요?</p>
      <div class="survey-items">
        <div
          class="survey-item"
          :class="{ active: areaType == 'urban' }"
          @click="areaType = 'urban'"
        >
          <div class="survey-item-icon">
            <img src="@/assets/buildings.svg">
          </div>
          <span>시내</span>
        </div>
        <div
          class="survey-item"
          :class="{ active: areaType == 'suburb' }"
          @click="areaType = 'suburb'"
        >
          <div class="survey-item-icon">
            <img src="@/assets/field.svg">
          </div>
          <span>교외</span>
        </div>
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-right"
          round
          @click="nextStep(areaType)"
        >
          다음
        </el-button>
      </div>
    </div>
    <div
      v-if="step == 2"
      class="survey-step"
    >
      <h1>완료되었습니다</h1>
      <div>
        <el-button
          type="primary"
          icon="el-icon-check"
          round
          @click="finish"
        >
          시작하기
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['show'],
  data() {
    return {
      step: 0,
      houseType: null,
      areaType: null
    };
  },
  methods: {
    nextStep(selection) {
      if (selection) this.step += 1;
    },
    finish() {
      this.$store.commit('setSurvey', {
        houseType: this.houseType,
        areaType: this.areaType
      });
      this.$emit('finished');
    }
  }
};
</script>

<style scoped lang="scss">
$vertical-gap: 2vh;

.survey-step {
  text-align: center;
  margin-top: $vertical-gap;
  display: flex;
  flex-flow: column;
  row-gap: $vertical-gap;

  p {
    font-weight: bold;
    font-size: 1.2em;
  }
}

.survey-items {
  display: flex;
  justify-content: space-around;
}

.survey-item {
  display: flex;
  flex-flow: column;
  text-align: center;
  row-gap: $vertical-gap;

  &.active &-icon {
    background: #d9ecff;
  }

  span {
    font-weight: bold;
    font-size: 1.2em;
  }
}

.survey-item-icon {
  padding: 40px;
  border-radius: 100%;
  background: #dcdfe6;

  img {
    fill: white;
    width: 60px;
  }
}
</style>
