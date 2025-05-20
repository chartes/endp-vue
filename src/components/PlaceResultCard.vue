<template>
  <li class="place-item" @click="handleClick">
    <span class="place-label">{{ place.term_fr || place.term }}</span>
    <span class="arrow-icon">→</span>
  </li>
</template>

<script>
export default {
  name: "PlaceResultCard",
  props: {
    place: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$router.push(`/places/${this.place._id_endp}`);
    }
  }
};
</script>

<style scoped>
.place-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #D74A52;
  padding: 18px 0;
  font-family: var(--font-secondary);
  font-size: 22px;
  color: #000;
  cursor: pointer;
  transition: color 0.2s;
}

.place-item:hover .arrow-icon {
  transform: translateX(3px);
}

.arrow-icon {
  color: #D74A52;
  font-size: 22px;
  transition: transform 0.2s;
}
</style>
