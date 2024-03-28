<<<<<<< HEAD
<script>
// import { CountTo } from "vue3-count-to";
//import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
//import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Layout from "@/layouts/main.vue";
// import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from "axios";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
// import Lottie from "@/components/widgets/lottie.vue";
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
        id_sg: 0,
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
    // PageHeader,
    // lottie: Lottie,
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
        // this.structures = response.data.data;
        console.log("structures", response.data.data);
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
      let url = "http://ssise-cosit.com/api-ssise/structureGenerale/update";
      let method = "POST";
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

              this.getStructures();
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
      this.loading = true;
      this.rang = 0;
      this.caractere;
      this.test;
      this.loadingClass = "loading-yellow";

      axios
        .get(
          "https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/structureGenerale/getAllStructureGenerale"
        )
        .then((response) => {
          // Mettre à jour les structures générales avec les données reçues
          const data = response.data.data[0];

          this.newstructures = { ...data };

        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des structures générales:",
            error
          );
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
    this.getStructures();
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
    <div class="position-relative mx-n4 mt-n4">
      <div class="profile-wid-bg profile-setting-img">
        <img src="@/assets/images/profile-bg.jpg" class="profile-wid-img" alt="" />
        <div class="overlay-content">
          <!-- <div class="text-end p-3">
            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input
                id="profile-foreground-img-file-input"
                type="file"
                class="profile-foreground-img-file-input"
              />
              <label
                for="profile-foreground-img-file-input"
                class="profile-photo-edit btn btn-light"
              >
                <i class="ri-image-edit-line align-bottom me-1"></i> Change Cover
              </label>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <BRow>
      <BCol xxl="3">
        <BCard no-body class="mt-n5">
          <BCardBody class="p-4">
            <div class="text-center">
              <div class="profile-user position-relative d-inline-block mx-auto mb-4">
                <img
                  src="@/assets/images/ruche.png" width="40"
                  class="rounded-circle avatar-xl img-thumbnail user-profile-image"
                  alt="user-profile-image"
                />
                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <input
                    id="profile-img-file-input"
                    type="file"
                    class="profile-img-file-input"
                  />
                  <label
                    for="profile-img-file-input"
                    class="profile-photo-edit avatar-xs"
                  >
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="ri-camera-fill"></i>
                    </span>
                  </label>
                </div>
              </div>
              <h5 class="fs-17 mb-1">{{ newstructures.NomSysteme_sg }}</h5>
              <p class="text-muted mb-0">
                {{ newstructures.Email_sg }}/ {{ newstructures.Telephone_sg }}
              </p>
            </div>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardBody>
            <div class="d-flex align-items-center mb-5">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">Complete Your Profile</h5>
              </div>
              <div class="flex-shrink-0">
                <BLink
                  href="javascript:void(0);"
                  class="badge bg-light text-primary fs-12"
                  ><i class="ri-edit-box-line align-bottom me-1"></i> Edit</BLink
                >
              </div>
            </div>

            <BProgress class="animated-progress custom-progress progress-label">
              <BProgressBar :value="30" variant="danger">
                <div class="label">30%</div>
              </BProgressBar>
            </BProgress>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardBody>
            <BCol lg="12">
              <div class="mb-3">
                <label for="firstnameInput" class="form-label">Localité </label>
                <input
                  type="text"
                  class="form-control"
                  id="firstnameInput"
                  placeholder="Enter your firstname"
                  v-model="newstructures.Localite_sg"
                />
              </div>
            </BCol>
            <BCol lg="12">
              <div class="mb-3">
                <label for="firstnameInput" class="form-label">Code Niveau </label>
                <input
                  type="text"
                  class="form-control"
                  id="firstnameInput"
                  placeholder="Enter your firstname"
                  v-model="newstructures.CodeNiveau_sg"
                />
              </div>
            </BCol>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol xxl="9">
        <BCard no-body class="mt-xxl-n5">
          <BCardBody class="p-4 pt-2">
            <BTabs nav-class="nav-tabs-custom rounded border-bottom-0">
              <BTab class="nav-item" title="Structure Générale" active>
                <form action="javascript:void(0);">
                  <BRow class="pt-4">
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">Sigle </label>
                        <input
                          type="text"
                          class="form-control"
                          id="firstnameInput"
                          placeholder="Enter your firstname"
                          v-model="newstructures.Sigle_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">Nom</label>
                        <input
                          type="text"
                          class="form-control"
                          id="lastnameInput"
                          placeholder="Enter your lastname"
                          v-model="newstructures.Nom_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">Téléphone</label>
                        <input
                          type="text"
                          class="form-control"
                          id="phonenumberInput"
                          placeholder="Enter your phone number"
                          v-model="newstructures.Telephone_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">Email</label>
                        <input
                          type="email"
                          class="form-control"
                          id="emailInput"
                          placeholder="Enter your email"
                          v-model="newstructures.Email_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="designationInput" class="form-label">WhatsApp</label>
                        <input
                          type="text"
                          class="form-control"
                          id="designationInput"
                          placeholder="Designation"
                          v-model="newstructures.WhattApp_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="websiteInput1" class="form-label">Adresse</label>
                        <input
                          type="text"
                          class="form-control"
                          id="websiteInput1"
                          placeholder="www.example.com"
                          v-model="newstructures.Adresse_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="cityInput" class="form-label">Nom Responsable</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cityInput"
                          placeholder="City"
                          v-model="newstructures.NomPremierResponsable_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="countryInput" class="form-label"
                          >Fonction Responsable</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="countryInput"
                          placeholder="Country"
                          v-model="newstructures.FonctionPremierResponsable_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="zipcodeInput" class="form-label"
                          >Email Responsable</label
                        >
                        <input
                          type="email"
                          class="form-control"
                          id="zipcodeInput"
                          placeholder="Enter zipcode"
                          v-model="newstructures.EmailPremierResponsable_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="mb-3 pb-2">
                        <label for="exampleFormControlTextarea" class="form-label"
                          >Description du système</label
                        >
                        <textarea
                          class="form-control"
                          id="exampleFormControlTextarea"
                          placeholder="Enter your description"
                          rows="2"
                          v-model="newstructures.DescriptionSysteme_sg"
                        ></textarea>
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="countryInput" class="form-label">Sigle Système</label>
                        <input
                          type="text"
                          class="form-control"
                          id="countryInput"
                          placeholder="Country"
                          v-model="newstructures.SigleSysteme_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="cityInput" class="form-label">Nom Système</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cityInput"
                          placeholder="City"
                          v-model="newstructures.NomSysteme_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="zipcodeInput" class="form-label"
                          >Slogan Système</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          minlength="5"
                          maxlength="6"
                          id="zipcodeInput"
                          placeholder="Enter zipcode"
                          v-model="newstructures.SloganSysteme_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="hstack gap-2 justify-content-end">
                        <BButton type="submit" variant="primary" @click="handleSubmit">
                          Enregistrer
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
            </BTabs>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
  <!--<Layout>
    
     <BRow>
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
    </BRow> 

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
  </Layout>-->
</template>
=======
<script>
// import { CountTo } from "vue3-count-to";
//import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
//import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Layout from "@/layouts/main.vue";
// import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from "axios";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
// import Lottie from "@/components/widgets/lottie.vue";
//import simplebar from "simplebar-vue";
export default {
  data() {
    return {
      API_URL: process.env.VUE_APP_BACK_URL,
      PROXY_URL: process.env.VUE_APP_BACK_URL_PROXY,
      taskListModal: false,
      showBoutton:false,
      date3: null,
      structures: [], // Pour stocker les niveaux de structure de l'API
      activeTab: "Product", // Onglet actif par défaut
      localites: [], // Ajoutez une propriété pour stocker les structures
      localiteParent: [], // Ajoutez une propriété pour stocker les structures
      loading: true,
      niveauActif: null,
      uploads_url: "https://ssise-cosit.com/api-ssise/uploads/",
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
        id_sg: "",
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
        LogoSysteme_sg: "",
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
    // PageHeader,
    // lottie: Lottie,
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
    // Appel à setPages() et à la requête axios pour récupérer les niveaux de structure
    this.setPages();
    axios
      .get(
        "https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/structureGenerale/getAllStructureGenerale"
      )
      .then((response) => {
        // this.structures = response.data.data;
        console.log("structures", response.data.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des niveaux de structure:", error);
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
      let url = this.API_URL + "structureGenerale/update";
      let method = "POST";
      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: "Êtes-vous sûr de vouloir enregistrer cette structure ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à l'enregistrement
        if (result.isConfirmed) {
          // this.newstructures.niveau_localite = this.niveauLocalite;
          // Envoyer les détails de la structure à votre API via une requête POST ou PUT
          axios({
            method: method,
            url: url,
            data: this.newstructures,
          })
            .then((response) => {
              // Une fois que la structure a été ajoutée ou mise à jour avec succès
              // Accédez aux données de la réponse si nécessaire
              console.log("Réponse de la requête :", response.data);

              // Affichez un message de succès avec SweetAlert
              window.location.reload();
              // Swal.fire({
              //   title: "Structures enregistrée !",
              //   icon: "success",
              //   confirmButtonText: "OK",
              // });

              this.getStructures();
              // Actualiser la liste des structures si nécessaire
              // (supposons que vous actualisez la liste après chaque modification)
            })
            .catch((error) => {
              // En cas d'erreur lors de l'ajout ou de la mise à jour de la structure, gérez l'erreur ici
              console.error("Erreur lors de l'enregistrement de la structure :", error);
            });
        }
      });
    },
    UploadLogo() {
      let url = this.API_URL + "files/upload-file";
      let method = "POST";
      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: "Êtes-vous sûr de vouloir uploader ce loo ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à l'enregistrement
        if (result.isConfirmed) {
          var files = document.getElementById("profile-img-file-input").files[0];
          var fd = new FormData();
          fd.append("file", files);
          axios({
            method: method,
            url: url,
            data: fd,
          })
            .then((response) => {
              // Une fois que la structure a été ajoutée ou mise à jour avec succès
              // Accédez aux données de la réponse si nécessaire
              console.log("Réponse de la requête :", response.data);
              const data = {
                LogoSysteme_sg: this.uploads_url + response.data.filename,
                id_sg: this.newstructures.id_sg,
              };
              axios({
                method: method,
                url: this.API_URL + "structureGenerale/update",
                data: data,
              })
                .then((response) => {
                  // Une fois que la structure a été ajoutée ou mise à jour avec succès
                  // Accédez aux données de la réponse si nécessaire
                  console.log("Réponse de la requête :", response.data);

                  // Affichez un message de succès avec SweetAlert
                  Swal.fire({
                    title: "Structures enregistrée !",
                    icon: "success",
                    confirmButtonText: "OK",
                  });

                  this.getStructures();
                  window.location.reload();
                  // window.location.reload();
                  // Actualiser la liste des structures si nécessaire
                  // (supposons que vous actualisez la liste après chaque modification)
                })
                .catch((error) => {
                  // En cas d'erreur lors de l'ajout ou de la mise à jour de la structure, gérez l'erreur ici
                  console.error(
                    "Erreur lors de l'enregistrement de la structure :",
                    error
                  );
                });
              // window.location.reload();
              // Actualiser la liste des structures si nécessaire
              // (supposons que vous actualisez la liste après chaque modification)
            })
            .catch((error) => {
              // En cas d'erreur lors de l'ajout ou de la mise à jour de la structure, gérez l'erreur ici
              console.error("Erreur lors de l'enregistrement de la structure :", error);
            });
        }
      });
    },
    getParentLibelle(localite) {
      let libelles = []; // Initialiser un tableau pour stocker les libellés

      // Vérifier si la structure a un parent
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

      libelles.push(localite.libelle_localite); // Ajouter le libellé de la structure actuelle à la fin du tableau
      console.log(libelles);
      return libelles; // Retourner le tableau de libellés
    },
    findLocaliteById(id) {
      this.foundLocalite;
      // Recherche de la structure par ID dans la liste des structures

      this.foundLocalite = this.allTask.find(
        (localite) => localite.id_localite === parseInt(id)
      );
      console.log("structure trouvée :", this.foundLocalite); // Vérifier la structure trouvée
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

      // Remplir les champs du formulaire avec les détails de la structure sélectionnée
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
        id_sg: "",
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
        LogoSysteme_sg: "",
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
      this.loading = true;
      this.rang = 0;
      this.caractere;
      this.test;
      this.loadingClass = "loading-yellow";
      axios
        .get(this.PROXY_URL + this.API_URL + "structureGenerale/getAllStructureGenerale")
        .then((response) => {
          // Mettre à jour les structures générales avec les données reçues
          const data = response.data.data[0];

          this.newstructures = { ...data };
          this.loading = false;
          console.log("coooc", this.cot);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des structures générales:",
            error
          );
        });
    },
    handleFileInputChange(event) {
      const file = event.target.files[0]; // Obtenez le premier fichier sélectionné

      if (file) {
        // Créez un objet FileReader
        const reader = new FileReader();
        this.showBoutton = true;
        // Écoutez l'événement onload qui se déclenche lorsque la lecture du fichier est terminée
        reader.onload = (e) => {
          // Accédez aux données base64 de l'image
          const base64Image = e.target.result;
          this.newstructures.LogoSysteme_sg = base64Image;
          // Utilisez base64Image comme vous le souhaitez, par exemple, en l'envoyant à un serveur ou en l'affichant dans votre interface utilisateur
          console.log("Image en base64:", base64Image);
        };

        // Lisez le fichier en tant que données URL (base64)
        reader.readAsDataURL(file);
      }
    },
    deleteStructure(id_sg) {
      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer cette structure ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à la suppression
        if (result.isConfirmed) {
          // Définir l'URL de la requête de suppression
          const url = "http://ssise-cosit.com/api-ssise/structureGenerale/delete";

          // Corps de la requête contenant l'ID de la structure à supprimer
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

              // Actualiser la liste des structures après la suppression
              this.mounted();
            })
            .catch((error) => {
              // En cas d'erreur lors de la suppression de la structure, gérez l'erreur ici
              console.error("Erreur lors de la suppression de la structures :", error);
            });
        }
      });
    },
    validateCodeLocalite() {
      // Vérifiez la longueur de la saisie du code de la structure
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
    this.getStructures();
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
    <div class="position-relative mx-n4 mt-n4">
      <div class="profile-wid-bg profile-setting-img">
        <img :src="newstructures.LogoSysteme_sg" class="profile-wid-img" alt="" />
        <div class="overlay-content">
          <!-- <div class="text-end p-3">
            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input
                id="profile-foreground-img-file-input"
                type="file"
                class="profile-foreground-img-file-input"
              />
              <label
                for="profile-foreground-img-file-input"
                class="profile-photo-edit btn btn-light"
              >
                <i class="ri-image-edit-line align-bottom me-1"></i> Change Cover
              </label>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="text-center mt-sm-5 pt-4" v-if="loading">
      <button class="btn btn-outline-success btn-load">
        <span class="d-flex align-items-center">
          <span class="spinner-border flex-shrink-0" role="status">
            <span class="visually-hidden">Chargement...</span>
          </span>
          <span class="flex-grow-1 ms-2"> Chargement... </span>
        </span>
      </button>
    </div>

    <BRow v-if="!loading">
      <BCol xxl="3">
        <BCard no-body class="mt-n5">
          <BCardBody class="p-4">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0"></h5>
              </div>
              <div class="flex-shrink-0">
                <BLink href="javascript:void(0);"
                  ><i v-if="showBoutton"
                    class="ri-checkbox-circle-fill align-bottom me-1 h3"
                    style="color: #285e43"
                    @click="UploadLogo"
                  ></i
                ></BLink>
              </div>
            </div>
            <div class="text-center">
              <!-- @/assets/images/ruche.png -->
              <div class="profile-user position-relative d-inline-block mx-auto mb-4">
                <img
                  id="logoImage"
                  :src="newstructures.LogoSysteme_sg"
                  width="40"
                  class="rounded-circle avatar-xl img-thumbnail user-profile-image"
                  alt="user-profile-image"
                />
                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <input
                    id="profile-img-file-input"
                    type="file"
                    class="profile-img-file-input"
                    @change="handleFileInputChange"
                  />
                  <label
                    for="profile-img-file-input"
                    class="profile-photo-edit avatar-xs"
                  >
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="ri-camera-fill"></i>
                    </span>
                  </label>
                </div>
              </div>
              <h5 class="fs-17 mb-1">{{ newstructures.NomSysteme_sg }}</h5>
              <p class="text-muted mb-0">
                {{ newstructures.Email_sg }}/ {{ newstructures.Telephone_sg }}
              </p>
            </div>
          </BCardBody>
        </BCard>
        <!-- <BCard no-body> 
          <BCardBody>
            <div class="d-flex align-items-center mb-5">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">Complete Your Profile</h5>
              </div>
              <div class="flex-shrink-0">
                <BLink
                  href="javascript:void(0);"
                  class="badge bg-light text-primary fs-12"
                  ><i class="ri-edit-box-line align-bottom me-1"></i> Edit</BLink
                >
              </div>
            </div>

            <BProgress class="animated-progress custom-progress progress-label">
              <BProgressBar :value="30" variant="danger">
                <div class="label">30%</div>
              </BProgressBar>
            </BProgress>
          </BCardBody>
        </BCard> -->
        <BCard no-body>
          <BCardBody>
            <BCol lg="12">
              <div class="mb-3">
                <label for="firstnameInput" class="form-label"
                  >structure {{ newstructures.id_sg }}</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="firstnameInput"
                  placeholder="Enter your firstname"
                  v-model="newstructures.Localite_sg"
                />
              </div>
            </BCol>
            <BCol lg="12">
              <div class="mb-3">
                <label for="firstnameInput" class="form-label">Code Niveau </label>
                <input
                  type="text"
                  class="form-control"
                  id="firstnameInput"
                  placeholder="Enter your firstname"
                  v-model="newstructures.CodeNiveau_sg"
                />
              </div>
            </BCol>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol xxl="9">
        <BCard no-body class="mt-xxl-n5">
          <BCardBody class="p-4 pt-2">
            <BTabs nav-class="nav-tabs-custom rounded border-bottom-0">
              <BTab class="nav-item" title="Structure Générale" active>
                <form action="javascript:void(0);">
                  <BRow class="pt-4">
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">Sigle </label>
                        <input
                          type="text"
                          class="form-control"
                          id="firstnameInput"
                          placeholder="Enter your firstname"
                          v-model="newstructures.Sigle_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">Nom</label>
                        <input
                          type="text"
                          class="form-control"
                          id="lastnameInput"
                          placeholder="Enter your lastname"
                          v-model="newstructures.Nom_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">Téléphone</label>
                        <input
                          type="text"
                          class="form-control"
                          id="phonenumberInput"
                          placeholder="Enter your phone number"
                          v-model="newstructures.Telephone_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">Email</label>
                        <input
                          type="email"
                          class="form-control"
                          id="emailInput"
                          placeholder="Enter your email"
                          v-model="newstructures.Email_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="designationInput" class="form-label">WhatsApp</label>
                        <input
                          type="text"
                          class="form-control"
                          id="designationInput"
                          placeholder="Designation"
                          v-model="newstructures.WhattApp_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="websiteInput1" class="form-label">Adresse</label>
                        <input
                          type="text"
                          class="form-control"
                          id="websiteInput1"
                          placeholder="www.example.com"
                          v-model="newstructures.Adresse_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="cityInput" class="form-label">Nom Responsable</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cityInput"
                          placeholder="City"
                          v-model="newstructures.NomPremierResponsable_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="countryInput" class="form-label"
                          >Fonction Responsable</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="countryInput"
                          placeholder="Country"
                          v-model="newstructures.FonctionPremierResponsable_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="zipcodeInput" class="form-label"
                          >Email Responsable</label
                        >
                        <input
                          type="email"
                          class="form-control"
                          id="zipcodeInput"
                          placeholder="Enter zipcode"
                          v-model="newstructures.EmailPremierResponsable_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="mb-3 pb-2">
                        <label for="exampleFormControlTextarea" class="form-label"
                          >Description du système</label
                        >
                        <textarea
                          class="form-control"
                          id="exampleFormControlTextarea"
                          placeholder="Enter your description"
                          rows="2"
                          v-model="newstructures.DescriptionSysteme_sg"
                        ></textarea>
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="countryInput" class="form-label">Sigle Système</label>
                        <input
                          type="text"
                          class="form-control"
                          id="countryInput"
                          placeholder="Country"
                          v-model="newstructures.SigleSysteme_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="cityInput" class="form-label">Nom Système</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cityInput"
                          placeholder="City"
                          v-model="newstructures.NomSysteme_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="zipcodeInput" class="form-label"
                          >Slogan Système</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="zipcodeInput"
                          placeholder="Enter zipcode"
                          v-model="newstructures.SloganSysteme_sg"
                        />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="hstack gap-2 justify-content-end">
                        <BButton
                          type="submit"
                          style="background-color: #288f24"
                          class="btn btn-md"
                          @click="handleSubmit"
                        >
                          Enregistrer
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
            </BTabs>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
  <!--<Layout>
    
     <BRow>
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
                      <th class="sort" data-sort="id">structure</th>
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
    </BRow> 

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
            <label for="createName-field" class="form-label">structure</label>
            <input
              type="text"
              id="createName"
              class="form-control"
              placeholder="structure"
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
  </Layout>-->
</template>
>>>>>>> 545a8515d602415f56c97fe6c06cd1ee978e68a7
