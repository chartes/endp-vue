<template>
  <footer class="footer is-flex-align-items-flex-end mt-auto">
    <h1 class="footer-title">e-NDP Notre-Dame de Paris et son cloître :
      les lieux, les gens, la vie (1326-1504)</h1>
    <span class="footer-description">Développée par la Mission projets numériques de l'École nationale des chartes en collaboration avec le Laboratoire de médiévistique occidentale de Paris (UMR 8589/ CNRS-Paris 1), les Archives nationales, la BnF et la bibliothèque Mazarine.</span>
    <br>
    <p class="footer-links">
      .
      <span class="link-border-dotted">
        <a href="#">Mentions Légales</a> <!-- /termsofservice -->
      </span>
      .
      <span class="link-border-dotted">
        <a href="#">Licence CC-BY-SA 4.0</a>
      </span>
      .
    </p>
  </footer>
</template>

<script>
export default {
  name: "AppFooter"
}
</script>

<style scoped>
footer {
  background-color: #f5f5f5;
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  height: 60px;
  align-items: flex-start;
  justify-content: center;
}

.footer-description {
  font-size: 10pt;
  font-weight: 400;
}

.footer-links {
  font-size: 10pt;
  font-weight: 400;
}

.link-border-dotted {
    border-bottom: dotted 1px;
}
</style>