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
      taskListDi: false,

      date3: null,
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
      data: [],
      id: "",
      code: "",
      intitule: "",
      code_parent: "",
      searchQuery: null,
      searchQuery1: null,
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
            data.code_direction_service.toLowerCase().includes(search) ||
            data.intitule_direction_service.toLowerCase().includes(search) ||
            data.code_parent_direction_service.toLowerCase().includes(search)
          );
        });
      } else {
        return this.displayedPosts;
      }
    },
    resultQuery1() {
      if (this.searchQuery1) {
        const search = this.searchQuery1.toLowerCase();
        return this.data.filter((data) => {
          return (
            data.code_direction_service.toLowerCase().includes(search) ||
            data.intitule_direction_service.toLowerCase().includes(search) ||
            data.code_parent_direction_service.toLowerCase().includes(search)
          );
        });
      } else {
        return this.data;
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
    this.getDirection();
  },

  methods: {
    getDirection() {
      axios
        .get(
          "https://ssise-cosit.com/api-ssise/planDirection/getAllPlanDirectionService"
        )
        .then(
          function (response) {
            this.allTask = response.data.data;
            console.log(response.data.data);
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    async insertDirection() {
      try {
        await axios.post(
          "https://ssise-cosit.com/api-ssise/planDirection/insert",
          {
            code_direction_service: this.code,
            intitule_direction_service: this.intitule,
            code_parent_direction_service: this.code_parent,
          }
        );
        this.getDirection();
        this.clean();
        this.taskListModal = false;
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    async modifDirection() {
      try {
        await axios.post(
          "https://ssise-cosit.com/api-ssise/planDirection/update",
          {
            id_direction_service: this.id,
            code_direction_service: this.code,
            intitule_direction_service: this.intitule,
            code_parent_direction_service: this.code_parent,
          }
        );
        this.getDirection();
        this.clean();
        this.taskListModal = false;
        console.log(this.id_user);
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
        console.log(this.id_user);
      }
    },
    recup(id) {
      for (let u of this.allTask) {
        if (u.id_direction_service === id) {
          this.id = u.id_direction_service;
          this.code = u.code_direction_service;
          this.intitule = u.intitule_direction_service;
          this.code_parent = u.code_parent_direction_service;
        }
      }
    },

    async deleteUser() {
      try {
        await axios
          .delete(
            "https://ssise-cosit.com/api-ssise/planDirection/delete",
            {
              data: { id_direction_service: this.id },
            }
          )
          .then((response) => {
            console.log(response);
            this.getDirection();
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
        this.modifDirection();
      } else {
        this.insertDirection();
      }
    },
    enfantDi(id) {
      for (let e of this.allTask) {
        if (e.code_parent_direction_service == id) {
          this.data.push(e);
        }
      }
    },
    net() {
      this.data = [];
    },
    clean() {
      this.id = "";
      this.code = "";
      this.intitule = "";
      this.code_parent = "";
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
                item._id.toString() == data._id.toString()
                  ? { ...item, ...data }
                  : item
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
    <PageHeader title="Directions" pageTitle="Paramétrages" />

    <BRow>
      <BCol lg="12">
        <BCard no-body id="tasksList">
          <BCardHeader class="border-0">
            <div class="d-flex align-items-center">
              <h5 class="card-title mb-0 flex-grow-1">Les directions</h5>
              <div class="flex-shrink-0">
                <div class="d-flex flex-wrap gap-2">
                  <BButton variant="secondary" class="me-1" id="remove-actions">
                    <i class="ri-delete-bin-2-line"></i>
                  </BButton>
                  <BButton
                    @click="toggleModal"
                    style="background-color: #285e43"
                  >
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
                      @click="onSort('code_direction_service')"
                    >
                      Code
                    </th>
                    <th
                      class="sort"
                      data-sort="project_name"
                      @click="onSort('intitule_direction_service')"
                    >
                      Intitulé
                    </th>

                    <th
                      class="sort"
                      data-sort="priority"
                      @click="onSort('intitule_direction_service')"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="list form-check-all">
                  <tr v-for="(task, index) of resultQuery" :key="index">
                    <td
                      class="id"
                      @click="
                        taskListDi = true;
                        enfantDi(task.code_direction_service);
                      "
                    >
                      {{ task.code_direction_service }}
                    </td>
                    <td
                      class="project_name"
                      @click="
                        taskListDi = true;
                        enfantDi(task.code_direction_service);
                      "
                    >
                      <router-link
                        to="/apps/projects-overview"
                        class="fw-medium link-primary"
                        >{{ task.intitule_direction_service }}
                      </router-link>
                    </td>

                    <td class="due_date">
                      <span
                        @click="
                          editDetails();
                          recup(task.id_direction_service);
                        "
                      >
                        <i
                          class="ri-pencil-fill align-bottom me-2 text-muted"
                        ></i>
                      </span>
                      <span
                        @click="deleteModalToggle(task.id_direction_service)"
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
                  <h5 class="mt-2">Sorry! No Result Found</h5>
                  <p class="text-muted mb-0">
                    We've searched more than 200k+ tasks We did not find any
                    tasks for you search.
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
    <BModal
      v-model="taskListDi"
      id="showmodal"
      modal-class="zoomIn"
      hide-footer
      header-class="p-3 bg-info-subtle taskModal"
      class="v-modal-custom"
      centered
      size="lg"
      :title="'Directions'"
      @hide="net"
    >
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <div class="table-responsive table-card mb-4">
          <div class="search-box" style="margin: 10px">
            <input
              type="text"
              class="form-control search bg-light border-light"
              placeholder="Search for tasks or something..."
              v-model="searchQuery1"
            />
            <i class="ri-search-line search-icon"></i>
          </div>

          <table class="table align-middle table-nowrap mb-0" id="tasksTable">
            <thead class="table-light text-muted">
              <tr>
                <th
                  class="sort"
                  data-sort="id"
                  @click="onSort('code_direction_service')"
                >
                  Code
                </th>
                <th
                  class="sort"
                  data-sort="project_name"
                  @click="onSort('intitule_direction_service')"
                >
                  Intitulé
                </th>

                <th
                  class="sort"
                  data-sort="priority"
                  @click="onSort('intitule_direction_service')"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="list form-check-all">
              <tr v-for="(task, index) of resultQuery1" :key="index">
                <td class="id">
                  <router-link
                    to="/apps/tasks-details"
                    class="fw-medium link-primary"
                    >{{ task.code_direction_service }}
                  </router-link>
                </td>
                <td class="project_name">
                  <router-link
                    to="/apps/projects-overview"
                    class="fw-medium link-primary"
                    >{{ task.intitule_direction_service }}
                  </router-link>
                </td>

                <td class="due_date">
                  <span
                    @click="
                      editDetails();
                      recup(task.id_direction_service);
                    "
                  >
                    <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  </span>
                  <span @click="deleteModalToggle(task.id_direction_service)">
                    <i
                      class="ri-delete-bin-fill align-bottom me-2 text-muted"
                    ></i>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton
            type="button"
            variant="light"
            @click="
              taskListDi = false;
              net();
              clean();
            "
            id="closemodal"
          >
            Fermer
          </BButton>
        </div>
      </b-form>
    </BModal>
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
      @hide="clean"
    >
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <BRow class="g-3">
          <BCol lg="6">
            <label for="projectName-field" class="form-label">Code</label>
            <input
              type="text"
              id="code"
              class="form-control"
              v-model="code"
              :class="{ 'is-invalid': submitted && !event.project }"
            />
            <div class="invalid-feedback">Please enter a project name.</div>
          </BCol>
          <BCol lg="6">
            <div>
              <label for="tasksTitle-field" class="form-label">Intitulé</label>
              <input
                type="text"
                id="intitule"
                class="form-control"
                v-model="intitule"
                :class="{ 'is-invalid': submitted && !event.task }"
              />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>

          <BCol lg="6">
            <label for="ticket-status" class="form-label"
              >Direction principale</label
            >
            <select v-model="code_parent" class="form-control">
              <option
                v-for="option in allTask"
                :key="option.code_parent_direction_service"
                :value="option.code_parent_direction_service"
              >
                {{ option.intitule_direction_service }}
              </option>
            </select>
            <div class="invalid-feedback">Please select a status.</div>
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
          @click="deleteUser"
        >
          Supprimer
        </button>
      </div>
    </BModal>
  </Layout>
</template>
