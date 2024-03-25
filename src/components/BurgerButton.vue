<template>
  <div class="hamburger">
    <span></span>
  </div>
</template>

<script>
export default {
  name: "BurgerButton"
}
</script>

<style scoped>


/* Header :animation Hamburger */

.hamburger {
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 32px;
  height: 32px;
  font-size: 0;
  text-indent: -9999px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-shadow: none;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.hamburger:focus {
  outline: none;
}

.hamburger:hover span::before,
.hamburger:hover span::after,
.hamburger:hover span {
}

.hamburger span {
  display: block;
  position: absolute;
  top: 11px;
  left: 0;
  right: 0;
  height: 3px;
  background: #FFF;
}

.hamburger span::before,
.hamburger span::after {
  position: absolute;
  display: block;
  left: 0;
  width: 100%;
  height: 3px;
  background: #FFF;
  content: "";
}

.hamburger span::before {
  top: -11px;
}

.hamburger span::after {
  bottom: -11px;
}

.hamburger span {
  transition: background 0s 0.3s;
}

.hamburger span::before,
.hamburger span::after {
  transition-duration: 0.3s, 0.3s;
  transition-delay: 0.3s, 0s;
}

.hamburger span::before {
  transition-property: top, transform;
}

.hamburger span::after {
  transition-property: bottom, transform;
}

.hamburger.is-opened span {
  background: none;
}

.hamburger.is-opened span::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger.is-opened span::after {
  bottom: 0;
  transform: rotate(-45deg);
}

.hamburger.is-opened span::before,
.hamburger.is-opened span::after {
  transition-delay: 0s, 0.3s;
}

</style>