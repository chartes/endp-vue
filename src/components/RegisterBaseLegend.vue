<template>
  <div class="container result-container-legend">
    <p class="legend-title">Légende</p>
    <div class="legend-item">
      <span class="icon book-icon"><i class="fas fa-book-open"></i></span>
      <span class="legend-text">fac-similé intéractif</span>
    </div>
    <div class="legend-item">
      <span class="icon book-icon"><i class="fas fa-book"></i></span>
      <span class="legend-text">édition TEI</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterBaseLegend"
}
</script>

<style scoped>
.result-container-legend {
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 30%;
  position: relative;
}

.legend-title {
  background-color: white;
  position: absolute;
  top: -12px;
  left: 5px;
  padding: 0 5px;
  margin-left: 5px;
  font-weight: bold;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.book-icon {
  margin-right: 5px;
}
</style>