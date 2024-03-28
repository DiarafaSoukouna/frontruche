<script>
// import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
// import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
// import Swal from "sweetalert2";
import axios from "axios";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
import Lottie from "@/components/widgets/lottie.vue";
// import simplebar from "simplebar-vue";
export default {
  data() {
    return {
      taskListModal: false,
      date3: null,
      loading:true,
      API_URL: process.env.VUE_APP_BACK_URL,
      PROXY_URL: process.env.VUE_APP_BACK_URL_PROXY,
      rangeDateconfig: {
        wrap: true,
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
        mode: "range",
        all: "",
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
      filterdate: null,
      filterdate1: null,
      filtervalue: "All",
      filtervalue1: "All",
      filtersearchQuery1: null,
      date: null,
      allTask: [],
      allPartenaire: [],
      allUnite: [],
      allProfils: [],
      nom: "",
      login: "",
      titre: "",
      password: "",
      prenom: "",
      email: "",
      profil_id: "",
      unite_gest: "",
      partenaire: "",
      id: "",
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
    // flatPickr,
    // simplebar,
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
            data.nom_user.toLowerCase().includes(search) ||
            data.prenom_user.toLowerCase().includes(search) ||
            data.titre_user.toLowerCase().includes(search) ||
            data.email_user.toLowerCase().includes(search)
          );
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
    this.setPages();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
  beforeMount() {
    this.getUsers();
    this.getProfil();
    this.getUniteGest();
    this.getPartenaire();
    console.log("Hello tout le monde", this.allUnite);
  },

  methods: {
    getUsers() {
      axios
        .get(
          this.PROXY_URL + this.API_URL+"users/getAllUsers"
        )
        .then(
          function (response) {
            this.allTask = response.data.data;
            this.loading = false;
            
            console.log(response.data.data);
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    async insertUser() {
      try {
        await axios.post(
          this.PROXY_URL + this.API_URL+"users/insert",
          {
            nom_user: this.nom,
            login_user: this.login,
            titre_user: this.titre,
            pass_user: this.password,
            prenom_user: this.prenom,
            email_user: this.email,
            profil_id: this.profil_id,
            code_unite_gestion: this.unite_gest,
            code_partenaire: this.partenaire,
          }
        );
        this.getUsers();
        this.clean();
        this.taskListModal = false;
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    async modifUser() {
      try {
        await axios.post(
          this.PROXY_URL + this.API_URL+"users/update",
          {
            id_user: this.id,
            nom_user: this.nom,
            login_user: this.login,
            titre_user: this.titre,
            prenom_user: this.prenom,
            email_user: this.email,
            profil_id: this.profil_id,
            code_unite_gestion: this.unite_gest,
            code_partenaire: this.partenaire,
          }
        );
        this.getUsers();
        this.clean();
        this.taskListModal = false;
        console.log(this.id_user);
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
        console.log(this.id_user);
      }
    },

    getProfil() {
      axios
        .get(
          this.PROXY_URL + this.API_URL+"profil/getAllProfil"
        )
        .then((response) => {
          this.allProfils = response.data.data;
          console.log(this.allProfils);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getUniteGest() {
      axios
        .get(
          this.PROXY_URL + this.API_URL+"uniteGestion/getAllUniteGestion"
        )
        .then(
          function (response) {
            this.allUnite = response.data.data;
            console.log("coucouuu", this.allUnite);
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    getPartenaire() {
      axios
        .get(
          this.PROXY_URL + this.API_URL+"partenaire/getAllPartenaire"
        )
        .then(
          function (response) {
            this.allPartenaire = response.data.data;
            console.log(response.data.data);
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    recup(id) {
      for (let u of this.allTask) {
        if (u.id_user === id) {
          this.id = u.id_user;
          this.nom = u.nom_user;
          this.login = u.login_user;
          this.titre = u.titre_user;
          this.prenom = u.prenom_user;
          this.email = u.email_user;
          this.profil_id = u.profil_id;
          this.unite_gest = u.code_unite_gestion;
          this.partenaire = u.code_partenaire;
        }
      }
    },

    async deleteUser() {
      try {
        await axios
          .delete(
            this.PROXY_URL + this.API_URL+"users/delete",
            {
              data: { id_user: this.id },
            }
          )
          .then((response) => {
            console.log(response);
            this.getUsers();
            this.id = "";
            this.deleteModal = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
        console.log(this.id);
      }
    },
    performAction() {
      if (this.dataEdit) {
        this.modifUser();
      } else {
        this.insertUser();
      }
    },

    clean() {
      this.nom = "";
      this.login = "";
      this.titre = "";
      this.password = "";
      this.prenom = "";
      this.email = "";
      this.profil_id = "";
      this.unite_gest = "";
      this.partenaire = "";
    },
    handleSubmit() {
      if (this.dataEdit) {
        this.submitted = true;
        if (
          this.submitted &&
          this.event.project &&
          this.event.task &&
          this.event.creater &&
          this.event.dueDate &&
          this.event.status &&
          this.event.priority
        ) {
          this.taskListModal = false;

          axios
            .patch(
              `https://api-node.themesbrand.website/apps/task/${this.event._id}`,
              this.event
            )
            .then((response) => {
              const data = response.data.data;
              this.allTask = this.allTask.map((item) =>
                item._id.toString() == data._id.toString() ? { ...item, ...data } : item
              );
            })
            .catch((er) => {
              console.log(er);
            });
        }
      } else {
        this.submitted = true;
        if (
          this.submitted &&
          this.event.project &&
          this.event.task &&
          this.event.creater &&
          this.event.dueDate &&
          this.event.status &&
          this.event.priority
        ) {
          const data = {
            _id: Math.floor(Math.random() * 100 + 20) - 20,
            taskId: "#VLZ4" + (Math.floor(Math.random() * 100 + 20) - 20),
            ...this.event,
          };
          this.taskListModal = false;

          axios
            .post(`https://api-node.themesbrand.website/apps/task`, data)
            .then((response) => {
              this.allTask.unshift(response.data.data);
            })
            .catch((er) => {
              console.log(er);
            });
        }
      }
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

    editDetails() {
      this.dataEdit = true;
      this.taskListModal = true;
      // this.recup(data);

      this.submitted = false;
    },

    toggleModal() {
      this.taskListModal = true;
      this.dataEdit = false;
      this.event = {};

      this.submitted = false;
    },

    deleteModalToggle(id) {
      this.deleteModal = true;
      this.id = id;
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
    <PageHeader title="Utilisateurs" pageTitle="Paramétrages" />

    <BRow>
      <BCol lg="12">
        <BCard no-body id="tasksList">
          <BCardHeader class="border-0">
            <div class="d-flex align-items-center">
              <h5 class="card-title mb-0 flex-grow-1">Les utilisateurs</h5>
              <div class="flex-shrink-0">
                <div class="d-flex flex-wrap gap-2">
                  <BButton variant="secondary" class="me-1" id="remove-actions">
                    <i class="ri-delete-bin-2-line"></i>
                  </BButton>
                  <BButton @click="toggleModal" style="background-color: #285e43">
                    <i class="ri-add-line align-bottom me-1"></i> Nouveau
                  </BButton>
                </div>
              </div>
            </div>
          </BCardHeader>
          <BCardBody class="border border-dashed border-end-0 border-start-0">
            <b-form>
              <BRow class="g-3">
                <BCol xxl="5" sm="4">
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
            <div class="table-responsive table-card mb-4" v-if="!loading">
              <table class="table align-middle table-nowrap mb-0" id="tasksTable">
                <thead class="table-light text-muted">
                  <tr>
                    <th class="sort" data-sort="id" @click="onSort('taskId')">
                      Nom & Prenom
                    </th>
                    <th class="sort" data-sort="project_name" @click="onSort('nom_user')">
                      Login
                    </th>
                    <th class="sort" data-sort="tasks_name" @click="onSort('login_user')">
                      Unite de Gestion
                    </th>
                    <th
                      class="sort"
                      data-sort="client_name"
                      @click="onSort('code_unite_gestion')"
                    >
                      Partenaire
                    </th>
                    <th class="sort" data-sort="status" @click="onSort('contact_user')">
                      Contact
                    </th>
                    <th class="sort" data-sort="priority" @click="onSort('email_user')">
                      Email
                    </th>
                    <th class="sort" data-sort="priority" @click="onSort('nom_user')">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="list form-check-all">
                  <tr v-for="(task, index) of resultQuery" :key="index">
                    <td class="id">
                      {{ task.nom_user }} {{ task.prenom_user }}
                    </td>
                    <td class="project_name">
                      {{ task.login_user }}
                    </td>
                    <td>
                      <div class="d-flex">
                        <div class="flex-grow-1 tasks_name">
                          {{ task.code_unite_gestion }}
                        </div>
                      </div>
                    </td>
                    <td class="client_name">{{ task.code_partenaire }}</td>

                    <td class="due_date">{{ task.contact_user }}</td>
                    <td class="status">{{ task.email_user }}</td>
                    <td class="due_date">
                      <span
                        @click="
                          editDetails();
                          recup(task.id_user);
                        "
                      >
                        <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      </span>
                      <span @click="deleteModalToggle(task.id_user)">
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
                  <h5 class="mt-2">Sorry! No Result Found</h5>
                  <p class="text-muted mb-0">
                    We've searched more than 200k+ tasks We did not find any tasks for you
                    search.
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
        </BCard>
      </BCol>
    </BRow>

    <!-- task list modal -->
    <BModal
      v-model="taskListModal"
      id="showmodal"
      modal-class="zoomIn"
      hide-footer
      header-class="p-3 bg-info-subtle taskModal"
      class="v-modal-custom"
      centered
      size="lg"
      :title="dataEdit ? 'Modifier' : 'Ajouter'"
    >
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <BRow class="g-3">
          <BCol lg="6">
            <label for="projectName-field" class="form-label">Login</label>
            <input
              type="text"
              id="projectName"
              class="form-control"
              v-model="login"
              :class="{ 'is-invalid': submitted && !event.project }"
            />
            <div class="invalid-feedback">Please enter a project name.</div>
          </BCol>
          <BCol lg="6">
            <div>
              <label for="tasksTitle-field" class="form-label">Titre</label>
              <input
                type="text"
                id="titre"
                class="form-control"
                v-model="titre"
                :class="{ 'is-invalid': submitted && !event.task }"
              />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>
          <BCol lg="6" v-if="!dataEdit">
            <label for="projectName-field" class="form-label">Mot de passe</label>
            <input
              type="text"
              id="password"
              class="form-control"
              v-model="password"
              :class="{ 'is-invalid': submitted && !event.project }"
            />
            <div class="invalid-feedback">Please enter a project name.</div>
          </BCol>

          <BCol lg="6">
            <label for="projectName-field" class="form-label">Nom</label>
            <input
              type="text"
              id="Nom"
              class="form-control"
              v-model="nom"
              :class="{ 'is-invalid': submitted && !event.project }"
            />
            <div class="invalid-feedback">Please enter a project name.</div>
          </BCol>
          <BCol lg="6">
            <div>
              <label for="tasksTitle-field" class="form-label">Prenom</label>
              <input
                type="text"
                id="prenom"
                class="form-control"
                v-model="prenom"
                :class="{ 'is-invalid': submitted && !event.task }"
              />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>
          <BCol lg="6">
            <label for="createName-field" class="form-label">Email</label>
            <input
              type="text"
              id="email"
              class="form-control"
              v-model="email"
              :class="{ 'is-invalid': submitted && !event.creater }"
            />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>

          <BCol lg="6">
            <label for="ticket-status" class="form-label">Profil</label>
            <select v-model="profil_id" class="form-control">
              <option
                v-for="(task, index) of allProfils"
                :key="index"
                :value="task.id_profil"
              >
                {{ task.libelle_profil }}
              </option>
            </select>
            <div class="invalid-feedback">Please select a status.</div>
          </BCol>
          <BCol lg="6">
            <label for="ticket-status" class="form-label">Unite de gestion</label>
            <select v-model="unite_gest" class="form-control">
              <option
                v-for="(option, index) of allUnite"
                :key="index"
                :value="option.code_unite_gestion"
              >
                {{ option.nom_unite_gestion }}
              </option>
            </select>
            <div class="invalid-feedback">Please select a status.</div>
          </BCol>
          <BCol lg="6">
            <label for="priority-field" class="form-label">Partenaire</label>
            <select v-model="partenaire" class="form-control">
              <option
                v-for="(option, index) of allPartenaire"
                :key="index"
                :value="option.code_partenaire"
              >
                {{ option.sigle_partenaire }}
              </option>
            </select>
            <div class="invalid-feedback">Please select a priority.</div>
          </BCol>
        </BRow>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton
            type="button"
            variant="light"
            @click="
              taskListModal = false;
              clean();
            "
            id="closemodal"
          >
            Fermer
          </BButton>
          <BButton
            type="submit"
            variant="success"
            style="background-color: #285e43"
            id="add-btn"
            @click="performAction()"
          >
            {{ dataEdit ? "Modifier" : "Ajouter" }}
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
          <h4>Etes vous sur?</h4>
          <p class="text-muted mx-4 mb-0">
            etes vous sur de vouloir supprimer cet element ?
          </p>
        </div>
      </div>
      <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
        <button type="button" class="btn w-sm btn-light" @click="deleteModal = false">
          Fermer
        </button>
        <button
          type="button"
          class="btn w-sm btn-danger"
          id="delete-record"
          @click="deleteUser"
        >
          Supprimer
        </button>
      </div>
    </BModal>
  </Layout>
</template>
