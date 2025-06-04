<template>
  <div class="chapels-map">
    <img src="../assets/PLAN_ENDP_nb.jpg" />
    <div class="chapels-wrapper">
      <!-- Choeur (cercle) : 13 chapelles -->
      <ul class="chapels choeur">
        <li id="place_chapelle_endp_TWtc8LoL" @click="handleClick"></li>
        <li id="place_chapelle_endp_xmnangA2" @click="handleClick"></li>
        <li id="place_chapelle_endp_LMpAL5tS" @click="handleClick"></li>
        <li id="place_chapelle_endp_PSAxA3DP" @click="handleClick"></li>
        <li id="place_chapelle_endp_e3UyZC3H" @click="handleClick"></li>
        <li id="place_chapelle_endp_wDSkJ5p6" @click="handleClick"></li>
        <li id="place_chapelle_endp_hG4dN5wp" @click="handleClick"></li>
        <li id="place_chapelle_endp_a10VXGAa" @click="handleClick"></li>
        <li id="place_chapelle_endp_qY3efJPI" @click="handleClick"></li>
        <li id="place_chapelle_endp_x03bJRpB" @click="handleClick"></li>
        <li id="place_chapelle_endp_g1DVzjZy" @click="handleClick"></li>
        <li id="place_chapelle_endp_rFueHa72" @click="handleClick"></li>
        <li id="place_chapelle_endp_7inqDXDj" @click="handleClick"></li>
      </ul>
      <!-- Nord -->
      <ul class="chapels choeur-nord">
        <li id="place_chapelle_endp_SmQd80HP" @click="handleClick"></li>
        <li id=""></li>
        <li id="place_chapelle_endp_MICRWV6w" @click="handleClick"></li>
        <li id="place_chapelle_endp_2SEPiZkl" @click="handleClick"></li>
        <li id="place_chapelle_endp_jWlwQBBp" @click="handleClick"></li>
      </ul>
      <ul class="chapels nef-nord">
        <li id="place_chapelle_endp_HgZzrFUG" @click="handleClick"></li>
        <li id="place_chapelle_endp_7QCUUSnF" @click="handleClick"></li>
        <li id="place_chapelle_endp_rFUmppSZ" @click="handleClick"></li>
        <li id="place_chapelle_endp_bPt9xC79" @click="handleClick"></li>
        <li id=""></li>
        <li id="place_chapelle_endp_lMSzvBz2" @click="handleClick"></li>
        <li id="place_chapelle_endp_2rK0iGGN" @click="handleClick"></li>
      </ul>
      <!-- Sud -->
      <ul class="chapels choeur-sud">
        <li id="place_chapelle_endp_ShCl87Ly" @click="handleClick"></li>
        <li id="place_chapelle_endp_sceGkn9V" @click="handleClick"></li>
        <li id=""></li>
        <li id="place_chapelle_endp_jmwXUWLb" @click="handleClick"></li>
        <li id="place_chapelle_endp_q50GSp7g" @click="handleClick"></li>
      </ul>
      <ul class="chapels nef-sud">
        <li id="place_chapelle_endp_41uJwmOM" @click="handleClick"></li>
        <li id="place_chapelle_endp_UQyOelUy" @click="handleClick"></li>
        <li id="place_chapelle_endp_JMph1CUS" @click="handleClick"></li>
        <li id="place_chapelle_endp_zRelmASI" @click="handleClick"></li>
        <li id="place_chapelle_endp_ghGGCfRJ" @click="handleClick"></li>
        <li id="place_chapelle_endp_W0HhriG9" @click="handleClick"></li>
        <li id="place_chapelle_endp_PIHU8Wr2" @click="handleClick"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlaceChapelsMap",
  props: {
    place: {
      type: Object,
      required: false
    }
  },
  methods: {
    handleClick(event) {
      this.$router.push(`/places/${event.target.id}`);
    },
    activePlace(place, active = true) {
      if (place && place.id_endp) {
        const element = document.getElementById(place.id_endp);
        if (element) {
          active ? element.classList.add("active") : element.classList.remove("active");
        }
      }
    }
  },
  watch: {
    place: function(newPlace, oldPlace) {
      this.activePlace(oldPlace, false);
      this.activePlace(newPlace);
    }
  },
  mounted() {
    this.activePlace(this.place);
  },
};
</script>

<style scoped>

.chapels-map {
  position: relative;
  width: 100%;
  height: auto; /* image height */

  --map-left: 11%;
  --map-right: 80%;

  --chapel-width: 9%;

  --nef-top: 54%;
  --nef-height: 25%;

  --choeur-top: 24%;
  --choeur-height: 17.5%;

  --choeur-angle: 0.038turn; /* 180 / 13 chapelles */
}

