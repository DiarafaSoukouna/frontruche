<script>


import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";

import animationData from "@/components/widgets/lupuorrc.json";
import Swal from "sweetalert2";
import "@vueform/multiselect/themes/default.css";
import animationData1 from "@/components/widgets/gsqxdxog.json";
//import Lottie from "@/components/widgets/lottie.vue";

import axios from 'axios';
export default {
  data() {
    return {
      taskListModal: false,
      taskListModal1: false,
      taskListModal2: false,
      date3: null,
      niveauxLocalite: [], // Pour stocker les niveaux de Type partenaire de l'API
      activeTab: "Product", // Onglet actif par défaut
      niveauLocal: [], // Ajoutez une propriété pour stocker les Type partenaires
      uniteIndicateur: [], // Ajoutez une propriété pour stocker les Type partenaires
      localiteParent: [], // Ajoutez une propriété pour stocker les Type partenaires
      loading: false,
      range: null,
      niveauActif: null,
      niveauLocalite: null,
      parentLocalite: null,
      libelleParent: null,
      rangLocalite: null,
      localite_concerne_ugl_str: null,
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
        nombre_niv_localite: null,
        libelle_niv_localite: "",
        nb_char_niv_localite: "",

        niveau_ugl_concerne: 1,
        idusrcreation: 1,

      },
      unite: {
        abrege_unite: "",
        definition_unite: "",
        geler_unite_indicateur: 0,
      },
      newDepense: {
        code_categorie_depense: "",
        libelle_categorie_depense: "",
      },
      filterdate: null,
      filterdate1: null,
      filterdate2: null,
      filtervalue: "All",
      filtervalue1: "All",
      filtersearchQuery1: null,
      date: null,
      allTask: [],

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
      submitted1: false,
      submitted2: false,

      dataEdit: false,
      dataEdit1: false,
      dataEdit2: false,
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
      items: [
        // Vos données ici
      ],
      // Propriété pour stocker la valeur saisie par l'utilisateur
      searchQuery1: ''
    };
  },
  components: {
    Layout,
    PageHeader,
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
            data.id.toLowerCase().includes(search) ||
            data.task.toLowerCase().includes(search) ||
            data.femme_localite.toLowerCase().includes(search) ||
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
    filteredItems() {
      // Si la recherche est vide, renvoyer le tableau original
      if (!this.searchQuery1) {
        return this.items;
      } else {
        // Filtrer le tableau pour n'inclure que les éléments correspondant à la recherche
        return this.items.filter(item => {
          // Vous pouvez personnaliser la logique de filtrage ici selon vos besoins
          // Par exemple, ici, nous filtrons les éléments dont le nom inclut la valeur de recherche (insensible à la casse)
          return item.name.toLowerCase().includes(this.searchQuery1.toLowerCase());
        });
      }
    }
  },
  watch: {
    allTask() {
      this.setPages();
    },
  },
  created() {
    // Appel à setPages() et à la requête axios pour récupérer les niveaux de Type partenaire
    this.setPages();
    axios
      .get("http://ssise-cosit.com/api-ssise/niveauLocalite/getAllNiveauLocalite")
      .then((response) => {
        // Une fois que les données ont été récupérées avec succès, les assigner à niveauxLocalite
        this.niveauLocal = response.data.data;
        this.range = this.niveauLocal[0].rang_niveau;
        console.log("Premier enregistrement:", this.range);


      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des niveaux de Type partenaire:", error);
      });

    axios
      .get("http://ssise-cosit.com/api-ssise/localite/getAllLocalite")
      .then((response) => {
        // Une fois que les données ont été récupérées avec succès, les assigner à niveauxLocalite
        this.localiteParent = response.data.data;
        console.log(this.localiteParent);


      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des niveaux de Type partenaire:", error);
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
        "http://ssise-cosit.com/api-ssise/typePartenaire/getAllTypePartenaire"
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
    filterTable() {
      // Aucune action nécessaire ici car la logique de filtrage est gérée dans la propriété calculée filteredItems
    },
    handleSubmit() {
      let url = "http://ssise-cosit.com/api-ssise/typePartenaire/";
      let method = "";

      if (this.dataEdit) {
        // Si dataEdit est true, nous mettons à jour une Type partenaire existante
        url += "update";
        method = "POST";
      } else {
        // Sinon, nous ajoutons une Nouveau Type partenaire
        url += "insert";
        method = "POST";
      }

      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir enregistrer cette Type partenaire ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à l'enregistrement
        if (result.isConfirmed) {
          // this.newLocalite.niveau_localite = this.niveauLocalite;
          // Envoyer les détails de la Type partenaire à votre API via une requête POST ou PUT
          axios({
            method: method,
            url: url,
            data: this.newLocalite
          })
            .then((response) => {
              // Une fois que la Type partenaire a été ajoutée ou mise à jour avec succès
              // Accédez aux données de la réponse si nécessaire
              console.log("Réponse de la requête :", response.data);

              // Affichez un message de succès avec SweetAlert
              Swal.fire({
                title: 'Type partenaire  !',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              this.fetchLocalites();

              // Réinitialiser les champs du formulaire
              this.resetNewLocalite();
              // Fermer le modal après avoir ajouté ou mis à jour la Type partenaire
              this.taskListModal = false;

              // Actualiser la liste des Type partenaires si nécessaire
              // (supposons que vous actualisez la liste après chaque modification)

            })
            .catch((error) => {
              // En cas d'erreur lors de l'ajout ou de la mise à jour de la Type partenaire, gérez l'erreur ici
              console.error("Erreur lors de l'enregistrement de la Type partenaire :", error);
            });
        }
      });
    }
    ,
    handleSubmit1() {
      let url = "http://ssise-cosit.com/api-ssise/uniteIndicateur/";
      let method = "";

      if (this.dataEdit1) {
        // Si dataEdit est true, nous mettons à jour une Type partenaire existante
        url += "update";
        method = "POST";
      } else {
        // Sinon, nous ajoutons une Nouveau Type partenaire
        url += "insert";
        method = "POST";
      }

      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir enregistrer cette unité indicateur ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à l'enregistrement
        if (result.isConfirmed) {
          // this.newLocalite.niveau_localite = this.niveauLocalite;
          // Envoyer les détails de la Type partenaire à votre API via une requête POST ou PUT
          axios({
            method: method,
            url: url,
            data: this.unite
          })
            .then((response) => {
              // Une fois que la Type partenaire a été ajoutée ou mise à jour avec succès
              // Accédez aux données de la réponse si nécessaire
              console.log("Réponse de la requête :", response.data);

              // Affichez un message de succès avec SweetAlert
              Swal.fire({
                title: 'Unité indicateur !',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              this.fetchUnites();

              // Réinitialiser les champs du formulaire
              this.resetNewUnite();
              // Fermer le modal après avoir ajouté ou mis à jour la Type partenaire
              this.taskListModal1 = false;

              // Actualiser la liste des Type partenaires si nécessaire
              // (supposons que vous actualisez la liste après chaque modification)

            })
            .catch((error) => {
              // En cas d'erreur lors de l'ajout ou de la mise à jour de la Type partenaire, gérez l'erreur ici
              console.error("Erreur lors de l'enregistrement de la Type partenaire :", error);
            });
        }
      });
    },
    handleSubmit2() {
      let url = "http://ssise-cosit.com/api-ssise/niveauLocalite/";
      let method = "";

      if (this.dataEdit2) {
        // Si dataEdit est true, nous mettons à jour une Type partenaire existante

        url += "update";
        method = "POST";
      } else {
        // Sinon, nous ajoutons une Nouveau Type partenaire
        this.newLocalite.rang_niveau = this.range + 1;
        url += "insert";
        method = "POST";
      }





      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir enregistrer cette unité de gestion ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à l'enregistrement
        if (result.isConfirmed) {
          // this.newLocalite.niveau_localite = this.niveauLocalite;
          // Envoyer les détails de la Type partenaire à votre API via une requête POST ou PUT
          axios({
            method: method,
            url: url,
            data: { ...this.newLocalite } // Utilisez la chaîne de caractères convertie
          })
            .then((response) => {
              // Une fois que la Type partenaire a été ajoutée ou mise à jour avec succès
              // Accédez aux données de la réponse si nécessaire
              console.log("Réponse de la requête :", response.data);

              // Affichez un message de succès avec SweetAlert
              Swal.fire({
                title: 'Unité de gestion crée avec succès !',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              this.fetchLocalites();

              // Réinitialiser les champs du formulaire
              this.resetNewLocalite();
              // Fermer le modal après avoir ajouté ou mis à jour la Type partenaire
              this.taskListModal2 = false;

              // Actualiser la liste des Type partenaires si nécessaire
              // (supposons que vous actualisez la liste après chaque modification)

            })
            .catch((error) => {
              // En cas d'erreur lors de l'ajout ou de la mise à jour de la Type partenaire, gérez l'erreur ici
              console.error("Erreur lors de l'enregistrement de la Type partenaire :", error);
            });
        }
      });
    },
    getParentLibelle(localite) {
      let libelles = []; // Initialiser un tableau pour stocker les libellés

      // Vérifier si la Type partenaire a un parent
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

      libelles.push(localite.libelle_localite); // Ajouter le libellé de la Type partenaire actuelle à la fin du tableau
      console.log(libelles);
      return libelles; // Retourner le tableau de libellés
    },
    findLocaliteById(id) {
      this.foundLocalite;
      // Recherche de la Type partenaire par ID dans la liste des Type partenaires

      this.foundLocalite = this.allTask.find(localite => localite.id_localite === parseInt(id));
      console.log("Type partenaire trouvée :", this.foundLocalite); // Vérifier la Type partenaire trouvée
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
      delete filteredData.partenaires;
      delete filteredData.geler_type_partenaire;
      delete filteredData.created_at;
      delete filteredData.updated_at;

      // Remplir les champs du formulaire avec les détails de la Type partenaire sélectionnée
      this.newLocalite = { ...filteredData };

      this.submitted = false;
    },
    editDetails1(data) {
      this.dataEdit1 = true;
      this.taskListModal1 = true;

      // Filtrer les propriétés indésirables de l'objet data
      const filteredData = { ...data };
      delete filteredData.dictionnaire_indicateur;
      delete filteredData.created_at;
      delete filteredData.updated_at;

      // Remplir les champs du formulaire avec les détails de la Type partenaire sélectionnée
      this.unite = { ...filteredData };

      this.submitted1 = false;
    },
    editDetails2(data) {
      this.dataEdit2 = true;
      this.taskListModal2 = true;

      // Filtrer les propriétés indésirables de l'objet data
      const filteredData = { ...data };

      delete filteredData.localites;
      delete filteredData.created_at;
      delete filteredData.updated_at;

      // Remplir les champs du formulaire avec les détails de la Type partenaire sélectionnée
      this.newLocalite = { ...filteredData };

      this.submitted2 = false;
    },

    toggleModal() {
      this.resetNewLocalite();
      this.taskListModal = true;
      this.dataEdit = false;
      this.event = {};
      this.submitted = false;
    },
    toggleModal1() {
      this.resetNewUnite();
      this.taskListModal1 = true;
      this.dataEdit1 = false;
      this.event1 = {};
      this.submitted1 = false;
    },
    toggleModal2() {
      this.resetNewUnite();
      this.taskListModal2 = true;
      this.dataEdit2 = false;
      this.event1 = {};
      this.submitted2 = false;
    },

    resetNewLocalite() {
      this.newLocalite = {
        nombre_niv_localite: null,
        libelle_niv_localite: "",
        nb_char_niv_localite: "",

        niveau_ugl_concerne: 1,
        idusrcreation: 1,

      };
    },
    resetNewUnite() {
      this.unite = {
        abrege_unite: "",
        definition_unite: "",
        geler_unite_indicateur: 0,
      };
    },
    resetDepense() {
      this.newDepense = {
        code_categorie_depense: "",
        libelle_categorie_depense: "",
      };
    },

    deleteModalToggle(data) {
      this.deleteModal = true;
      this.event._id = data._id;
    },

    deleteData() {
      if (this.event._id) {
        axios
          .delete(
            `https://api-node.themesbrand.website/apps/task/${this.event._id}`
          )
          .then((response) => {
            if (response.data.status === "success") {
              this.allTask = this.allTask.filter(
                (item) => item._id != this.event._id
              );
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
      const niveau = this.niveauxLocalite.find(niveau => niveau.rang_niveau === idNiveau);

      if (niveau) {
        return niveau.libelle_niv_localite;
      } else {
        return "Niveau non trouvé";
      }
    },

    fetchLocalites() {
      // Définir loading à true pour afficher l'indicateur de chargement
      this.loading = true;
      this.rang = 0;
      this.caractere;
      this.test;
      // Définir la couleur de chargement à jaune
      this.loadingClass = 'loading-yellow';

      axios
        .get("http://ssise-cosit.com/api-ssise/niveauLocalite/getAllNiveauLocalite", {

        })
        .then((response) => {
          // Mettre à jour la liste des Type partenaires avec les données reçues

          this.niveauLocal = response.data.data;
          console.log(this.niveauLocal);

        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des Type partenaires:", error);
        })
        .finally(() => {
          // Après avoir obtenu les données ou en cas d'erreur, définir loading à false
          // pour masquer l'indicateur de chargement
          this.loading = false;
        });
    },
    fetchUnites() {
      // Définir loading à true pour afficher l'indicateur de chargement
      this.loading = true;
      this.rang = 0;
      this.caractere;
      this.test;
      // Définir la couleur de chargement à jaune
      this.loadingClass = 'loading-yellow';

      axios
        .get("http://ssise-cosit.com/api-ssise/uniteIndicateur/getAllUniteIndicateur", {

        })
        .then((response) => {
          // Mettre à jour la liste des Type partenaires avec les données reçues

          this.uniteIndicateur = response.data.data;
          console.log(this.niveauLocal);

        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des Type partenaires:", error);
        })
        .finally(() => {
          // Après avoir obtenu les données ou en cas d'erreur, définir loading à false
          // pour masquer l'indicateur de chargement
          this.loading = false;
        });
    },
    fetchDepense() {
      // Définir loading à true pour afficher l'indicateur de chargement
      this.loading = true;
      this.rang = 0;
      this.caractere;
      this.test;
      // Définir la couleur de chargement à jaune
      this.loadingClass = 'loading-yellow';

      axios
        .get("http://ssise-cosit.com/api-ssise/categorieDepense/getAllCategorieDepense", {

        })
        .then((response) => {
          // Mettre à jour la liste des Type partenaires avec les données reçues

          this.categoryDepense = response.data.data;


        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des Type partenaires:", error);
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
        title: 'Êtes-vous sûr de vouloir supprimer cet type partenaire ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à la suppression
        if (result.isConfirmed) {
          // Définir l'URL de la requête de suppression
          const url = "http://ssise-cosit.com/api-ssise/typePartenaire/delete";

          // Corps de la requête contenant l'ID de la Type partenaire à supprimer
          const requestBody = {
            id_type_pat: id_localite
          };

          // Envoyer la requête DELETE à l'API
          axios.delete(url, { data: requestBody })
            .then(() => {
              // Afficher un message de succès avec SweetAlert
              Swal.fire({
                title: 'Type partenaire supprimé !',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              // Actualiser la liste des Type partenaires après la suppression
              this.fetchLocalites();
            })
            .catch((error) => {
              // En cas d'erreur lors de la suppression de la Type partenaire, gérez l'erreur ici
              console.error("Erreur lors de la suppression de la Type partenaire :", error);
            });
        }
      });
    },
    deleteUnite(id_localite) {
      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer cete unité ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à la suppression
        if (result.isConfirmed) {
          // Définir l'URL de la requête de suppression
          let url = 'http://ssise-cosit.com/api-ssise/niveauLocalite/delete';

          // Corps de la requête contenant l'ID de la Type partenaire à supprimer
          const requestBody = {
            id_niv_localite: id_localite
          };

          // Envoyer la requête DELETE à l'API
          axios.delete(url, { data: requestBody })
            .then(() => {
              // Afficher un message de succès avec SweetAlert
              Swal.fire({
                title: 'Niveau localité supprimé !',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              // Actualiser la liste des Type partenaires après la suppression
              this.fetchLocalites();
            })
            .catch((error) => {
              // En cas d'erreur lors de la suppression de la Type partenaire, gérez l'erreur ici
              console.error("Erreur lors de la suppression de la Type partenaire :", error);
            });
        }
      });
    },
    deleteDepense(id_localite) {
      // Afficher une boîte de dialogue de confirmation avec SweetAlert
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer cette catégorie dépense ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        // Si l'utilisateur clique sur "Oui", procéder à la suppression
        if (result.isConfirmed) {
          // Définir l'URL de la requête de suppression
          const url = "http://ssise-cosit.com/api-ssise/categorieDepense/delete";

          // Corps de la requête contenant l'ID de la Type partenaire à supprimer
          const requestBody = {
            id_categorie_depense: id_localite
          };

          // Envoyer la requête DELETE à l'API
          axios.delete(url, { data: requestBody })
            .then(() => {
              // Afficher un message de succès avec SweetAlert
              Swal.fire({
                title: 'Catégorie dépense supprimée !',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              // Actualiser la liste des Type partenaires après la suppression
              this.fetchDepense();
            })
            .catch((error) => {
              // En cas d'erreur lors de la suppression de la Type partenaire, gérez l'erreur ici
              console.error("Erreur lors de la suppression de la Type partenaire :", error);
            });
        }
      });
    },
    validateCodeLocalite() {
      // Vérifiez la longueur de la saisie du code de la Type partenaire
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
        this.newLocalite.code_localite = this.newLocalite.code_localite.slice(0, parseInt(this.caractere));
      }
    },
    // Définir une fonction pour obtenir le libellé d'une localité à partir de son identifiant
    getLocaliteLabel(localiteId) {
      // Parcourir la liste localiteParent
      for (let i = 0; i < this.localiteParent.length; i++) {
        // Vérifier si l'identifiant de la localité correspond
        if (this.localiteParent[i].id_localite === localiteId) {
          // Retourner le libellé de la localité
          return this.localiteParent[i].libelle_localite;
        }
      }
      // Si aucune correspondance n'est trouvée, retourner une chaîne vide ou un message d'erreur
      return ""; // ou return "Localité non trouvée";
    }

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
            ? (document.getElementById("remove-actions").style.display =
              "block")
            : (document.getElementById("remove-actions").style.display =
              "none");
        } else {
          checkedCount > 0
            ? (document.getElementById("remove-actions").style.display =
              "block")
            : (document.getElementById("remove-actions").style.display =
              "none");
        }
      });
    });
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Unité de gestion" pageTitle="Paramétrage" />
    <BRow>
      <BCol class="col-xl-12">
        <BCard no-body>
          <BCardBody class="checkout-tab">
            <BForm action="#">
              <div class="step-arrow-nav mt-n3 mx-n3 mb-3">
                <!-- Seul le premier onglet est conservé -->
                <BTab active class="nav-item nav-link p-3">
                  <template #title>
                    <div class="fs-15">
                      <i class="
                                  ri-user-line
                                  fs-16
                                  avatar-xs d-inline-flex align-items-center justify-content-center
                                  bg-primary-subtle
                                  text-primary
                                  rounded-circle
                                  align-middle
                                  me-2
                                "></i>
                      {{ $t("type_pat") }}
                    </div>
                  </template>
                  <!-- Contenu du premier onglet -->
                  <BCardBody class="border border-dashed border-end-0 border-start-0">
                    <div class="flex-shrink-0">
                      <div class="d-flex flex-wrap gap-2 justify-content-end">
                        <BButton variant="secondary" class="me-1" id="remove-actions" @click="deleteMultiple">
                          <i class="ri-delete-bin-2-line"></i>
                        </BButton>
                        <BCol xxl="5" sm="12">
                          <div class="search-box">
                            <input type="text" class="form-control search bg-light border-light"
                              placeholder="Search for tasks or something..." v-model="searchQuery1"
                              @input="filterTable" />
                            <i class="ri-search-line search-icon"></i>
                          </div>
                        </BCol>

                        <BButton style="background-color: #285e43" @click="toggleModal2">
                          <i class="ri-add-line align-bottom me-1"></i> {{ $t("ajout") }} {{ $t("niveau-localite") }}
                        </BButton>
                      </div>
                    </div>
                  </BCardBody>
                  <BCardBody>
                    <div class="table-responsive table-card mb-4">
                      <table class="table align-middle table-nowrap mb-0" id="tasksTable">
                        <thead class="table-light text-muted">
                          <tr>
                            <th class="sort" data-sort="id">
                              Niveau
                            </th>

                            <th class="sort" data-sort="id">
                              Nom
                            </th>
                            <th class="sort" data-sort="id">
                              Nombre de caractères
                            </th>

                            <th class="sort" data-sort="due_date">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody class="list form-check-all">
                          <tr v-for="(localite, index) in niveauLocal.sort((a, b) => a.rang_niveau - b.rang_niveau) "
                            :key="index">

                            <!-- Remplacez 'localite.id_localite' par l'ID approprié -->
                            <td class="id">{{ localite.rang_niveau }}</td>


                            <td class="id">{{ localite.libelle_niv_localite }}</td>

                            <td class="id">{{ localite.nb_char_niv_localite }}</td>



                            <td class="due_date">
                              <!-- Ajoutez ici les actions nécessaires -->
                              <span @click="editDetails2(localite)">
                                <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                              </span>
                              <span @click="deleteUnite(localite.id_niv_localite)">
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
                            <BLink class="page" href="#" data-i="1" data-page="8">{{ pageNumber }}</BLink>
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
              </div>
            </BForm>
          </BCardBody>
        </BCard>
      </BCol>



    </BRow>

    <BModal v-model="taskListModal2" id="showmodal2" modal-class="zoomIn" hide-footer
      header-class="p-3 bg-info-subtle taskModal1" class="v-modal-custom" centered size="lg"
      :title="dataEdit2 ? 'Modifier  niveau localté' : 'Nouveau niveau localté'">
      <b-form id="addform2" class="tablelist-form2" autocomplete="off">
        <BRow class="g-3">
          <input type="hidden" id="id" name="" />

          <BCol lg="12">
            <div>
              <label for="tasksTitle-field" class="form-label">Niveau </label>
              <input type="text" id="tasksTitle" class="form-control" placeholder="Nom"
                v-model="newLocalite.libelle_niv_localite" :class="{ 'is-invalid': submitted && !event.task }" />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>
          <BCol lg="12">
            <div>
              <label for="tasksTitle-field" class="form-label">Taille du code </label>
              <input type="number" id="tasksTitle" class="form-control" placeholder="Code"
                v-model="newLocalite.nb_char_niv_localite" :class="{ 'is-invalid': submitted && !event.task }" />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>





        </BRow>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton type="button" variant="light" @click="taskListModal2 = false" id="closemodal">
            Fermer
          </BButton>
          <BButton type="submit" variant="success" id="add-btn" @click="handleSubmit2">
            {{ dataEdit2 ? "Modifier" : "Enregistrer" }}
          </BButton>
        </div>
      </b-form>
    </BModal>
  </Layout>
</template>
