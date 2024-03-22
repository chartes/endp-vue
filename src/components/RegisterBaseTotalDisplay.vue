<template>
  <div class="container result-container-total">
    <p class="resultCanvas">
      <span class="totalFounded">{{ totalRegisters }}</span>
      <span>
        Registre<span v-if="isPlural">s</span>
        <br/>
        disponible<span v-if="isPlural">s</span>
      </span>
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
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: solid 6px #000000;
}
.resultCanvas {
  display: flex;
  align-items: flex-start;

  font-size: 20px;
  color: #000000;
  font-weight: 400;
  font-style: italic;
  line-height: 1.2;
}
.totalFounded,
.resultCanvas > span:last-child {
  padding: 13px 10px 32px;
}
.totalFounded {
  display: inline-block;
  min-width: 75px;
  background-color: #000000;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  color: #FFFFFF;
  text-align: center;
}

</style>