.chapels-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

ul.chapels {
  position: absolute;
  top: 0;
  left: 0;

  margin: 0;
  padding: 0;
  list-style-type: none;
}

.chapels li {
  position: relative;
  display: block;
  /* background: rgba(255, 0, 0, 0.5); */
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.chapels li.active {
  pointer-events: none;
}

.chapels li.active::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 80px;
  height: 80px;
  background: url("@/assets/images/lieux_cible.svg") center / auto 80px no-repeat;
  transform: translate(-50%, -50%);
}


.chapels li a {
  display: block;
  width: 100%;
  height: 100%;
}

ul.chapels.choeur-nord,
ul.chapels.choeur-sud,
ul.chapels.nef-nord,
ul.chapels.nef-sud {
  width: var(--chapel-width);
  display: flex;
  flex-direction: column;
  gap: 2%;
}

.chapels.choeur-nord,
.chapels.choeur-sud {
  height: var(--choeur-height);
}

.chapels.nef-nord,
.chapels.nef-sud {
  height: var(--nef-height);
}

.chapels.nef-nord {
  top: var(--nef-top);
  left: var(--map-left);
}

.chapels.choeur-nord {
  top: var(--choeur-top);
  left: var(--map-left);
}

.chapels.nef-sud {
  top: var(--nef-top);
  left: var(--map-right);
}

.chapels.choeur-sud {
  top: var(--choeur-top);
  left: var(--map-right);
}

.chapels.choeur li {
  width: 100%;
}

.chapels.nef-sud li,
.chapels.nef-nord li {
  width: 100%;
  height: 14.2%; /* 1 septième */
}

.chapels.choeur-sud li,
.chapels.choeur-nord li {
  width: 100%;
  height: 20%; /* 1 cinquième */
}


/* Chapelles positionnées sur un cercle */

/* Centre du cercle */
ul.chapels.choeur {
  left: 11%;
  top: 7%;
  width: 78%;
  aspect-ratio: 1;
  background: rgba(0, 255, 0, 0);
}

.chapels.choeur > li {
  position: absolute;
  width: 13%;
  height: 10%;
  left: 50%;
  top: 50%;
  transform-origin: 50% 50%;
}

.chapels.choeur > li:nth-child(1) {
  left: calc(50% - 50% * sin(1 * 0.8 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(1 * 0.8 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-10%) rotate(10deg);
}

.chapels.choeur > li:nth-child(2) {
  left: calc(50% - 50% * sin(2 * 0.85 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(2 * 0.85 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(23deg); /* + 13deg */
}

.chapels.choeur > li:nth-child(3) {
  left: calc(50% - 50% * sin(3 * 0.9 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(3 * 0.9 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(36deg);
}

.chapels.choeur > li:nth-child(4) {
  left: calc(50% - 50% * sin(4 * 0.9 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(4 * 0.9 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(49deg);
}

.chapels.choeur > li:nth-child(5) {
  left: calc(50% - 50% * sin(5 * 0.9 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(5 * 0.9 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(62deg);
}

.chapels.choeur > li:nth-child(6) {
  left: calc(50% - 50% * sin(6 * 0.9 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(6 * 0.9 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(75deg);
}

.chapels.choeur > li:nth-child(7) {
  left: calc(50% - 50% * sin(7 * 0.9 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(7 * 0.9 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(88deg);
}

.chapels.choeur > li:nth-child(8) {
  left: calc(50% - 50% * sin(8 * 0.9 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(8 * 0.9 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(101deg);
}

.chapels.choeur > li:nth-child(9) {
  left: calc(50% - 50% * sin(9 * 0.92 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(9 * 0.92 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-30%) rotate(117deg);
}

.chapels.choeur > li:nth-child(10) {
  left: calc(50% - 50% * sin(10 * 0.93 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(10 * 0.93 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-45%) rotate(135deg);
}

.chapels.choeur > li:nth-child(11) {
  left: calc(50% - 50% * sin(11 * 0.94 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(11 * 0.94 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-60%) rotate(145deg);
}

.chapels.choeur > li:nth-child(12) {
  left: calc(50% - 50% * sin(12 * 0.95 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(12 * 0.95 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-75%) rotate(165deg);
}

.chapels.choeur > li:nth-child(13) {
  left: calc(50% - 50% * sin(13 * 0.95 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 50% * cos(13 * 0.95 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-85%) rotate(174deg);
}



@media screen and (max-width: 1024px) {
}
</style>
