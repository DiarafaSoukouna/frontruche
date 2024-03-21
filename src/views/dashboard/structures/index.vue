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
      structures: [], // Pour stocker les niveaux de localité de l'API
      activeTab: "Product", // Onglet actif par défaut
      localites: [], // Ajoutez une propriété pour stocker les localités
      localiteParent: [], // Ajoutez une propriété pour stocker les localités
      loading: false,
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
      newstructures: {
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
        return this.displayedPosts.filter((data) => {
          return (
            data.id_sg.toLowerCase().includes(search) ||
            data.Sigle_sg.toLowerCase().includes(search) ||
            data.SigleSysteme_sg.toLowerCase().includes(search) ||
            data.creater.toLowerCase().includes(search) ||
            data.dueDate.toLowerCase().includes(search) ||
            data.status.toLowerCase().includes(search) ||
            data.priority.toLowerCase().includes(search)
          );
        });
      } else if (this.filterdate !== null) {
        if (this.filterdate !== null) {
          var date1 = this.filterdate.split(" to ")[0];
          var date2 = this.filterdate.split(" to ")[1];
        }
        return this.displayedPosts.filter((data) => {
          if (
            new Date(data.dueDate.slice(0, 12)) >= new Date(date1) &&
            new Date(data.dueDate.slice(0, 12)) <= new Date(date2)
          ) {
            return data;
          } else {
            return null;
          }
        });
      } else if (this.filtervalue !== null) {
        return this.displayedPosts.filter((data) => {
          if (data.status === this.filtervalue || this.filtervalue == "All") {
            return data;
          } else {
            return null;
          }
        });
      } else {
        return this.displayedPosts;
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
        "https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/structureGenerale/getAllStructureGenerale"
      )
      .then((response) => {
        // Une fois que les données ont été récupérées avec succès, les assigner à structures
        this.structures = response.data.data;
        console.log("structure", this.structures);
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
      let url = "http://ssise-cosit.com/api-ssise/structureGenerale/";
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
          // this.newstructures.niveau_localite = this.niveauLocalite;
          // Envoyer les détails de la localité à votre API via une requête POST ou PUT
          axios({
            method: method,
            url: url,
            data: this.newstructures,
          })
            .then((response) => {
              // Une fois que la localité a été ajoutée ou mise à jour avec succès
              // Accédez aux données de la réponse si nécessaire
              console.log("Réponse de la requête :", response.data);

              // Affichez un message de succès avec SweetAlert
              Swal.fire({
                title: "Structures enregistrée !",
                icon: "success",
                confirmButtonText: "OK",
              });

              // Réinitialiser les champs du formulaire
              this.resetnewstructures();

              // Fermer le modal après avoir ajouté ou mis à jour la localité
              this.taskListModal = false;

              this.mounted();
              // Actualiser la liste des localités si nécessaire
              // (supposons que vous actualisez la liste après chaque modification)
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
      this.newstructures = { ...filteredData };

      this.submitted = false;
    },

    toggleModal() {
      this.resetnewstructures();
      this.taskListModal = true;
      this.dataEdit = false;
      this.event = {};
      this.submitted = false;
    },

    resetnewstructures() {
      this.newstructures = {
        Sigle_sg: "",
        Nom_sg: "",
        SigleSysteme_sg: "",
        NomSysteme_sg: "",
        DescriptionSysteme_sg: "",
        SloganSysteme_sg: "",
        Adresse_sg: "",
        Email_sg: "",
        Telephone_sg: "",
        WhattApp_sg: "",
        NomPremierResponsable_sg: "",
        FonctionPremierResponsable_sg: "",
        EmailPremierResponsable_sg: "",
        CodeNiveau_sg: "",
        Localite_sg: "",
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
      const niveau = this.structures.find((niveau) => niveau.rang_niveau === idNiveau);

      if (niveau) {
        return niveau.libelle_niv_localite;
      } else {
        return "Niveau non trouvé";
      }
    },

    getStructures() {
      // Définir loading à true pour afficher l'indicateur de chargement
      this.loading = true;
      this.rang = 0;
      this.caractere;
      this.test;
      // Définir la couleur de chargement à jaune
      this.loadingClass = "loading-yellow";

      axios
        .get("https://ssise-cosit.com/structureGenerale/getAllStructureGenerale")
        .then((response) => {
          // Mettre à jour les structures générales avec les données reçues
          const data = response.data;
          console.log("status: " + data);
          // Vous pouvez effectuer le traitement nécessaire sur les données reçues ici
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des structures générales:",
            error
          );
        })
        .finally(() => {
          // Après avoir obtenu les données ou en cas d'erreur, définir loading à false
          // pour masquer l'indicateur de chargement
          this.loading = false;
        });
    },

    deleteStructure(id_sg) {
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
          const url = "http://ssise-cosit.com/api-ssise/structureGenerale/delete";

          // Corps de la requête contenant l'ID de la localité à supprimer
          const requestBody = {
            id_sg: id_sg,
          };

          // Envoyer la requête DELETE à l'API
          axios
            .delete(url, { data: requestBody })
            .then(() => {
              // Afficher un message de succès avec SweetAlert
              Swal.fire({
                title: "Structure supprimée !",
                icon: "success",
                confirmButtonText: "OK",
              });

              // Actualiser la liste des localités après la suppression
              this.mounted();
            })
            .catch((error) => {
              // En cas d'erreur lors de la suppression de la localité, gérez l'erreur ici
              console.error("Erreur lors de la suppression de la structures :", error);
            });
        }
      });
    },
    validateCodeLocalite() {
      // Vérifiez la longueur de la saisie du code de la localité
      console.log(typeof this.caractere);
      if (this.newstructures.code_localite.length < parseInt(this.caractere)) {
        console.log("non");
        this.codeLocaliteInvalid = true;
      } else {
        console.log("yes");
        this.codeLocaliteInvalid = false;
      }
      if (this.newstructures.code_localite.length > parseInt(this.caractere)) {
        // Si la limite est dépassée, couper la saisie
        this.newstructures.code_localite = this.newstructures.code_localite.slice(
          0,
          parseInt(this.caractere)
        );
      }
    },
  },
  mounted() {
    // this.getStructures();
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
    <PageHeader title="Structures Générales" pageTitle="Paramétrages" />
    <br>
    <br>
    <BCol xxl="12">
      <BCard no-body class="mt-xxl-n5">
        <BCardBody class="p-4 pt-2">
          <BTabs nav-class="nav-tabs-custom rounded border-bottom-0">
            <BTab class="nav-item" title="Personal Details" active>
              <form action="javascript:void(0);">
                <BRow class="pt-4">
                  <BCol lg="6">
                    <div class="mb-3">
                      <label for="firstnameInput" class="form-label">First Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="firstnameInput"
                        placeholder="Enter your firstname"
                        value="Dave"
                      />
                    </div>
                  </BCol>
                  <BCol lg="6">
                    <div class="mb-3">
                      <label for="lastnameInput" class="form-label">Last Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="lastnameInput"
                        placeholder="Enter your lastname"
                        value="Adame"
                      />
                    </div>
                  </BCol>
                  <BCol lg="6">
                    <div class="mb-3">
                      <label for="phonenumberInput" class="form-label"
                        >Phone Number</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="phonenumberInput"
                        placeholder="Enter your phone number"
                        value="+(1) 987 6543"
                      />
                    </div>
                  </BCol>
                  <BCol lg="6">
                    <div class="mb-3">
                      <label for="emailInput" class="form-label">Email Address</label>
                      <input
                        type="email"
                        class="form-control"
                        id="emailInput"
                        placeholder="Enter your email"
                        value="daveadame@velzon.com"
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="mb-3">
                      <label for="JoiningdatInput" class="form-label">Joining Date</label>

                      <flat-pickr
                        v-model="date"
                        id="dateinput"
                        class="form-control"
                      ></flat-pickr>
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="mb-3">
                      <label for="skillsInput" class="form-label">Skills</label>
                      <Multiselect
                        v-model="value"
                        id="skillsinput"
                        mode="tags"
                        :close-on-select="false"
                        :searchable="true"
                        :create-option="true"
                        :options="[
                          { value: 'illustrator', label: 'Illustrator' },
                          { value: 'photoshop', label: 'Photoshop' },
                          { value: 'css', label: 'CSS' },
                          { value: 'html', label: 'HTML' },
                          { value: 'javascript', label: 'Javascript' },
                          { value: 'python', label: 'Python' },
                          { value: 'php', label: 'PHP' },
                        ]"
                      />
                    </div>
                  </BCol>
                  <BCol lg="6">
                    <div class="mb-3">
                      <label for="designationInput" class="form-label">Designation</label>
                      <input
                        type="text"
                        class="form-control"
                        id="designationInput"
                        placeholder="Designation"
                        value="Lead Designer / Developer"
                      />
                    </div>
                  </BCol>
                  <BCol lg="6">
                    <div class="mb-3">
                      <label for="websiteInput1" class="form-label">Website</label>
                      <input
                        type="text"
                        class="form-control"
                        id="websiteInput1"
                        placeholder="www.example.com"
                        value="www.velzon.com"
                      />
                    </div>
                  </BCol>
                  <BCol lg="4">
                    <div class="mb-3">
                      <label for="cityInput" class="form-label">City</label>
                      <input
                        type="text"
                        class="form-control"
                        id="cityInput"
                        placeholder="City"
                        value="California"
                      />
                    </div>
                  </BCol>
                  <BCol lg="4">
                    <div class="mb-3">
                      <label for="countryInput" class="form-label">Country</label>
                      <input
                        type="text"
                        class="form-control"
                        id="countryInput"
                        placeholder="Country"
                        value="United States"
                      />
                    </div>
                  </BCol>
                  <BCol lg="4">
                    <div class="mb-3">
                      <label for="zipcodeInput" class="form-label">Zip Code</label>
                      <input
                        type="text"
                        class="form-control"
                        minlength="5"
                        maxlength="6"
                        id="zipcodeInput"
                        placeholder="Enter zipcode"
                        value="90011"
                      />
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="mb-3 pb-2">
                      <label for="exampleFormControlTextarea" class="form-label"
                        >Description</label
                      >
                      <textarea
                        class="form-control"
                        id="exampleFormControlTextarea"
                        placeholder="Enter your description"
                        rows="3"
                      >
