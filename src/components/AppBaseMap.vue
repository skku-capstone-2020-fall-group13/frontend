<template>
  <div
    ref="map"
    v-loading="mapLoading"
    element-loading-background="#000000cc"
    element-loading-text="로드 중..."
    class="map-container"
  >
    <div class="address-overlay">
      <i class="el-icon-place" /> {{ address }} : {{ name }}
    </div>
    <div class="center-overlay center-overlay-top" />
    <div class="center-overlay center-overlay-left" />
    <div class="center-overlay center-overlay-right" />
    <div class="center-overlay center-overlay-bottom" />
    <el-button-group class="analyze-button">
      <el-button
        type="primary"
        round
        icon="el-icon-magic-stick"
        @click="requestAnalysis"
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
      name: '',
      address: '',
      marker: null,
      mapLoading: true,
      currentLocationLoading: false
    };
  },
  computed: {
    coords: {
      get() {
        return this.$store.state.coords;
      },
      set(coords) {
        this.$store.commit('setCoords', coords);
      }
    }
  },
  watch: {
    coords() {
      this.updateCenterMarker();
      this.getAddress(this.coords);
    }
  },
  mounted() {
    this.mapLoading = true;
    this.createMap();
    this.getAddress(this.coords);
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
        level: 3,
        mapTypeId: kakao.maps.MapTypeId.HYBRID,
        scrollwheel: false
      });

      kakao.maps.event.addListener(this.map, 'dragend', () => {
        const changedCoords = this.map.getCenter();
        this.coords = {
          latitude: changedCoords.getLat(),
          longitude: changedCoords.getLng()
        };
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
    },
    async requestAnalysis() {
      this.mapLoading = true;
      await this.$store.dispatch('requestAnalysis', {
        coords: this.coords,
        address: this.address,
        name: this.name,
      });
      this.$store.commit('setContentState', 'analysis');
      this.$store.commit('setNavState', 'analysis');
      this.mapLoading = false;
    },
    async getAddress(coords) {
      const { data } = await this.$http.get(
        'https://dapi.kakao.com/v2/local/geo/coord2address.json',
        {
          headers: {
            Authorization: `KakaoAK ${process.env.VUE_APP_KAKAO_REST_API_KEY}`
          },
          params: {
            x: coords.longitude,
            y: coords.latitude
          }
        }
      );

      if (data.documents.length > 0) {
        this.address = data.documents[0].address.address_name;

        if (data.documents[0].road_address)
          this.name = data.documents[0].road_address.building_name;
        else this.name = '';
      } else {
        this.address = '';
        this.name = '';
      }
    }
  }
};
</script>

<style scoped lang="scss">
$overlay-size: 500px;
$overlay-border-style: 4px solid #409eff;

.map-container {
  position: relative;
  width: 100%;
  height: 100%;

  &::v-deep > * {
    overflow: hidden !important;
  }
}

.address-overlay {
  position: absolute;
  z-index: 2000;
  background: white;
  width: $overlay-size;
  background: #409eff;
  color: white;
  box-sizing: border-box;
  bottom: calc(50% + (#{$overlay-size} / 2));
  left: 50%;
  padding: 10px;
  text-align: center;
  transform: translateX(-50%);
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
    bottom: calc(50% - (#{$overlay-size} / 2));
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
    right: calc(50% - (#{$overlay-size} / 2));
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
