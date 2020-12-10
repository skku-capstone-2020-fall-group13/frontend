<template>
  <div
    ref="map"
    v-loading="loading"
    class="map"
  />
</template>

<script>
/* eslint-disable no-undef */
export default {
  props: ['latitude', 'longitude'],
  data: () => {
    return {
      map: null,
      marker: null,
      loading: true,
    };
  },
  watch: {
    latitude() {
      this.updateCenterMarker(new kakao.maps.LatLng(this.latitude, this.longitude));
    },
    longitude() {
      this.updateCenterMarker(new kakao.maps.LatLng(this.latitude, this.longitude));
    }
  },
  mounted() {
    this.createMap();
  },
  methods: {
    getCurrentCoords() {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(({coords}) => {
          const latLng = new kakao.maps.LatLng(coords.latitude, coords.longitude);
          resolve(latLng);
        });
      });
    },
    async createMap() {
      this.loading = true;

      const centerCoords = await this.getCurrentCoords();

      this.map = new kakao.maps.Map(this.$refs.map, {
        center: centerCoords,
        level: 3,
        mapTypeId: kakao.maps.MapTypeId.HYBRID,
        scrollwheel: false,
      });

      this.marker = new kakao.maps.Marker({ position: centerCoords });
      this.marker.setMap(this.map);

      kakao.maps.event.addListener(this.map, 'click', (e) => {
        this.updateCenterMarker(e.latLng);
      });

      this.loading = false;
    },
    updateCenterMarker(coords) {
      if(!this.marker || !this.map) return;

      this.marker.setPosition(coords);
      this.marker.setMap(this.map);

      this.map.setCenter(coords);
    },
  },
};
</script>

<style scoped lang="scss">
.map {
  position: relative;
  width: 100%;
  height: 100%;

  &::v-deep > * {
    overflow: hidden !important;
  }
}
</style>
