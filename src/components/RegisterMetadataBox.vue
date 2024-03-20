<template>
  <div class="box box-results-metadata">
    <RegisterBaseTotalDisplay
        :total-registers="totalOfRegisters"
    />
    <RegisterBaseLegend/>
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
</style>