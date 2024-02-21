<template>
    <div class="card">
      <header class="card-header" @click="toggleContent(person, $event)">
        <div class="card-header-title">
          <span class="canon-icon" v-if="person.is_canon"></span>
          <span class="secular-people-icon" v-else></span>
          <span style="text-align: center; flex-grow: 1; display: flex">{{ person.pref_label }}</span>
        </div>
        <a class="toggle-btn" :class="{ 'is-opened': person.isOpened }"></a>
      </header>
      <div class="card-content" v-if="person.isOpened">
        <div class="content">
          <div class="columns is-multiline">
            <div class="column is-7 block has-text-left">
              <p><b>Prénom(s) - <i>Nomen</i></b> : {{ person.forename_alt_labels }}</p>
              <p><b>Nom(s) - <i>Cognomen</i></b> : {{ person.surname_alt_labels }}</p>
              <p><b>Dates extrêmes d'apparition dans les registres</b> :
                {{ person.first_mention_date ? person.first_mention_date : "Non renseigné" }} -
                {{ person.last_mention_date ? person.last_mention_date : "Non renseigné" }}</p>
              <p>
                <router-link class="button  btn-person-data-link" :to="`/persons/${person._id_endp}`">
                          <span class="icon is-small">
                            <i class="fas fa-external-link-alt"></i>
                          </span>
                  <span>Accéder à la fiche</span>
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "PersonResultCard",
  props: {
    person: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggleContent(person, event) {
      person.isOpened = !person.isOpened;
      event.preventDefault();
    }
  }
}
</script>

<style scoped>
.canon-icon {
  background: url(@/assets/icons/canon-icon.svg) center / cover no-repeat;
  height: 70px;
  width: 70px;
}

.secular-people-icon {
  background: url(@/assets/icons/secular-people-1.png) center / cover no-repeat;
  height: 50px;
  width: 50px;
  margin-right: 15px;
  margin-left: 10px;
}

.card-header-title {
  height: 100px
}

.btn-person-data-link {
  margin-top: 1rem;
  color: #8d1919;
}

.btn-person-data-link:hover {
  background: #8d1919;
  color: #fff;
}

.toggle-btn {
  background: url('~@/assets/icons/chevron_rouge.svg') center / cover no-repeat;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  width: 27px;
  height: 27px;
  margin: 2rem 2rem auto auto;

}

.toggle-btn.is-opened {
  width: 27px;
  background: url('~@/assets/icons/croix.svg') center / cover no-repeat;
}

</style>