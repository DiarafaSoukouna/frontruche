<script>
// import { CountTo } from "vue3-count-to";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
// import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
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
      rangeDateconfig: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: "M j, Y",
        altInput: true,
        dateFormat: "d M, Y",
        mode: "range",
        teste: "",
        code: "",
        sigle: "",
        definition: "",
        contact: "",
        email: "",
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
        search1: "",
        recherche: "",
        all: "",
      },
      //
    };
  },
  components: {
    Layout,
    PageHeader,
    lottie: Lottie,
    Multiselect,
    // flatPickr,
    // simplebar,
  },
  computed: {
    filteredList() {
      if (!this.searchQuery) {
        return this.all;
      } else {
        return this.all.filter(
          (item) =>
            item.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.client.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    getAllList() {
      return this.all;
    },
    displayedPosts() {
      return this.paginate(this.allTask);
    },
    resultQuery() {
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        return this.displayedPosts.filter((data) => {
          return (
            data.taskId.toLowerCase().includes(search) ||
            data.task.toLowerCase().includes(search) ||
            data.project.toLowerCase().includes(search) ||
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
    this.setPages();
  },
  filters: {
    trimWords(value) {
      return value.split(" ").splice(0, 20).join(" ") + "...";
    },
  },
  beforeMount() {
    axios
      .get("https://api-node.themesbrand.website/apps/task")
      .then((data) => {
        this.allTask = [];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        data.data.data.forEach((row) => {
          var dd = new Date(row.dueDate);
          row.dueDate =
            dd.getDate() +
            " " +
            monthNames[dd.getMonth()] +
            ", " +
            dd.getFullYear();
          row.subItem.forEach((imag) => {
            imag.image_src =
              "https://api-node.themesbrand.website/images/users/" + imag.img;
          });

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
    async getNote() {
      try {
        const response = await axios.get("http://localhost:3000/getDomaine");
        this.all = response.data;
        console.log(response);
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    async insertPat() {
      try {
        const response = await axios.post(
          "https://ssise-cosit.com/api-ssise/partenaire/insert",
          {
            code_partenaire: this.code,
            sigle_partenaire: this.sigle,
            definition_partenaire: this.definition,
            contact_partenaire: this.contact,
            email_partenaire: this.email,
            geler_partenaire: 0,
            idusrcreation: 1,
          }
        );
        console.log(response);
        this.getNote();
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    performAction() {
      if (this.dataEdit) {
        this.getNote();
      } else {
        this.insertPat();
      }
    },
    async change() {
      this.all = this.all.filter((x) => x.id_domaine === 3);
      console.log(this.all);
    },
    async test() {
      if (this.searchQuery) {
        this.all = this.all.filter(
          (item) =>
            item.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.client.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
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

    editDetails(data) {
      this.dataEdit = true;
      this.taskListModal = true;
      this.event = { ...data };

      this.submitted = false;
    },

    toggleModal() {
      this.taskListModal = true;
      this.dataEdit = false;
      this.event = {};

      this.submitted = false;
    },

    deleteModalToggle() {
      this.deleteModal = true;
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
  },
  mounted() {
    this.getNote();
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
                    variant="danger"
                    class="add-btn"
                    @click="toggleModal"
                  >
                    <i class="ri-add-line align-bottom me-1"></i> Nouveau
                  </BButton>
                </div>
              </div>
            </div>
            <BCardBody>
              <BTabs nav-class="mb-3">
                <BTab title="Product" active>
                  <BCardBody
                    class="border border-dashed border-end-0 border-start-0"
                  >
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
                              @click="onSort('taskId')"
                            >
                              ID
                            </th>
                            <th
                              class="sort"
                              data-sort="project_name"
                              @click="onSort('project')"
                            >
                              Project
                            </th>
                            <th
                              class="sort"
                              data-sort="tasks_name"
                              @click="onSort('task')"
                            >
                              Task
                            </th>
                            <th
                              class="sort"
                              data-sort="client_name"
                              @click="onSort('creater')"
                            >
                              Created By
                            </th>
                            <th
                              class="sort"
                              data-sort="assignedto"
                              @click="onSort('subItem')"
                            >
                              Assigned To
                            </th>
                            <th
                              class="sort"
                              data-sort="due_date"
                              @click="onSort('dueDate')"
                            >
                              Due Date
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
                          <tr v-for="task of filteredList" :key="task.id">
                            <td class="id">
                              <router-link
                                to="/apps/tasks-details"
                                class="fw-medium link-primary"
                                >{{ task.nom }}
                              </router-link>
                            </td>
                            <td class="project_name">
                              <router-link
                                to="/apps/projects-overview"
                                class="fw-medium link-primary"
                                >{{ task.id }}
                              </router-link>
                            </td>
                            <td>
                              <div class="d-flex">
                                <div class="flex-grow-1 tasks_name">
                                  {{ task.prix_annuel }}
                                </div>
                              </div>
                            </td>
                            <td class="client_name">{{ task.client }}</td>
                            <td class="assignedto">
                              <div class="avatar-group">
                                {{ task.date_creation }}
                              </div>
                            </td>
                            <td class="due_date">
                              {{ task.date_expiration }}
                            </td>
                            <td class="due_date">
                              <span @click="editDetails(task)">
                                <i
                                  class="ri-pencil-fill align-bottom me-2 text-muted"
                                ></i>
                              </span>
                              <button @click="deleteModal = true">
                                <i
                                  class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                ></i>
                                {{ deleteModal }}
                              </button>
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
                            We've searched more than 200k+ tasks We did not find
                            any tasks for you search.
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
                  </BCardBody></BTab
                >
                <BTab title="Messages" @click="change()">
                  <BCardBody
                    class="border border-dashed border-end-0 border-start-0"
                  >
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
                            <th scope="col" style="width: 40px">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="checkAll"
                                  value="option"
                                />
                              </div>
                            </th>
                            <th
                              class="sort"
                              data-sort="id"
                              @click="onSort('taskId')"
                            >
                              ID
                            </th>
                            <th
                              class="sort"
                              data-sort="project_name"
                              @click="onSort('project')"
                            >
                              Project
                            </th>
                            <th
                              class="sort"
                              data-sort="tasks_name"
                              @click="onSort('task')"
                            >
                              Task
                            </th>
                            <th
                              class="sort"
                              data-sort="client_name"
                              @click="onSort('creater')"
                            >
                              Created By
                            </th>
                            <th
                              class="sort"
                              data-sort="assignedto"
                              @click="onSort('subItem')"
                            >
                              Assigned To
                            </th>
                            <th
                              class="sort"
                              data-sort="due_date"
                              @click="onSort('dueDate')"
                            >
                              Due Date
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
                          <tr v-for="task of filteredList" :key="task.id">
                            <th scope="row">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  name="chk_child"
                                  value="option1"
                                />
                              </div>
                            </th>
                            <td class="id">
                              <router-link
                                to="/apps/tasks-details"
                                class="fw-medium link-primary"
                                >{{ task.nom }}
                              </router-link>
                            </td>
                            <td class="project_name">
                              <router-link
                                to="/apps/projects-overview"
                                class="fw-medium link-primary"
                                >{{ task.id }}
                              </router-link>
                            </td>
                            <td>
                              <div class="d-flex">
                                <div class="flex-grow-1 tasks_name">
                                  {{ task.prix_annuel }}
                                </div>
                              </div>
                            </td>
                            <td class="client_name">{{ task.client }}</td>
                            <td class="assignedto">
                              <div class="avatar-group">
                                {{ task.date_creation }}
                              </div>
                            </td>
                            <td class="due_date">{{ task.date_expiration }}</td>
                            <td class="due_date">
                              <span @click="editDetails(task)">
                                <i
                                  class="ri-pencil-fill align-bottom me-2 text-muted"
                                ></i>
                              </span>
                              <span>
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
                            We've searched more than 200k+ tasks We did not find
                            any tasks for you search.
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
                  </BCardBody></BTab
                >
                <BTab title="Settings">
                  <BCardBody
                    class="border border-dashed border-end-0 border-start-0"
                  >
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
                            <th scope="col" style="width: 40px">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="checkAll"
                                  value="option"
                                />
                              </div>
                            </th>
                            <th
                              class="sort"
                              data-sort="id"
                              @click="onSort('taskId')"
                            >
                              ID
                            </th>
                            <th
                              class="sort"
                              data-sort="project_name"
                              @click="onSort('project')"
                            >
                              Project
                            </th>
                            <th
                              class="sort"
                              data-sort="tasks_name"
                              @click="onSort('task')"
                            >
                              Task
                            </th>
                            <th
                              class="sort"
                              data-sort="client_name"
                              @click="onSort('creater')"
                            >
                              Created By
                            </th>
                            <th
                              class="sort"
                              data-sort="assignedto"
                              @click="onSort('subItem')"
                            >
                              Assigned To
                            </th>
                            <th
                              class="sort"
                              data-sort="due_date"
                              @click="onSort('dueDate')"
                            >
                              Due Date
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
                          <tr v-for="task of filteredList" :key="task.id">
                            <th scope="row">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  name="chk_child"
                                  value="option1"
                                />
                              </div>
                            </th>
                            <td class="id">
                              <router-link
                                to="/apps/tasks-details"
                                class="fw-medium link-primary"
                                >{{ task.nom }}
                              </router-link>
                            </td>
                            <td class="project_name">
                              <router-link
                                to="/apps/projects-overview"
                                class="fw-medium link-primary"
                                >{{ task.id }}
                              </router-link>
                            </td>
                            <td>
                              <div class="d-flex">
                                <div class="flex-grow-1 tasks_name">
                                  {{ task.prix_annuel }}
                                </div>
                              </div>
                            </td>
                            <td class="client_name">{{ task.client }}</td>
                            <td class="assignedto">
                              <div class="avatar-group">
                                {{ task.date_creation }}
                              </div>
                            </td>
                            <td class="due_date">{{ task.date_expiration }}</td>
                            <td class="due_date">
                              <span @click="editDetails(task)">
                                <i
                                  class="ri-pencil-fill align-bottom me-2 text-muted"
                                ></i>
                              </span>
                              <span>
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
                            We've searched more than 200k+ tasks We did not find
                            any tasks for you search.
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
                  </BCardBody></BTab
                >
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
                v-model="code"
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
                  v-model="sigle"
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
                v-model="definition"
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
                v-model="contact"
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
                v-model="email"
                :class="{ 'is-invalid': submitted && !event.creater }"
              />
              <div class="invalid-feedback">Please enter a client name.</div>
            </BCol>
          </div>
          <div
            style="justify-content: space-between; display: flex; margin: 5px"
          >
            <BCol lg="6" style="margin-right: 10px">
              <label for="ticket-status" class="form-label">Point focal</label>
              <Multiselect
                id="statusid"
                :close-on-select="true"
                :searchable="true"
                :create-option="true"
                :options="[
                  { value: '', label: 'Status' },
                  { value: 'New', label: 'New' },
                  { value: 'Inprogress', label: 'Inprogress' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Completed', label: 'Completed' },
                ]"
                v-model="event.status"
                :class="{ 'is-invalid': submitted && !event.status }"
              />
              <div class="invalid-feedback">Please select a status.</div>
            </BCol>
            <BCol lg="6">
              <label for="createName-field" class="form-label"
                >Lien cartographique</label
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
          <BCol lg="12">
            <label for="priority-field" class="form-label">Description</label>
            <textarea
              name="description"
              class="form-control"
              id="description"
              cols="50"
              rows="3"
            ></textarea>
            <div class="invalid-feedback">Please select a priority.</div>
          </BCol>
        </BRow>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton
            type="button"
            variant="light"
            @click="taskListModal = false"
            id="closemodal"
          >
            Close
          </BButton>
          <BButton
            type="submit"
            variant="success"
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
          <h4>Are you sure ?</h4>
          <p class="text-muted mx-4 mb-0">
            Are you sure you want to remove this record ?
          </p>
        </div>
      </div>
      <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
        <button
          type="button"
          class="btn w-sm btn-light"
          @click="deleteModal = false"
        >
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
