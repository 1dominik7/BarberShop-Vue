<template>
  <div ref="mapContainer" class="map" :style="mapStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import L from 'leaflet'

const mapContainer = ref<HTMLDivElement | null>(null)
const mapStyle = {
  width: '100vw',
  height: '40vh',
  borderBottomLeftRadius: '10%',
  borderBottomRightRadius: '10%',
}

onMounted(() => {
  if (mapContainer.value) {
    const map = L.map(mapContainer.value).setView([52.2268452, 20.9881006], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map)
    L.marker([52.2268452, 20.9881006]).addTo(map).bindPopup('Marker at (52.2268452, 20.9881006)')
  }
})
</script>

<style>
.map {
  position: relative;
}
.leaflet-control { z-index: 0 !important}
.leaflet-pane { z-index: 0 !important}
.leaflet-top, .leaflet-bottom {z-index: 0 !important}
</style>