Hi I'm Anna Adame,It will be as simple as Occidental; in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is European languages are members of the same family.</textarea
                      >
                    </div>
                  </BCol>
                  <BCol lg="12">
                    <div class="hstack gap-2 justify-content-end">
                      <BButton type="submit" variant="primary" @click="updatedata">
                        Updates
                      </BButton>
                      <BButton type="button" variant="soft-success"> Cancel </BButton>
                    </div>
                  </BCol>
                </BRow>
              </form>
            </BTab>
          </BTabs>
        </BCardBody>
      </BCard>
    </BCol>
    <!-- <BRow>
      <BCol lg="12">
        <BCard no-body id="tasksList">
          <BCardHeader class="border-0">
            <div class="d-flex align-items-center">
              <h5 class="card-title mb-0 flex-grow-1">All Tasks</h5>
              <div class="flex-shrink-0">
                <div class="d-flex flex-wrap gap-2">
                  <BButton
                    variant="secondary"
                    class="me-1"
                    id="remove-actions"
                    @click="deleteMultiple"
                  >
                    <i class="ri-delete-bin-2-line"></i>
                  </BButton>

                  <BButton variant="warning" class="add-btn" @click="toggleModal">
                    <i class="ri-add-line align-bottom me-1"></i>
                    {{ $t("ajout") }} structure
                  </BButton>
                </div>
              </div>
            </div>
          </BCardHeader>

          <BCardBody>
            <BCardBody class="border border-dashed border-end-0 border-start-0">
              <b-form>
                <BRow class="g-3">
                  <BCol xxl="5" sm="12">
                    <div class="search-box">
                      <input
                        type="text"
                        class="form-control search bg-light border-light"
                        placeholder="Search for tasks or something..."
                        v-model="searchQuery"
                      />
                      <i class="ri-search-line search-icon"></i>
                    </div>
                  </BCol>
                </BRow>
              </b-form>
            </BCardBody>
            <BCardBody>
              <div class="table-responsive table-card mb-4">
                <table class="table align-middle table-nowrap mb-0" id="tasksTable">
                  <thead class="table-light text-muted">
                    <tr>
                      <th class="sort" data-sort="id">Sigle</th>

                      <th class="sort" data-sort="id">Nom</th>
                      <th class="sort" data-sort="id">Sigle du système</th>
                      <th class="sort" data-sort="id">Nom du système</th>
                      <th class="sort" data-sort="id">Description du système</th>
                      <th class="sort" data-sort="id">Slogan du système</th>
                      <th class="sort" data-sort="id">Logo du système</th>
                      <th class="sort" data-sort="id">Adresse du système</th>
                      <th class="sort" data-sort="id">Email</th>
                      <th class="sort" data-sort="id">Telephone</th>
                      <th class="sort" data-sort="id">WhatsApp</th>
                      <th class="sort" data-sort="id">Nom du Responsable</th>
                      <th class="sort" data-sort="id">Fonction du Responsable</th>
                      <th class="sort" data-sort="id">Email du Responsable</th>
                      <th class="sort" data-sort="id">Code du Niveau</th>
                      <th class="sort" data-sort="id">Localité</th>
                      <th class="sort" data-sort="due_date">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="list form-check-all">
                    <tr v-for="(structures, index) in structures" :key="index">
                      <!- Remplacez 'localite.id_localite' par l'ID approprié ->
                      <td class="id">{{ structures.Sigle_sg }}</td>
                      <td class="id">{{ structures.Nom_sg }}</td>
                      <td class="id">{{ structures.SigleSysteme_sg }}</td>
                      <td class="id">{{ structures.NomSysteme_sg }}</td>
                      <td class="id">{{ structures.DescriptionSysteme_sg }}</td>
                      <td class="id">{{ structures.SloganSysteme_sg }}</td>
                      <td class="id">{{ structures.LogoSysteme_sg }}</td>
                      <td class="id">{{ structures.Adresse_sg }}</td>
                      <td class="id">{{ structures.Email_sg }}</td>
                      <td class="id">{{ structures.Telephone_sg }}</td>
                      <td class="id">{{ structures.WhattApp_sg }}</td>
                      <td class="id">{{ structures.NomPremierResponsable_sg }}</td>
                      <td class="id">{{ structures.FonctionPremierResponsable_sg }}</td>
                      <td class="id">{{ structures.EmailPremierResponsable_sg }}</td>
                      <td class="id">{{ structures.CodeNiveau_sg }}</td>
                      <td class="id">{{ structures.Localite_sg }}</td>

                      <td class="due_date">
                        <!- Ajoutez ici les actions nécessaires ->
                        <span @click="editDetails(structures)">
                          <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                        </span>
                        <span @click="deleteStructure(structures.id_sg)">
                          <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="noresult" v-if="resultQuery.length < 1">
                  <div class="text-center">
                    <lottie
                      colors="primary:#121331,secondary:#08a88a"
                      :options="defaultOptions"
                      :height="75"
                      :width="75"
                    />
                    <h5 class="mt-2">Partenaire non trouvé</h5>
                    <p class="text-muted mb-0">
                      Le partenaire recherché n'a pas été retrouvé.
                    </p>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end" v-if="resultQuery.length >= 1">
                <div class="pagination-wrap hstack gap-2">
                  <BLink
                    class="page-item pagination-prev"
                    href="#"
                    :disabled="page <= 1"
                    @click="page--"
                  >
                    Previous
                  </BLink>
                  <ul class="pagination listjs-pagination mb-0">
                    <li
                      :class="{
                        active: pageNumber == page,
                        disabled: pageNumber == '...',
                      }"
                      v-for="(pageNumber, index) in pages"
                      :key="index"
                      @click="page = pageNumber"
                    >
                      <BLink class="page" href="#" data-i="1" data-page="8">{{
                        pageNumber
                      }}</BLink>
                    </li>
                  </ul>
                  <BLink
                    class="page-item pagination-next"
                    href="#"
                    :disabled="page >= pages.length"
                    @click="page++"
                  >
                    Next
                  </BLink>
                </div>
              </div>
            </BCardBody>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow> -->

    <!-- task list modal -->
    <BModal
      v-model="taskListModal"
      id="showmodal"
      modal-class="zoomIn"
      hide-footer
      header-class="p-3 bg-info-subtle taskModal"
      class="v-modal-custom"
      centered
      :title="dataEdit ? 'Modifier structure' : 'Nouvelle structure'"
    >
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <BRow class="g-3">
          <input type="hidden" id="id" name="" />
          <BCol lg="12">
            <label for="projectName-field" class="form-label">Sigle</label>
            <input
              type="text"
              id="projectName"
              class="form-control"
              placeholder="Sigle"
              v-model="newstructures.Sigle_sg"
            />
          </BCol>
          <BCol lg="12">
            <div>
              <label for="tasksTitle-field" class="form-label">Nom </label>
              <input
                type="text"
                id="tasksTitle"
                class="form-control"
                placeholder="Nom"
                v-model="newstructures.Nom_sg"
              />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>

          <BCol lg="12">
            <label for="createName-field" class="form-label">Sigle du système</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Sigle du système"
              v-model="newstructures.SigleSysteme_sg"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Nom du système</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Nom du système"
              v-model="newstructures.NomSysteme_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label"
              >Description du système</label
            >
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Description du système"
              v-model="newstructures.DescriptionSysteme_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Slogan du système</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Slogan du système"
              v-model="newstructures.SloganSysteme_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Logo du système</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Slogan du système"
              v-model="newstructures.LogoSysteme_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Adresse</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Adresse"
              v-model="newstructures.Adresse_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Email</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Adresse"
              v-model="newstructures.Email_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Telephone</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Telephone"
              v-model="newstructures.Telephone_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Numero WhatsApp</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Numero WhatsApp"
              v-model="newstructures.WhattApp_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Nom Responsable</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Nom Responsable"
              v-model="newstructures.NomPremierResponsable_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Fonction Responsable</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Fonction Responsable"
              v-model="newstructures.FonctionPremierResponsable_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Email Responsable</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Email Responsable"
              v-model="newstructures.EmailPremierResponsable_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Code Niveau</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Code Niveau"
              v-model="newstructures.CodeNiveau_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Localité</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="Localité"
              v-model="newstructures.Localite_sg"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
        </BRow>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton
            type="button"
            variant="light"
            @click="taskListModal = false"
            id="closemodal"
          >
            Fermer
          </BButton>
          <BButton type="submit" variant="success" id="add-btn" @click="handleSubmit">
            {{ dataEdit ? "Modifier" : "Enregistrer" }}
          </BButton>
        </div>
      </b-form>
    </BModal>

    <!-- delete modal -->
    <BModal
      v-model="deleteModal"
      modal-class="zoomIn"
      hide-footer
      no-close-on-backdrop
      centered
    >
      <div class="mt-2 text-center">
        <lottie
          class="avatar-xl"
          colors="primary:#f7b84b,secondary:#f06548"
          :options="defaultOptions1"
          :height="75"
          :width="75"
        />
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
        <button
          type="button"
          class="btn w-sm btn-danger"
          id="delete-record"
          @click="deleteData"
        >
          Yes, Delete It!
        </button>
      </div>
    </BModal>
  </Layout>
</template>
