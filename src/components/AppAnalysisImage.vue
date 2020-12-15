<template>
  <div class="analysis-image-container">
    <el-image
      v-show="mode === 'original'"
      :src="originalImage"
      fit="cover"
      class="image"
    />
    <el-image
      v-show="mode === 'predict'"
      :src="predictImage"
      fit="cover"
      class="image"
    />
    <el-button-group class="mode">
      <el-button
        class="mode-button"
        :type="originalType"
        @click="mode = 'original'"
      >
        위성
      </el-button>
      <el-button
        class="mode-button"
        :type="predictType"
        @click="mode = 'predict'"
      >
        분석
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  props: ['originalImage', 'predictImage'],
  data() {
    return {
      mode: 'original'
    };
  },
  computed: {
    originalType() {
      return this.mode === 'original' ? 'primary' : 'default';
    },
    predictType() {
      return this.mode === 'predict' ? 'primary' : 'default';
    }
  }
};
</script>

<style scoped lang="scss">
.analysis-image-container {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.image {
  border-radius: 4px;
}

.mode {
  width: 100%;
  display: flex;
  justify-content: stretch;

  &-button {
    flex: 1;
  }
}
</style>
