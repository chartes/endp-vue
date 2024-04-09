<template>
  <div class="tooltip" @mouseover="show = true" @mouseleave="show = false">
    <slot></slot>
    <div v-if="show" class="tooltip-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
}
</script>

<style scoped>
.tooltip-content {
  position: absolute;
  background-color: #555;
  color: white;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  z-index: 1;
}
/* Vous pouvez ajouter plus de styles ici pour personnaliser l'apparence */
</style>