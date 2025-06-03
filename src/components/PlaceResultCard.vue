<template>
  <li class="place-item" @click="handleClick">
    <span class="place-label">{{ place.term_fr || place.term }}</span>
    <span class="arrow-icon"></span>
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
  border-bottom: 2px solid #D74A52;
  padding: 13px 0;
  font-family: var(--font-primary);
  font-size: 20px;
  color: #000;
  cursor: pointer;
  transition: color 0.2s;
}

.place-item:hover {
  color: var(--link-over-color);
}

.place-item:hover .arrow-icon {
  /* transform: translateX(3px); */
}

.place-label {
  display: inline-block;
  max-width: calc(100% - 60px);
}

.arrow-icon {
  display: inline-block;
  width: 27px;
  height: 24px;
  background: url("@/assets/images/lieu_fleche.svg") center / cover;
  margin-right: 30px;
  transition: transform 0.2s;
}

@media screen and (max-width: 1024px) {
  .place-label {
    display: inline-block;
    max-width: calc(100% - 40px);
  }

  .arrow-icon {
    margin-right: 10px;
  }
}
</style>
