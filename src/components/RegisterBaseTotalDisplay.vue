<template>
  <div class="container result-container-total">
    <p class="resultCanvas">
      <span class="totalFounded">{{ totalRegisters }}</span> registre<span v-if="isPlural">s</span>
      disponible<span v-if="isPlural">s</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "RegisterBaseTotalDisplay",
  props: {
    totalRegisters : {
      type: Number,
      required: true,
      default: 0
    },
  },
  computed: {
    isPlural() {
      return this.totalRegisters > 1;
    }
  }
}
</script>

<style scoped>
.result-container-total {
  padding: 10px;
  margin-bottom: 20px;
}
.totalFounded {
  font-size: 35px;
  font-weight: bold;
  color: #8d1919;
}
</style>