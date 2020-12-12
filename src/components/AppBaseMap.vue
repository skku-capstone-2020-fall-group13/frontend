<template>
  <div
    ref="map"
    v-loading="mapLoading"
    class="map-container"
  >
    <div class="center-overlay center-overlay-top" />
    <div class="center-overlay center-overlay-left" />
    <div class="center-overlay center-overlay-right" />
    <div class="center-overlay center-overlay-bottom" />
    <el-button-group class="analyze-button">
      <el-button
        type="primary"
        round
        icon="el-icon-magic-stick"
      >
        이 구역 분석하기
      </el-button>
      <el-button
        round
        icon="el-icon-aim"
        :loading="currentLocationLoading"
        @click="setCurrentLocationCoords"
      >
        현재 위치 보기
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  data: () => {
    return {
      map: null,
      marker: null,
      mapLoading: true,
      currentLocationLoading: false
    };
  },
  computed: {
    place() {
      return this.$store.state.place;
    },
    coords() {
      return this.$store.state.coords;
    }
  },
  watch: {
    coords() {
      this.updateCenterMarker();
    }
  },
  mounted() {
    this.mapLoading = true;
    this.createMap();
    this.mapLoading = false;
  },
  methods: {
    createMap() {
      const coords = new kakao.maps.LatLng(
        this.coords.latitude,
        this.coords.longitude
      );

      this.map = new kakao.maps.Map(this.$refs.map, {
        center: coords,
        level: 5,
        mapTypeId: kakao.maps.MapTypeId.HYBRID,
        scrollwheel: false
      });

      kakao.maps.event.addListener(this.map, 'dragend', () => {
        const changedCoords = this.map.getCenter();
        this.$store.commit('setCoords', {
          latitude: changedCoords.getLat(),
          longitude: changedCoords.getLng()
        });
      });
    },
    updateCenterMarker() {
      if (!this.map) return;

      const coords = new kakao.maps.LatLng(
        this.coords.latitude,
        this.coords.longitude
      );

      if (!this.marker) {
        this.marker = new kakao.maps.Marker({ position: coords });
        this.marker.setMap(this.map);
      }

      this.marker.setPosition(coords);
      this.map.setCenter(coords);
    },
    async setCurrentLocationCoords() {
      this.currentLocationLoading = true;
      await this.$store.dispatch('setCurrentLocationCoords');
      this.currentLocationLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
$overlay-size: 600px;
$overlay-border-style: 4px solid #409eff;

.map-container {
  position: relative;
  width: 100%;
  height: 100%;

  &::v-deep > * {
    overflow: hidden !important;
  }
}

.center-overlay {
  position: absolute;
  z-index: 2000;

  &-top {
    top: calc(50% - (#{$overlay-size} / 2));
    left: calc(50% - (#{$overlay-size} / 2));
    border-top: $overlay-border-style;
    width: $overlay-size;
  }

  &-bottom {
    top: calc(50% + (#{$overlay-size} / 2));
    left: calc(50% - (#{$overlay-size} / 2));
    border-bottom: $overlay-border-style;
    width: $overlay-size;
  }

  &-left {
    top: calc(50% - (#{$overlay-size} / 2));
    left: calc(50% - (#{$overlay-size} / 2));
    border-left: $overlay-border-style;
    height: $overlay-size;
  }
  &-right {
    top: calc(50% - (#{$overlay-size} / 2));
    left: calc(50% + (#{$overlay-size} / 2));
    border-right: $overlay-border-style;
    height: $overlay-size;
  }
}

.analyze-button {
  position: absolute;
  z-index: 2000;
  top: calc(50% + (#{$overlay-size} / 2) + 40px);
  left: 50%;
  transform: translateX(-50%);
}

.current-place-button {
  position: absolute;
  z-index: 2000;
  top: 40px;
  right: 40px;
}
</style>
