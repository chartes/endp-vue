<template>
  <div class="container container-not-found-global">
    <div class="column">
      <h1 class="title-not-found">❦ 404 - Page introuvable ❦</h1>
      <div class="container-not-found-description">
        <p class="description-not-found">La page que vous cherchez n'existe pas.</p>
        <p class="description-not-found">☞ Ciquer
          <router-link to="/">ici</router-link> pour retourner à la page d'accueil.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage"
}
</script>

<style scoped>
.container-not-found-global {
  position: relative;
}

.container-not-found-global::before {
  content: "";
  background-image: url("@/assets/images/splash-screen.jpg");
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.93;
}

.column {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 60px;
  border-radius: 5px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  position: relative;
}

.title-not-found {
  font-size: 36px;
  font-weight: 700;
  color: var(--dark-grey);
  border-bottom: solid 1px #979797;
}

.container-not-found-description {
  margin-top: 20px;
}

.description-not-found {
  font-size: 20px;
  color: var(--dark-grey);
}

a {
  color: var(--dark-grey);
  text-decoration: underline;
}

a:hover {
  color: var(--light-brown);
}
</style>
