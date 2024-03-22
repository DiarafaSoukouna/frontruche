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
// import authService from "authService.js";

// import simplebar from "simplebar-vue";
export default {
  data() {
    return {
      taskListModal: false,
      type: false,
      date3: null,
      extyp: false,
      rangeDateconfig: {
        wrap: true,
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
        mode: "range",

        // typPat: "",
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
      typPat: [],
      searchQuery: null,
      all: "",
      id: "",
      id_partenaire: "",
      code_partenaire: "",
      sigle_partenaire: "",
      definition_partenaire: "",
      contact_partenaire: "",
      email_partenaire: "",
      logo_partenaire: "",
      type_partenaire: "",
      libelle_type: "",
      id_type: "",

      typ: "",
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
      dataEditTyp: false,
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
    // authService,
    // flatPickr,
    // simplebar,
  },
  computed: {
    generateTitle(tab) {
      return `<i class="ri-pencil-fill align-bottom me-2 text-muted"></i>${tab.libelle_pat}`;
    },
    displayedPosts() {
      return this.paginate(this.allTask);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
            data.sigle_partenaire.toLowerCase().includes(search) ||
            data.contact_partenaire.toLowerCase().includes(search) ||
            data.definition_partenaire.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
    typPatOptions() {
      return this.typPat.map((option) => ({
        value: option.type_partenaire,
        label: option.libelle_pat,
      }));
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
    this.getPartenaire();
    this.getTypePat();
  },

  methods: {
    async getPartenaire() {
      const headers = this.getHeaders();
      try {
        const response = await axios.get(
          "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/partenaire/getAllPartenaire",
          { headers: headers }
        );
        this.allTask = response.data.data;
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la requête GET :", error);
      }
    },
    async getTypePat() {
      const headers = this.getHeaders();
      try {
        const response = await axios.get(
          "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/typePartenaire/getAllTypePartenaire",
          { headers: headers }
        );
        this.typPat = response.data.data;

        console.log(this.typPat);
      } catch (error) {
        console.error("Erreur lors de la requête GET :", error);
      }
    },
    getHeaders() {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      };
    },
    async insertPartenaire() {
      try {
        await axios
          .post(
            "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/partenaire/insert",
            {
              code_partenaire: this.code_partenaire,
              sigle_partenaire: this.sigle_partenaire,
              definition_partenaire: this.definition_partenaire,
              contact_partenaire: this.contact_partenaire,
              email_partenaire: this.email_partenaire,
              // logo_partenaire: "",
              type_partenaire: this.type_partenaire,
            }
          )
          .then((response) => {
            console.log(response);
            this.getPartenaire();
            this.clean();
            this.taskListModal = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    async updatePartenaire() {
      try {
        await axios
          .post(
            "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/partenaire/update",
            {
              code_partenaire: this.code_partenaire,
              sigle_partenaire: this.sigle_partenaire,
              definition_partenaire: this.definition_partenaire,
              contact_partenaire: this.contact_partenaire,
              email_partenaire: this.email_partenaire,
              // logo_partenaire: "",
              type_partenaire: this.type_partenaire,
              id_partenaire: this.id_partenaire,
            }
          )
          .then((response) => {
            console.log(response);
            this.getPartenaire();
            this.clean();
            this.taskListModal = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
        console.log("exampleeeee", this.id_partenaire);
      }
    },
    clean() {
      this.code_partenaire = "";
      this.sigle_partenaire = "";
      this.definition_partenaire = "";
      this.contact_partenaire = "";
      this.email_partenaire = "";
      this.type_partenaire = "";
      this.id_partenaire = "";
    },
    async insertTypPat() {
      try {
        await axios
          .post(
            "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/typePartenaire/insert",
            {
              libelle_pat: this.libelle_type,
            }
          )
          .then((response) => {
            console.log(response);
            this.getTypePat();
            this.type = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    async updateTypPat() {
      try {
        await axios
          .post(
            "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/typePartenaire/update",
            {
              id_type_pat: this.id_type,
              libelle_pat: this.libelle_type,
            }
          )
          .then((response) => {
            console.log(response);
            this.getTypePat();
            this.type = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    performAction() {
      if (this.dataEdit) {
        this.updatePartenaire();
      } else {
        this.insertPartenaire();
      }
    },
    performActionTyp() {
      if (this.dataEditTyp) {
        this.updateTypPat();
      } else {
        this.insertTypPat();
      }
    },
    async deletePartenaire() {
      try {
        await axios
          .delete(
            "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/partenaire/delete",
            {
              data: { id_partenaire: this.id },
            }
          )
          .then((response) => {
            console.log(response);
            this.getPartenaire();
            this.id = "";
            this.deleteModal = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
        console.log(this.id);
      }
    },
    async deleteTypPat() {
      try {
        await axios
          .delete(
            "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/typePartenaire/delete",
            {
              data: { id_type_pat: this.id },
            }
          )
          .then((response) => {
            console.log(response);
            this.getTypePat();
            this.id = "";
            this.deleteModal = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
        console.log(this.id);
      }
    },

    recup(id) {
      for (let u of this.allTask) {
        if (u.id_partenaire === id) {
          this.code_partenaire = u.code_partenaire;
          this.sigle_partenaire = u.sigle_partenaire;
          this.definition_partenaire = u.definition_partenaire;
          this.contact_partenaire = u.contact_partenaire;
          this.email_partenaire = u.email_partenaire;
          this.type_partenaire = u.type_partenaire;
          this.id_partenaire = u.id_partenaire;
        }
      }
      console.log(this.allTask);
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
      this.event = { ...data };

      this.submitted = false;
    },
    editTyp() {
      this.dataEditTyp = true;
      this.type = true;

      this.submitted = false;
    },
    recupTyp(id) {
      for (let f of this.typPat) {
        if (f.id_type_pat == id) {
          this.libelle_type = f.libelle_pat;
          this.id_type = f.id_type_pat;
        }
      }
    },
    toggleModal() {
      this.taskListModal = true;
      this.dataEdit = false;
      this.event = {};

      this.submitted = false;
    },
    modalType() {
      this.type = true;
    },
    cleanTyp() {
      this.libelle_type = "";
    },
    deleteModalToggle(id) {
      this.deleteModal = true;
      this.id = id;
    },
    deletes() {
      if (this.extyp) {
        this.deletePartenaire();
      } else {
        this.deleteTypPat();
      }
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
    console.log("test", this.typPat);
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
    <PageHeader title="Partenaires" pageTitle="Paramétrages" />

    <BRow>
      <BCol lg="12">
        <BCard no-body id="tasksList">
          <BCardHeader class="border-0">
            <div class="d-flex align-items-center">
              <h5 class="card-title mb-0 flex-grow-1">Tous les partenaires</h5>
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
                  <BButton
                    style="background-color: #285e43"
                    @click="toggleModal"
                  >
                    <i class="ri-add-line align-bottom me-1"></i> Partenaire
                  </BButton>
                  <BButton style="background-color: #285e43" @click="modalType">
                    <i class="ri-add-line align-bottom me-1"></i> Type
                    partenaire
                  </BButton>
                </div>
              </div>
            </div>
            <BCardBody>
              <BTabs nav-class="mb-3">
                <BTab
                  v-for="(tab, index) in typPat"
                  :key="index"
                  :title="tab.libelle_pat"
                  :active="index === 1"
                >
                  <BCardBody
                    class="border border-dashed border-end-0 border-start-0"
                  >
                    <BButton
                      @click="
                        editTyp();
                        recupTyp(tab.id_type_pat);
                      "
                      style="
                        background-color: #ea9600;
                        border: none;
                        margin-bottom: 15px;
                      "
                    >
                      <i class="ri-pencil-fill"></i>
                      {{ tab.libelle_pat }}
                    </BButton>
                    <BButton
                      style="
                        background-color: #ea9600;
                        margin-bottom: 15px;
                        border: none;
                        margin-left: 10px;
                      "
                      @click="deleteModalToggle(tab.id_type_pat)"
                    >
                      <i class="ri-delete-bin-fill"></i>
                      {{ tab.libelle_pat }}
                    </BButton>
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
                      <table
                        class="table align-middle table-nowrap mb-0"
                        id="tasksTable"
                      >
                        <thead class="table-light text-muted">
                          <tr>
                            <th
                              class="sort"
                              data-sort="id"
                              @click="onSort('code_partenaire')"
                            >
                              Code
                            </th>
                            <th
                              class="sort"
                              data-sort="project_name"
                              @click="onSort('sigle_partenaire')"
                            >
                              Sigle
                            </th>
                            <th
                              class="sort"
                              data-sort="tasks_name"
                              @click="onSort('contact_partenaire')"
                            >
                              Contact
                            </th>
                            <th
                              class="sort"
                              data-sort="client_name"
                              @click="onSort('definition_partenaire')"
                            >
                              Definition
                            </th>
                            <th
                              class="sort"
                              data-sort="assignedto"
                              @click="onSort('email_partenaire')"
                            >
                              Email
                            </th>
                            <th
                              class="sort"
                              data-sort="due_date"
                              @click="onSort('dueDate')"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody class="list form-check-all">
                          <tr v-for="(task, index) of resultQuery" :key="index">
                            <td
                              class="id"
                              v-if="task.type_partenaire === tab.id_type_pat"
                            >
                              <router-link
                                to="/apps/tasks-details"
                                class="fw-medium link-primary"
                                >{{ task.code_partenaire }}
                              </router-link>
                            </td>
                            <td
                              class="project_name"
                              v-if="task.type_partenaire === tab.id_type_pat"
                            >
                              <router-link
                                to="/apps/projects-overview"
                                class="fw-medium link-primary"
                                >{{ task.sigle_partenaire }}
                              </router-link>
                            </td>
                            <td v-if="task.type_partenaire === tab.id_type_pat">
                              <div class="d-flex">
                                <div class="flex-grow-1 tasks_name">
                                  {{ task.contact_partenaire }}
                                </div>
                              </div>
                            </td>
                            <td
                              class="client_name"
                              v-if="task.type_partenaire === tab.id_type_pat"
                            >
                              {{ task.definition_partenaire }}
                            </td>
                            <td
                              class="assignedto"
                              v-if="task.type_partenaire === tab.id_type_pat"
                            >
                              <div class="avatar-group">
                                {{ task.email_partenaire }}
                              </div>
                            </td>

                            <td
                              class="due_date"
                              v-if="task.type_partenaire === tab.id_type_pat"
                            >
                              <span
                                @click="
                                  editDetails(task);
                                  recup(task.id_partenaire);
                                "
                              >
                                <i
                                  class="ri-pencil-fill align-bottom me-2 text-muted"
                                ></i>
                              </span>
                              <span
                                @click="
                                  extyp = true;
                                  deleteModalToggle(task.id_partenaire);
                                "
                              >
                                <i
                                  class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                ></i>
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

                    <div
                      class="d-flex justify-content-end"
                      v-if="resultQuery.length >= 1"
                    >
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
                            <BLink
                              class="page"
                              href="#"
                              data-i="1"
                              data-page="8"
                              >{{ pageNumber }}</BLink
                            >
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
                </BTab>
              </BTabs>
            </BCardBody>
          </BCardHeader>
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
          <div
            style="justify-content: space-between; display: flex; margin: 5px"
          >
            <BCol lg="6" style="margin-right: 10px">
              <label for="projectName-field" class="form-label">Code</label>
              <input
                type="text"
                id="projectName"
                class="form-control"
                placeholder="Code"
                v-model="code_partenaire"
                :class="{ 'is-invalid': submitted && !event.project }"
              />
              <div class="invalid-feedback">Please enter a project name.</div>
            </BCol>
            <BCol lg="6">
              <div>
                <label for="tasksTitle-field" class="form-label">Sigle</label>
                <input
                  type="text"
                  id="tasksTitle"
                  class="form-control"
                  placeholder="Title"
                  v-model="sigle_partenaire"
                  :class="{ 'is-invalid': submitted && !event.task }"
                />
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
            </BCol>
          </div>
          <div
            style="justify-content: space-between; display: flex; margin: 5px"
          >
            <BCol lg="6" style="margin-right: 10px">
              <label for="createName-field" class="form-label"
                >Definition</label
              >
              <input
                type="text"
                id="createName"
                class="form-control"
                placeholder="Client name"
                v-model="definition_partenaire"
                :class="{ 'is-invalid': submitted && !event.creater }"
              />
              <div class="invalid-feedback">Please enter a client name.</div>
            </BCol>
            <BCol lg="6">
              <label for="createName-field" class="form-label">Contact</label>
              <input
                type="text"
                id="createName"
                class="form-control"
                placeholder="Contact"
                v-model="contact_partenaire"
                :class="{ 'is-invalid': submitted && !event.creater }"
              />
              <div class="invalid-feedback">Please enter a client name.</div>
            </BCol>
          </div>
          <div
            style="justify-content: space-between; display: flex; margin: 5px"
          >
            <BCol lg="6" style="margin-right: 10px">
              <label for="createName-field" class="form-label">Site web</label>
              <input
                type="text"
                id="createName"
                class="form-control"
                placeholder="Site web"
                v-model="event.creater"
                :class="{ 'is-invalid': submitted && !event.creater }"
              />
              <div class="invalid-feedback">Please enter a client name.</div>
            </BCol>
            <BCol lg="6">
              <label for="createName-field" class="form-label">Email</label>
              <input
                type="text"
                id="createName"
                class="form-control"
                placeholder="Email"
                v-model="email_partenaire"
                :class="{ 'is-invalid': submitted && !event.creater }"
              />
              <div class="invalid-feedback">Please enter a client name.</div>
            </BCol>
          </div>
          <div
            style="justify-content: space-between; display: flex; margin: 5px"
          >
            <BCol lg="6" style="margin-right: 10px">
              <label for="ticket-status" class="form-label"
                >Type Partenaire</label
              >
              <select v-model="type_partenaire" class="form-control">
                <option
                  v-for="option in typPat"
                  :key="option.id_type_pat"
                  :value="option.id_type_pat"
                >
                  {{ option.libelle_pat }}
                </option>
              </select>
              <div class="invalid-feedback">Please select a status.</div>
            </BCol>
            <BCol lg="6">
              <label for="createName-field" class="form-label"
                >logo_partenaire</label
              >
              <input
                type="text"
                id="createName"
                class="form-control"
                placeholder="Site web"
                v-model="event.creater"
                :class="{ 'is-invalid': submitted && !event.creater }"
              />
              <div class="invalid-feedback">Please enter a client name.</div>
            </BCol>
          </div>
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
            Close
          </BButton>
          <BButton
            type="submit"
            variant="success"
            id="add-btn"
            style="background-color: #285e43"
            @click="performAction()"
          >
            {{ dataEdit ? "Modifier" : "Ajouter" }}
          </BButton>
        </div>
      </b-form>
    </BModal>
    <BModal
      v-model="type"
      id="showmodal1"
      modal-class="zoomIn"
      hide-footer
      header-class="p-3 bg-info-subtle taskModal"
      class="v-modal-custom"
      centered
      size="lg"
      :title="dataEditTyp ? 'Modifier' : 'Ajouter'"
    >
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <BRow class="g-3">
          <BCol lg="12" style="margin-right: 10px">
            <label for="projectName-field" class="form-label">Libellé</label>
            <input
              type="text"
              id="projectName"
              class="form-control"
              placeholder="libelle"
              v-model="libelle_type"
              :class="{ 'is-invalid': submitted && !event.project }"
            />
            <div class="invalid-feedback">Please enter a project name.</div>
          </BCol>
        </BRow>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton
            type="button"
            variant="light"
            @click="
              type = false;
              cleanTyp();
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
            @click="performActionTyp()"
          >
            {{ dataEditTyp ? "Modifier" : "Ajouter" }}
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
        <button
          type="button"
          class="btn w-sm btn-light"
          @click="deleteModal = false"
        >
          Fermer
        </button>
        <button
          type="button"
          class="btn w-sm btn-danger"
          id="delete-record"
          @click="deletes()"
        >
          Supprimer
        </button>
      </div>
    </BModal>
  </Layout>
</template>
<style>
.co {
  color: #fff;
}
</style>
