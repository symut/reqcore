<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  locations: { location: string, count: number, lat?: number, lon?: number }[]
}>()

const mapContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!mapContainer.value) return

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  const map = L.map(mapContainer.value).setView([-2.5489, 118.0149], 5)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const addMarker = (lat: number, lon: number, locationName: string, count: number) => {
    L.marker([lat, lon], { icon })
      .addTo(map)
      .bindPopup(`<b>${locationName}</b><br/>${count} Lowongan / Jobs`)
  }

  const validMarkers = props.locations.filter(
    (loc) => loc.location && loc.location.trim() && Number.isFinite(loc.lat) && Number.isFinite(loc.lon),
  )

  if (!validMarkers.length) {
    return
  }

  validMarkers.forEach((loc) => {
    addMarker(loc.lat!, loc.lon!, loc.location, loc.count)
  })

  const bounds = L.latLngBounds(validMarkers.map((loc) => [loc.lat!, loc.lon!] as [number, number]))
  map.fitBounds(bounds.pad(0.25))
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-96 rounded-xl overflow-hidden shadow-sm z-0 relative border border-surface-200 dark:border-surface-800" style="z-index: 1;"></div>
</template>
