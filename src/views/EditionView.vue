<template>
  <div>
    <registre-metadata />
  </div>

  <registre-document />
</template>

<script>
import RegistreMetadata from "@/components/RegistreMetadata.vue";
import RegistreDocument from "@/components/RegistreDocument.vue";
export default {
  name: "EditionView",
  components: {
    RegistreDocument,
    RegistreMetadata
  },
}
</script>

<style scoped>

</style>