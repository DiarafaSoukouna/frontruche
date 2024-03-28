<script>
// import { CountTo } from "vue3-count-to";
//import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
//import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from "axios";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
import Lottie from "@/components/widgets/lottie.vue";
//import simplebar from "simplebar-vue";
export default {
  data() {
    return {
      taskListModal: false,
      date3: null,
      niveauxLocalite: [], // Pour stocker les niveaux de localité de l'API
      activeTab: "Product", // Onglet actif par défaut
      localites: [], // Ajoutez une propriété pour stocker les localités
      localiteParent: [], // Ajoutez une propriété pour stocker les localités
      loading: false,
      loadings: true,

      niveauActif: null,
      niveauLocalite: null,
      parentLocalite: null,
      libelleParent: null,
      rangLocalite: null,
      rangeDateconfig: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
        mode: "range",
      },
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
      },
      timeConfig: {
        enableTime: false,
        dateFormat: "d M, Y",
      },
      newLocalite: {
        code_localite: "",
        parent_localite: "",
        code_localite_national: "",
        libelle_localite: "",
        code_couleur: "",
        abreviation_localite: "",
        longetude_localite: "",
        latitude_localite: "",
        homme_localite: "",
        femme_localite: "",
        jeune_localite: "",
        menage_localite: "",
        niveau_ugl_concerne: 1,
        idusrcreation: 2, // Exemple de valeur pour l'utilisateur qui ajoute la localité (à adapter selon votre logique)
        niveau_localite: "", // Exemple de niveau de localité (à adapter selon votre logique)
      },
      filterdate: null,
      filterdate1: null,
      filtervalue: "All",
      filtervalue1: "All",
      filtersearchQuery1: null,
      date: null,
      allTask: [],
      searchQuery: null,
      page: 1,
      perPage: 8,
      pages: [],
      defaultOptions: {
        animationData: animationData,
      },
      defaultOptions1: {
        animationData: animationData1,
      },

      //
      submitted: false,

      dataEdit: false,
      deleteModal: false,
      event: {
        _id: "",
        taskId: "",
        task: "",
        creater: "",
        dueDate: "",
        priority: "",
        project: "",
        subItem: [],
        status: "",
      },
      //
    };
  },
  components: {
    Layout,
    PageHeader,
    lottie: Lottie,
    // Multiselect,
    //flatPickr,
    //simplebar,
  },
  computed: {
    displayedPosts() {
      return this.paginate(this.allTask);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.localites.filter((localite) => {
          return (
            localite.code_localite.toLowerCase().includes(search) ||
            localite.libelle_localite.toLowerCase().includes(search)
          );
        });
      } else {
        return this.localites;
      }
    },


  },
  watch: {
    allTask() {
      this.setPages();
    },
  },
  created() {
    // Appel à setPages() et à la requête axios pour récupérer les niveaux de localité
    this.setPages();
    axios
      .get(
        "https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/niveauLocalite/getAllNiveauLocalite"
      )
      .then((response) => {
        // Une fois que les données ont été récupérées avec succès, les assigner à niveauxLocalite
        this.niveauxLocalite = response.data.data;
        console.log(this.niveauLocalite);

        // Initialiser niveauActif avec le libellé du premier enregistrement du niveau localité
        if (this.niveauxLocalite.length > 0) {
          this.niveauActif = this.niveauxLocalite[0].libelle_niv_localite;
          this.niveauLocalite = this.niveauxLocalite[0].id_niv_localite;
          this.parentLocalite = this.niveauxLocalite[0].parent_localite;
          this.fetchLocalites(this.niveauLocalite);
          console.log("libellé", this.niveauActif);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des niveaux de localité:", error);
      });
  },

  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
  beforeMount() {
    axios
      .get(
        "https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/localite/getAllLocalite"
      )
      .then((data) => {
        this.allTask = [];

        data.data.data.forEach((row) => {
          // row.image_src = `@/assets/images/products/img-8.png`;
          // row.image_src = 'https://api-node.themesbrand.website/fileupload/users_bucket/' + row.img;
          this.allTask.push(row);
        });
      })
      .catch((er) => {
        console.log(er);
      });
  },

  methods: {
    //
    handleSubmit() {
      let url = "http://ssise-cosit.com/api-ssise/localite/";
      let method = "";

      if (this.dataEdit) {
        // Si dataEdit est true, nous mettons à jour une localité existante
        url += "update";
        method = "POST";
      } else {
        // Sinon, nous ajoutons une nouvelle localité
        url += "insert";
        method = "POST";
      }

      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: "Êtes-vous sûr de vouloir enregistrer cette localité ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à l'enregistrement
        if (result.isConfirmed) {
          this.newLocalite.niveau_localite = this.niveauLocalite;
          // Envoyer les détails de la localité à votre API via une requête POST ou PUT
          axios({
            method: method,
            url: url,
            data: this.newLocalite,
          })
            .then((response) => {
              // Une fois que la localité a été ajoutée ou mise à jour avec succès
              // Accédez aux données de la réponse si nécessaire
              console.log("Réponse de la requête :", response.data);

              // Affichez un message de succès avec SweetAlert
              Swal.fire({
                title: "Localité enregistrée !",
                icon: "success",
                confirmButtonText: "OK",
              });

              // Réinitialiser les champs du formulaire
              this.resetNewLocalite();

              // Fermer le modal après avoir ajouté ou mis à jour la localité
              this.taskListModal = false;

              // Actualiser la liste des localités si nécessaire
              // (supposons que vous actualisez la liste après chaque modification)
              this.fetchLocalites(this.niveauLocalite);
            })
            .catch((error) => {
              // En cas d'erreur lors de l'ajout ou de la mise à jour de la localité, gérez l'erreur ici
              console.error("Erreur lors de l'enregistrement de la localité :", error);
            });
        }
      });
    },
    getParentLibelle(localite) {
      let libelles = []; // Initialiser un tableau pour stocker les libellés

      // Vérifier si la localité a un parent
      if (localite.parent_localite !== "") {
        let parent = this.findLocaliteById(localite.parent_localite);
        console.log("Parent initial :", parent); // Vérifier le parent initial
        while (parent) {
          console.log("Parent dans la boucle while :", parent); // Vérifier le parent à chaque itération
          libelles.unshift(parent.libelle_localite); // Ajouter le libellé du parent au début du tableau
          parent = this.findLocaliteById(parent.parent_localite); // Récupérer le parent du parent
          console.log("Nouveau parent après mise à jour :", parent); // Vérifier le nouveau parent après mise à jour
        }
      }

      libelles.push(localite.libelle_localite); // Ajouter le libellé de la localité actuelle à la fin du tableau
      console.log(libelles);
      return libelles; // Retourner le tableau de libellés
    },
    findLocaliteById(id) {
      this.foundLocalite;
      // Recherche de la localité par ID dans la liste des localités

      this.foundLocalite = this.allTask.find(
        (localite) => localite.id_localite === parseInt(id)
      );
      console.log("Localité trouvée :", this.foundLocalite); // Vérifier la localité trouvée
      return this.foundLocalite;
    },
    setActiveTab(tabName) {
      this.activeTab = tabName;
      this.niveauActif = tabName;
    },
    onSort(column) {
      this.direction = this.direction === "asc" ? "desc" : "asc";
      const sortedArray = [...this.allTask];
      sortedArray.sort((a, b) => {
        const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        return this.direction === "asc" ? res : -res;
      });
      this.allTask = sortedArray;
    },

    editDetails(data) {
      this.dataEdit = true;
      this.taskListModal = true;

      // Filtrer les propriétés indésirables de l'objet data
      const filteredData = { ...data };
      delete filteredData.created_at;
      delete filteredData.updated_at;

      // Remplir les champs du formulaire avec les détails de la localité sélectionnée
      this.newLocalite = { ...filteredData };

      this.submitted = false;
    },

    toggleModal() {
      this.resetNewLocalite();
      this.taskListModal = true;
      this.dataEdit = false;
      this.event = {};
      this.submitted = false;
    },

    resetNewLocalite() {
      this.newLocalite = {
        code_localite: "",
        parent_localite: "",
        code_localite_national: "",
        libelle_localite: "",
        code_couleur: "",
        abreviation_localite: "",
        longetude_localite: "",
        latitude_localite: "",
        homme_localite: "",
        femme_localite: "",
        jeune_localite: "",
        menage_localite: "",
        niveau_ugl_concerne: 1,
        idusrcreation: 2,
        niveau_localite: "",
      };
    },

    deleteModalToggle(data) {
      this.deleteModal = true;
      this.event._id = data._id;
    },

    deleteData() {
      if (this.event._id) {
        axios
          .delete(`https://api-node.themesbrand.website/apps/task/${this.event._id}`)
          .then((response) => {
            if (response.data.status === "success") {
              this.allTask = this.allTask.filter((item) => item._id != this.event._id);
            }
          })
          .catch((er) => {
            console.log(er);
          });

        this.deleteModal = false;
      }
    },
    //

    SearchData() {
      this.filterdate = this.filterdate1;
      this.filtervalue = this.filtervalue1;
    },

    deleteMultiple() {
      let ids_array = [];
      var items = document.getElementsByName("chk_child");
      items.forEach(function (ele) {
        if (ele.checked == true) {
          var trNode = ele.parentNode.parentNode.parentNode;
          var id = trNode.querySelector(".id a").innerHTML;
          ids_array.push(id);
        }
      });
      if (typeof ids_array !== "undefined" && ids_array.length > 0) {
        if (confirm("Are you sure you want to delete this?")) {
          var cusList = this.allTask;
          ids_array.forEach(function (id) {
            cusList = cusList.filter(function (allTask) {
              return allTask.taskId != id;
            });
          });
          this.allTask = cusList;
          document.getElementById("checkAll").checked = false;
          var itemss = document.getElementsByName("chk_child");
          itemss.forEach(function (ele) {
            if (ele.checked == true) {
              ele.checked = false;
              ele.closest("tr").classList.remove("table-active");
            }
          });
        } else {
          return false;
        }
      } else {
        Swal.fire({
          title: "Please select at least one checkbox",
          confirmButtonClass: "btn btn-info",
          buttonsStyling: false,
          showCloseButton: true,
        });
      }
    },

    setPages() {
      let numberOfPages = Math.ceil(this.allTask.length / this.perPage);
      this.pages = [];
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(allTask) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return allTask.slice(from, to);
    },

    getLibelleByRang(idNiveau) {
      const niveau = this.niveauxLocalite.find(
        (niveau) => niveau.rang_niveau === idNiveau
      );

      if (niveau) {
        return niveau.libelle_niv_localite;
      } else {
        return "Niveau non trouvé";
      }
    },

    fetchLocalites(idNiveau) {
      // Définir loading à true pour afficher l'indicateur de chargement
      this.loading = true;
      this.loadings = true;
      this.rang = 0;
      this.caractere;
      this.test;
      // Définir la couleur de chargement à jaune
      this.loadingClass = "loading-yellow";
      this.niveauLocalite = idNiveau;
      axios
        .post(
          "https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/niveauLocalite/getById",
          {
            id_niv_localite: idNiveau,
          }
        )
        .then((response) => {
          // Mettre à jour la liste des localités avec les données reçues
          this.loadings = false;
          this.niveauActif = response.data.data[0].libelle_niv_localite;
          this.parentLocalite = response.data.data[0].rang_niveau;
          this.rangLocalite = response.data.data[0].rang_niveau;
          this.caractere = response.data.data[0].nb_char_niv_localite;
          this.rang = this.rangLocalite - 1;
          this.localites = response.data.data[0].localites;

          this.test = this.niveauxLocalite.find(
            (niveau) => niveau.rang_niveau === this.rang
          );
          this.localiteParent = this.test.localites;
          this.libelleParent = this.test.libelle_niv_localite;

          console.log("parent1", this.parentLocalite);
          console.log("parent", this.localiteParent);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des localités:", error);
        })
        .finally(() => {
          // Après avoir obtenu les données ou en cas d'erreur, définir loading à false
          // pour masquer l'indicateur de chargement
          this.loading = false;
        });
    },
    deleteLocalite(id_localite) {
      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer cette localité ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à la suppression
        if (result.isConfirmed) {
          // Définir l'URL de la requête de suppression
          const url = "http://ssise-cosit.com/api-ssise/localite/delete";

          // Corps de la requête contenant l'ID de la localité à supprimer
          const requestBody = {
            id_localite: id_localite,
          };

          // Envoyer la requête DELETE à l'API
          axios
            .delete(url, { data: requestBody })
            .then(() => {
              // Afficher un message de succès avec SweetAlert
              Swal.fire({
                title: "Localité supprimée !",
                icon: "success",
                confirmButtonText: "OK",
              });

              // Actualiser la liste des localités après la suppression
              this.fetchLocalites(this.niveauLocalite);
            })
            .catch((error) => {
              // En cas d'erreur lors de la suppression de la localité, gérez l'erreur ici
              console.error("Erreur lors de la suppression de la localité :", error);
            });
        }
      });
    },
    validateCodeLocalite() {
      // Vérifiez la longueur de la saisie du code de la localité
      console.log(typeof this.caractere);
      if (this.newLocalite.code_localite.length < parseInt(this.caractere)) {
        console.log("non");
        this.codeLocaliteInvalid = true;
      } else {
        console.log("yes");
        this.codeLocaliteInvalid = false;
      }
      if (this.newLocalite.code_localite.length > parseInt(this.caractere)) {
        // Si la limite est dépassée, couper la saisie
        this.newLocalite.code_localite = this.newLocalite.code_localite.slice(
          0,
          parseInt(this.caractere)
        );
      }
    },
  },
  mounted() {
    var checkAll = document.getElementById("checkAll");
    if (checkAll) {
      checkAll.onclick = function () {
        var checkboxes = document.querySelectorAll(
          '.form-check-all input[type="checkbox"]'
        );

        if (checkAll.checked == true) {
          checkboxes.forEach(function (checkbox) {
            checkbox.checked = true;
            checkbox.closest("tr").classList.add("table-active");
            document.getElementById("remove-actions").style.display = "block";
          });
        } else {
          checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
            checkbox.closest("tr").classList.remove("table-active");
            document.getElementById("remove-actions").style.display = "none";
          });
        }
      };
    }

    var checkboxes = document.querySelectorAll("#tasksTable .form-check-input");
    Array.from(checkboxes).forEach(function (element) {
      element.addEventListener("change", function (event) {
        var checkedCount = document.querySelectorAll(
          "#tasksTable .form-check-input:checked"
        ).length;

        if (event.target.closest("tr").classList.contains("table-active")) {
          checkedCount > 0
            ? (document.getElementById("remove-actions").style.display = "block")
            : (document.getElementById("remove-actions").style.display = "none");
        } else {
          checkedCount > 0
            ? (document.getElementById("remove-actions").style.display = "block")
            : (document.getElementById("remove-actions").style.display = "none");
        }
      });
    });
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Localités" pageTitle="Paramétrages" />

    <BRow>
      <BCol lg="12">
        <BCard no-body id="tasksList">
          <BCardHeader class="border-0">
            <div class="d-flex justify-content-end">
              <div class="flex-shrink-0">
                <div class="d-flex flex-wrap gap-2">
                  <router-link :to="{ name: 'dashboard-niveau-localite' }">
                    <BButton style="background-color: #E88E00">
                      Niveau localité
                    </BButton>
                  </router-link>

                  <BButton style="background-color: #285e43" @click="toggleModal">
                    <i class="ri-add-line align-bottom me-1"></i> {{ $t("ajout") }}
                    {{ niveauActif }}
                  </BButton>
                </div>
              </div>
            </div>
          </BCardHeader>

          <BCardBody>
            <BTabs nav-class="mb-3">
              <BTab v-for="(niveau, index) in niveauxLocalite" :key="index" :title="niveau.libelle_niv_localite"
                :active="activeTab === niveau.libelle_niv_localite" @click="fetchLocalites(niveau.id_niv_localite)">
                <BCardBody class="border border-dashed border-end-0 border-start-0">
                  <b-form>
                    <BRow class="g-3">
                      <BCol xxl="5" sm="12">
                        <div class="search-box">
                          <input type="text" class="form-control search bg-light border-light"
                            placeholder="Search for tasks or something..." v-model="searchQuery" />
                          <i class="ri-search-line search-icon"></i>
                        </div>
                      </BCol>
                    </BRow>
                  </b-form>
                </BCardBody>
                <BCardBody>
                  <div class="text-center mt-sm-5 pt-4" v-if="loadings">
                    <button class="btn btn-outline-success btn-load">
                      <span class="d-flex align-items-center">
                        <span class="spinner-border flex-shrink-0" role="status">
                          <span class="visually-hidden">Chargement...</span>
                        </span>
                        <span class="flex-grow-1 ms-2"> Chargement... </span>
                      </span>
                    </button>
                  </div>
                  <div class="table-responsive table-card mb-4" v-if="!loadings">
                    <table class="table align-middle table-nowrap mb-0" id="tasksTable">
                      <thead class="table-light text-muted">
                        <tr>
                          <th class="sort" data-sort="id">Code</th>

                          <th v-for="(rang, index) in rangLocalite" :key="index" class="sort" data-sort="project_name">
                            {{ getLibelleByRang(rang) }}
                          </th>
                          <th class="sort" data-sort="id" v-if="rangLocalite == 1">
                            Abréviation
                          </th>
                          <th class="sort" data-sort="id" v-if="rangLocalite == 1">
                            Couleur
                          </th>
                          <th class="sort" data-sort="due_date">Actions</th>
                        </tr>
                      </thead>

                      <tbody class="list form-check-all">
                        <tr v-for="(localite, index) in localites" :key="index">
                          <!-- Remplacez 'localite.id_localite' par l'ID approprié -->
                          <td class="id">{{ localite.code_localite }}</td>
                          <!-- Remplacez 'localite.libelle_localite' par le nom ou libellé approprié -->
                          <td class="project_name" v-for="(libelle, index) in getParentLibelle(localite)" :key="index">
                            <template v-if="localite.parent_localite">
                              <span>{{ libelle }}</span>
                            </template>
                            <template v-else>
                              <span>{{ localite.libelle_localite }}</span>
                            </template>
                          </td>

                          <td class="id" v-if="rangLocalite == 1">
                            {{ localite.abreviation_localite }}
                          </td>
                          <td class="id" v-if="rangLocalite == 1"
                            :style="{ 'background-color': localite.code_couleur }">
                            {{ localite.code_couleur }}
                          </td>

                          <td class="due_date">
                            <!-- Ajoutez ici les actions nécessaires -->
                            <span @click="editDetails(localite)">
                              <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                            </span>
                            <span @click="deleteLocalite(localite.id_localite)">
                              <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="noresult" v-if="resultQuery.length < 1">
                      <div class="text-center">
                        <lottie colors="primary:#121331,secondary:#08a88a" :options="defaultOptions" :height="75"
                          :width="75" />
                        <h5 class="mt-2">Partenaire non trouvé</h5>
                        <p class="text-muted mb-0">
                          Le partenaire recherché n'a pas été retrouvé.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end" v-if="resultQuery.length >= 1">
                    <div class="pagination-wrap hstack gap-2">
                      <BLink class="page-item pagination-prev" href="#" :disabled="page <= 1" @click="page--">
                        Previous
                      </BLink>
                      <ul class="pagination listjs-pagination mb-0">
                        <li :class="{
                    active: pageNumber == page,
                    disabled: pageNumber == '...',
                  }" v-for="(pageNumber, index) in pages" :key="index" @click="page = pageNumber">
                          <BLink class="page" href="#" data-i="1" data-page="8">{{
                    pageNumber
                  }}</BLink>
                        </li>
                      </ul>
                      <BLink class="page-item pagination-next" href="#" :disabled="page >= pages.length"
                        @click="page++">
                        Next
                      </BLink>
                    </div>
                  </div>
                </BCardBody>
              </BTab>
            </BTabs>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- task list modal -->
    <BModal v-model="taskListModal" id="showmodal" modal-class="zoomIn" hide-footer
      header-class="p-3 bg-info-subtle taskModal" class="v-modal-custom" centered size="lg"
      :title="dataEdit ? 'Modifier localité' : 'Nouvelle localité'">
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <BRow class="g-3">
          <input type="hidden" id="id" name="" />
          <BCol lg="12">
            <label for="projectName-field" class="form-label">Code Localité</label>
            <input type="text" id="projectName" class="form-control" placeholder="Project name"
              v-model="newLocalite.code_localite" @input="validateCodeLocalite"
              :class="{ 'is-invalid': codeLocaliteInvalid }" />
            <div class="invalid-feedback" v-if="codeLocaliteInvalid">
              Le code de la localité doit avoir exactement {{ caractere }} caractères.
            </div>
          </BCol>
          <BCol lg="12">
            <div>
              <label for="tasksTitle-field" class="form-label">Nom </label>
              <input type="text" id="tasksTitle" class="form-control" placeholder="Title"
                v-model="newLocalite.libelle_localite" :class="{ 'is-invalid': submitted && !event.task }" />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>
          <BCol lg="12" v-if="parentLocalite != 1">
            <label for="createName-field" class="form-label">{{ libelleParent }}</label>
            <select class="form-select" v-model="newLocalite.parent_localite">
              <!-- Utilisation de v-for pour itérer sur les localités et afficher chaque option -->
              <option v-for="localite in localiteParent" :key="localite.id_localite" :value="localite.id_localite">
                {{ localite.libelle_localite }}
              </option>
            </select>
          </BCol>

          <BCol lg="12" v-if="parentLocalite == 1">
            <label for="createName-field" class="form-label">Abréviation</label>
            <input type="text" id="createName" class="form-control" placeholder="Client name"
              v-model="newLocalite.abreviation_localite" :class="{ 'is-invalid': submitted && !event.creater }" />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12" v-if="parentLocalite == 1">
            <label for="createName-field" class="form-label">Couleur</label>
            <input type="color" id="createName" class="form-control" placeholder="Client name"
              v-model="newLocalite.code_couleur" :class="{ 'is-invalid': submitted && !event.creater }" />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
        </BRow>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton type="button" variant="light" @click="taskListModal = false" id="closemodal">
            Fermer
          </BButton>
          <BButton type="submit" variant="success" id="add-btn" @click="handleSubmit">
            {{ dataEdit ? "Modifier" : "Enregistrer" }}
          </BButton>
        </div>
      </b-form>
    </BModal>

    <!-- delete modal -->
    <BModal v-model="deleteModal" modal-class="zoomIn" hide-footer no-close-on-backdrop centered>
      <div class="mt-2 text-center">
        <lottie class="avatar-xl" colors="primary:#f7b84b,secondary:#f06548" :options="defaultOptions1" :height="75"
          :width="75" />
        <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
          <h4>Are you sure ?</h4>
          <p class="text-muted mx-4 mb-0">
            Are you sure you want to remove this record ?
          </p>
        </div>
      </div>
      <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
        <button type="button" class="btn w-sm btn-light" @click="deleteModal = false">
          Close
        </button>
        <button type="button" class="btn w-sm btn-danger" id="delete-record" @click="deleteData">
          Yes, Delete It!
        </button>
      </div>
    </BModal>
  </Layout>
</template>
