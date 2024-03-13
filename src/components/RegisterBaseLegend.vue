<template>
  <div class="container result-container-legend">
    <p class="legend-title">Légende</p>
    <div class="legend-item">
      <span class="icon book-icon"><i class="fas fa-book"></i></span>
      <span class="legend-text">= fac-similé intéractif</span>
    </div>
    <div class="legend-item">
      <span class="icon book-icon"><i class="fas fa-book-open"></i></span>
      <span class="legend-text">= édition TEI</span>
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
  margin-bottom: 20px;
  position: relative;
}

.legend-title {
  display: none;
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
  justify-content: flex-end;
  margin-bottom: 5px;

  font-size: 20px;
  color: #939393;
  font-weight: 400;
  font-style: italic;
}

.book-icon {
  margin-right: 5px;
  font-size: 24px;
}
</style>