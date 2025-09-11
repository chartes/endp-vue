<template>
  <div class="chapels-map">
    <img src="../assets/PLAN_ENDP_nb.jpg" />
    <div class="chapels-wrapper" @click.capture="handleClick" @mouseenter.capture="handleMouseHover" @mouseout.capture="handleMouseOut">
      <!-- Choeur (cercle) : 13 chapelles -->
      <ul class="chapels choeur">
        <li id="place_chapelle_endp_TWtc8LoL" data-name="saint Michel"></li>
        <li id="place_chapelle_endp_xmnangA2" data-name="saints Martin et Anne"></li>
        <li id="place_chapelle_endp_LMpAL5tS" data-name="sainte Foy"></li>
        <li id="place_chapelle_endp_PSAxA3DP" data-name="saint Eutrope"></li>
        <li id="place_chapelle_endp_e3UyZC3H" data-name="saint Jean Baptiste"></li>
        <li id="place_chapelle_endp_wDSkJ5p6" data-name="saint Louis"></li>
        <li id="place_chapelle_endp_hG4dN5wp" data-name="saint Rigobert"></li>
        <li id="place_chapelle_endp_a10VXGAa" data-name="saint Nicaise"></li>
        <li id="place_chapelle_endp_qY3efJPI" data-name="saint Etienne Protomartyr"></li>
        <li id="place_chapelle_endp_x03bJRpB" data-name="saints Crépin et Crépinien"></li>
        <li id="place_chapelle_endp_g1DVzjZy" data-name="saint Jacques"></li>
        <li id="place_chapelle_endp_rFueHa72" data-name="saints Pierre et Etienne"></li>
        <li id="place_chapelle_endp_7inqDXDj" data-name="saint Rémi"></li>
      </ul>
      <!-- Nord -->
      <ul class="chapels choeur-nord">
        <li id="place_chapelle_endp_SmQd80HP" data-name="saints Ferréol et Ferrucien"></li>
        <li id="place_chapelle_endp_MICRWV6w" data-name="saints Jean Baptiste et Marie Madeleine"></li>
        <li id=""></li>
        <li id="place_chapelle_endp_2SEPiZkl" data-name="saints Jean Baptiste et Marie Madeleine"></li>
        <li id="place_chapelle_endp_jWlwQBBp" data-name="saints Jean l'Evangéliste et Agnès"></li>
      </ul>
      <ul class="chapels nef-nord">
        <li id="place_chapelle_endp_HgZzrFUG" data-name="bienheureux Nicolas"></li>
        <li id="place_chapelle_endp_7QCUUSnF" data-name="bienheureuse Catherine"></li>
        <li id="place_chapelle_endp_rFUmppSZ" data-name="saints Julien le Pauvre et Marie l'Egyptienne"></li>
        <li id="place_chapelle_endp_bPt9xC79" data-name="saint Laurent"></li>
        <li id="place_chapelle_endp_KmzrjcsB" data-name="sainte Geneviève"></li>
        <li id="place_chapelle_endp_lMSzvBz2" data-name="saints Georges et Blaise"></li>
        <li id="place_chapelle_endp_2rK0iGGN" data-name="saint Léonard"></li>
      </ul>
      <!-- Sud -->
      <ul class="chapels choeur-sud">
        <li id="place_chapelle_endp_ShCl87Ly" data-name="saint Géraud"></li>
        <li id="place_chapelle_endp_sceGkn9V" data-name="saints Denis et Georges"></li>
        <li id=""></li>
        <li id="place_chapelle_endp_jmwXUWLb" data-name="saint Pierre Martyr"></li>
        <li id="place_chapelle_endp_q50GSp7g" data-name="saints Pierre et Paul"></li>
      </ul>
      <ul class="chapels nef-sud">
        <li id="place_chapelle_endp_41uJwmOM" data-name="bienheureuse Marie Madeleine"></li>
        <li id="place_chapelle_endp_UQyOelUy" data-name="bienheureux Augustin"></li>
        <li id="place_chapelle_endp_JMph1CUS" data-name="saint Thomas de Canterbury"></li>
        <li id="place_chapelle_endp_zRelmASI" data-name="saints Michel et Antoine"></li>
        <li id="place_chapelle_endp_ghGGCfRJ" data-name="saints Philippe et Jacques"></li>
        <li id="place_chapelle_endp_W0HhriG9" data-name="saints Barthélémy et Vincent"></li>
        <li id="place_chapelle_endp_PIHU8Wr2" data-name="sainte Anne"></li>
      </ul>
    </div>
    <div ref="popover" class="popover" :style="{ left: this.popOverLeft, top: this.popOverTop, transform: this.popOverTransform }">{{ popOverTitle }}</div>
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
  data() {
    return {
      hover: null,
      popOverTitle: "",
      popOverLeft: 0,
      popOverTop: 0,
      popOverTransform: "none"
    };
  },
  methods: {
    handleClick(event) {
      if (event.target.id) {
        this.$router.push(`/places/${event.target.id}`);
      }
    },
    handleMouseHover(event) {
      const target = event.target;
      if (target.id && target.id.length) {
        const dataName =target.attributes["data-name"];
        if (dataName !== undefined) {
          // Wrapper :
          const referenceRect = event.currentTarget.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const isOnRightSide = (targetRect.left - referenceRect.left) > 0.5 * (referenceRect.right - referenceRect.left);

          this.popOverTitle = dataName.value;
          this.popOverLeft = (targetRect.left - referenceRect.left) + "px";
          this.popOverTop = (targetRect.bottom - referenceRect.top) + "px";
          this.popOverTransform = isOnRightSide ? "translateX(-100%)" : "translateX(" + targetRect.width + "px)";
        }
      }
    },
    handleMouseOut() {
      this.popOverTitle = "";
    },
    activePlace(place, active = true) {
  if (place && place.id_endp) {
    const element = document.getElementById(place.id_endp);
    if (element) {
      if (active) {
        // Supprime la classe si elle est déjà là
        element.classList.remove("active");
        void element.offsetWidth; // Force reflow pour réinitialiser l'animation
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
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
  beforeUnmount() {
    // remove active class from previous place
    this.activePlace(this.place, false);
    // reset popover
    this.popOverTitle = "";
  },
  mounted() {
    this.activePlace(this.place);
    console.log(this.$refs.popover)
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

.popover:empty {
  display: none;
}

.popover {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--panel-bg-color);
  padding: 20px;
  box-shadow: 4px 4px 3px 0 rgba(0,0,0,0.15);
  font-size: 1.25em;
  font-weight: 400;
  font-style: italic;
  color: #7B0C12;
  white-space: nowrap;
  pointer-events: none;
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

.chapels li[id=""] {
  cursor: default
}

.chapels li:hover {
  background: rgba(123,12,18, 0.15)
}

.chapels li[id=""]:hover {
  opacity: 0;
}

.chapels li.active::before {
  content: "";
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 80px;
  height: 80px;
  background: url("@/assets/images/lieux_cible.svg") center / auto 80px no-repeat;
  transform: translate(-50%, -50%);
  pointer-events: none;

  animation: zoomInOut 0.6s infinite;
  will-change: transform;
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
  left: calc(50% - 49% * sin(8 * 0.9 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 49% * cos(8 * 0.9 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-20%) rotate(101deg);
}

.chapels.choeur > li:nth-child(9) {
  width: 12%;
  left: calc(50% - 48% * sin(9 * 0.92 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 48% * cos(9 * 0.92 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-30%) rotate(117deg);
}

.chapels.choeur > li:nth-child(10) {
  left: calc(50% - 48% * sin(10 * 0.93 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 48% * cos(10 * 0.93 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-45%) rotate(135deg);
}

.chapels.choeur > li:nth-child(11) {
  left: calc(50% - 49% * sin(11 * 0.94 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 49% * cos(11 * 0.94 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-60%) rotate(145deg);
}

.chapels.choeur > li:nth-child(12) {
  width: 12%;
  left: calc(50% - 49% * sin(12 * 0.95 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 49% * cos(12 * 0.95 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-75%) rotate(165deg);
}

.chapels.choeur > li:nth-child(13) {
  width: 12%;
  left: calc(50% - 49% * sin(13 * 0.95 * var(--choeur-angle) + 0.25turn));
  top: calc(50% + 49% * cos(13 * 0.95 * var(--choeur-angle) + 0.25turn));
  transform: translateX(-85%) rotate(174deg);
}



@media screen and (max-width: 640px) {

  .popover {
    display: none !important;
  }

}

@keyframes zoomInOut {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
