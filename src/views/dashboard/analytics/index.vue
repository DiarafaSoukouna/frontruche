<script>
// import { CountTo } from "vue3-count-to";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Swal from "sweetalert2";
import axios from "axios";
import animationData from "@/components/widgets/msoeawqm.json";
import animationData1 from "@/components/widgets/gsqxdxog.json";
import Lottie from "@/components/widgets/lottie.vue";
import simplebar from "simplebar-vue";
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
      },
      //
    };
  },
  components: {
    Layout,
    PageHeader,
    lottie: Lottie,
    Multiselect,
    flatPickr,
    simplebar,
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
      .get("https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/localite/getAllLocalite")
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
            .post(`https://cors-proxy.fringe.zone/http://ssise-cosit.com/api-ssise/localite/getAllLocalite`, data)
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
    <PageHeader title="Localités" pageTitle="Paramétrages" />

    <BRow>
      <BCol lg="12">
        <BCard no-body id="tasksList">
          <BCardHeader class="border-0">
            <div class="d-flex align-items-center">
              <h5 class="card-title mb-0 flex-grow-1">All Tasks</h5>
              <div class="flex-shrink-0">
                <div class="d-flex flex-wrap gap-2">
                  <BButton variant="secondary" class="me-1" id="remove-actions" @click="deleteMultiple">
                    <i class="ri-delete-bin-2-line"></i>
                  </BButton>
                
                  <BButton variant="success" class="add-btn" @click="toggleModal">
                    <i class="ri-add-line align-bottom me-1"></i> Ajouter région
                  </BButton>

                </div>
              </div>
            </div>
          </BCardHeader>
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
            <BTabs nav-class="mb-3">
              <BTab title="Product" active>
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
                  <div class="table-responsive table-card mb-4">
                    <table class="table align-middle table-nowrap mb-0" id="tasksTable">
                      <thead class="table-light text-muted">
                        <tr>
                          <th class="sort" data-sort="id" @click="onSort('nom')">
                            ID
                          </th>
                          <th class="sort" data-sort="project_name" @click="onSort('client')">
                            Project
                          </th>
                          
                          <th class="sort" data-sort="due_date" @click="onSort('dueDate')">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody class="list form-check-all">
                        <tr v-for="(task, index) of resultQuery" :key="index">
                          <td class="id">
                            <router-link to="/apps/tasks-details" class="fw-medium link-primary">{{ task.taskId }}
                            </router-link>
                          </td>
                          <td class="project_name">
                            <router-link to="/apps/projects-overview" class="fw-medium link-primary">{{
                              task.femme_localite }}
                            </router-link>
                          </td>
                          <td class="due_date">
                            <span @click="editDetails(task)">
                              <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
                            </span>
                            <span @click="deleteModal = true">
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
                      <BLink class="page-item pagination-next" href="#" :disabled="page >= pages.length" @click="page++">
                        Next
                      </BLink>
                    </div>
                  </div>
                </BCardBody>
              </BTab>
              <BTab title="Messages">
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
                  <div class="table-responsive table-card mb-4">
                    <table class="table align-middle table-nowrap mb-0" id="tasksTable">
                      <thead class="table-light text-muted">
                        <tr>
                          <th scope="col" style="width: 40px">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" id="checkAll" value="option" />
                            </div>
                          </th>
                          <th class="sort" data-sort="id" @click="onSort('taskId')">
                            ID
                          </th>
                          <th class="sort" data-sort="project_name" @click="onSort('project')">
                            Project
                          </th>

                        </tr>
                      </thead>
                      <tbody class="list form-check-all">
                        <tr v-for="(task, index) of resultQuery" :key="index">
                          <th scope="row">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="chk_child" value="option1" />
                            </div>
                          </th>
                          <td class="id">
                            <router-link to="/apps/tasks-details" class="fw-medium link-primary">{{ task.taskId }}
                            </router-link>
                          </td>
                          <td class="project_name">
                            <router-link to="/apps/projects-overview" class="fw-medium link-primary">{{
                              task.femme_localite }}
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="noresult" v-if="resultQuery.length < 1">
                      <div class="text-center">
                        <lottie colors="primary:#121331,secondary:#08a88a" :options="defaultOptions" :height="75"
                          :width="75" />
                        <h5 class="mt-2">Sorry! No Result Found</h5>
                        <p class="text-muted mb-0">
                          We've searched more than 200k+ tasks We did not find
                          any tasks for you search.
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
                      <BLink class="page-item pagination-next" href="#" :disabled="page >= pages.length" @click="page++">
                        Next
                      </BLink>
                    </div>
                  </div>
                </BCardBody>
              </BTab>
              <BTab title="Settings">
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
                  <div class="table-responsive table-card mb-4">
                    <table class="table align-middle table-nowrap mb-0" id="tasksTable">
                      <thead class="table-light text-muted">
                        <tr>
                          <th scope="col" style="width: 40px">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" id="checkAll" value="option" />
                            </div>
                          </th>
                          <th class="sort" data-sort="id" @click="onSort('taskId')">
                            ID
                          </th>
                          <th class="sort" data-sort="project_name" @click="onSort('project')">
                            Project
                          </th>

                        </tr>
                      </thead>
                      <tbody class="list form-check-all">
                        <tr v-for="(task, index) of resultQuery" :key="index">
                          <th scope="row">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="chk_child" value="option1" />
                            </div>
                          </th>
                          <td class="id">
                            <router-link to="/apps/tasks-details" class="fw-medium link-primary">{{ task.taskId }}
                            </router-link>
                          </td>
                          <td class="project_name">
                            <router-link to="/apps/projects-overview" class="fw-medium link-primary">{{
                              task.femme_localite }}
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="noresult" v-if="resultQuery.length < 1">
                      <div class="text-center">
                        <lottie colors="primary:#121331,secondary:#08a88a" :options="defaultOptions" :height="75"
                          :width="75" />
                        <h5 class="mt-2">Sorry! No Result Found</h5>
                        <p class="text-muted mb-0">
                          We've searched more than 200k+ tasks We did not find
                          any tasks for you search.
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
                      <BLink class="page-item pagination-next" href="#" :disabled="page >= pages.length" @click="page++">
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
      :title="dataEdit ? 'Edit Task' : 'Add Task'">
      <b-form id="addform" class="tablelist-form" autocomplete="off">
        <BRow class="g-3">
          <input type="hidden" id="id" name="" />
          <BCol lg="12">
            <label for="projectName-field" class="form-label">Project Name</label>
            <input type="text" id="projectName" class="form-control" placeholder="Project name" v-model="event.project"
              :class="{ 'is-invalid': submitted && !event.project }" />
            <div class="invalid-feedback">Please enter a project name.</div>
          </BCol>
          <BCol lg="12">
            <div>
              <label for="tasksTitle-field" class="form-label">Title</label>
              <input type="text" id="tasksTitle" class="form-control" placeholder="Title" v-model="event.task"
                :class="{ 'is-invalid': submitted && !event.task }" />
              <div class="invalid-feedback">Please enter a title.</div>
            </div>
          </BCol>
          <BCol lg="12">
            <label for="createName-field" class="form-label">Client Name</label>
            <input type="text" id="createName" class="form-control" placeholder="Client name" v-model="event.creater"
              :class="{ 'is-invalid': submitted && !event.creater }" />
            <div class="invalid-feedback">Please enter a client name.</div>
          </BCol>
          <BCol lg="12">
            <label class="form-label">Assigned To</label>
            <simplebar data-simplebar style="height: 95px">
              <ul class="list-unstyled vstack gap-2 mb-0">
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="James Forbes" />
                    <label class="form-check-label d-flex align-items-center" for="James Forbes">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-2.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> James Forbes </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="john-robles" />
                    <label class="form-check-label d-flex align-items-center" for="john-robles">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-3.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> John Robles </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" name="assignedTo[]" value="avatar-4.jpg"
                      id="mary-gant" />
                    <label class="form-check-label d-flex align-items-center" for="mary-gant">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-4.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2">Mary Gant</span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="curtis-saenz" />
                    <label class="form-check-label d-flex align-items-center" for="curtis-saenz">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-1.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> Curtis Saenz </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" name="assignedTo[]" value="avatar-5.jpg"
                      id="virgie-price" />
                    <label class="form-check-label d-flex align-items-center" for="virgie-price">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-5.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2">Virgie Price</span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="anthony-mills" />
                    <label class="form-check-label d-flex align-items-center" for="anthony-mills">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-2.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> Anthony Mills </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="marian-angel" />
                    <label class="form-check-label d-flex align-items-center" for="marian-angel">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-6.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> Marian Angel </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="johnnie-walton" />
                    <label class="form-check-label d-flex align-items-center" for="johnnie-walton">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-7.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> Johnnie Walton </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="donna-weston" />
                    <label class="form-check-label d-flex align-items-center" for="donna-weston">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-8.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> Donna Weston </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div class="form-check d-flex align-items-center">
                    <input class="form-check-input me-3" type="checkbox" value="" id="diego-norris" />
                    <label class="form-check-label d-flex align-items-center" for="diego-norris">
                      <span class="flex-shrink-0">
                        <img src="@/assets/images/users/avatar-10.jpg" alt="" class="avatar-xxs rounded-circle" />
                      </span>
                      <span class="flex-grow-1 ms-2"> Diego Norris </span>
                    </label>
                  </div>
                </li>
              </ul>
            </simplebar>
            <div class="invalid-feedback">Please select a Assignes name.</div>
          </BCol>
          <BCol lg="6">
            <label for="duedate-field" class="form-label">Due Date</label>
            <flat-pickr placeholder="Select date" :config="timeConfig" class="form-control flatpickr-input" id="date"
              v-model="event.dueDate" :class="{ 'is-invalid': submitted && !event.dueDate }"></flat-pickr>
            <div class="invalid-feedback">Please enter a date name.</div>
          </BCol>
          <BCol lg="6">
            <label for="ticket-status" class="form-label">Status</label>
            <Multiselect id="statusid" :close-on-select="true" :searchable="true" :create-option="true" :options="[
              { value: '', label: 'Status' },
              { value: 'New', label: 'New' },
              { value: 'Inprogress', label: 'Inprogress' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Completed', label: 'Completed' },
            ]" v-model="event.status" :class="{ 'is-invalid': submitted && !event.status }" />
            <div class="invalid-feedback">Please select a status.</div>
          </BCol>
          <BCol lg="12">
            <label for="priority-field" class="form-label">Priority</label>
            <Multiselect id="priority" :close-on-select="true" :searchable="true" :create-option="true" :options="[
              { value: '', label: 'Priority' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]" v-model="event.priority" :class="{ 'is-invalid': submitted && !event.priority }" />
            <div class="invalid-feedback">Please select a priority.</div>
          </BCol>
        </BRow>

        <div class="hstack gap-2 justify-content-end mt-3">
          <BButton type="button" variant="light" @click="taskListModal = false" id="closemodal">
            Close
          </BButton>
          <BButton type="submit" variant="success" id="add-btn" @click="handleSubmit">
            {{ dataEdit ? "Update" : "Add Task" }}
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
