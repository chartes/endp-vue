<template>
  <div class="box box-results-metadata" :class="{ 'with-legend' : withLegend }">
    <RegisterBaseTotalDisplay
        :total-registers="totalOfRegisters"
    />
    <RegisterBaseLegend class="register-base-legend" />
  </div>
</template>

<script>
import RegisterBaseTotalDisplay from "@/components/RegisterBaseTotalDisplay";
import RegisterBaseLegend from "@/components/RegisterBaseLegend";
export default {
  name: "RegisterMetadataBox",
  components: {
    RegisterBaseTotalDisplay,
    RegisterBaseLegend
  },
  props: {
    totalOfRegisters: {
      type: Number,
      required: true,
      default: 0
    },
    withLegend: {
      type: Boolean,
      required: false,
      default: true
    }
  },
}
</script>

<style scoped>
.box-results-metadata {
  background-color: transparent;
  border: none;
  border-radius: 0;
  padding: 40px 0 0;
  margin-bottom: 0;
}

.register-base-legend {
  display: none;
}

.with-legend .register-base-legend {
  display: block;
}

</style>