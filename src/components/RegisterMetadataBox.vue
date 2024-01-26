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
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}
</style>