<script>
import Layout from "@/layouts/main.vue";
import axios from "axios";

// import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import moment from "moment";
import animationData1 from "@/components/widgets/gsqxdxog.json";
import Lottie from "@/components/widgets/lottie.vue";

export default {
  data() {
    return {
      Autoplay,
      Navigation,
      taskListModal: false,
      dataEdit: false,
      submitted: false,
      deleteModal: false,
      code: "",
      sigle: "",
      nom: "",
      objectif: "",
      vision: "",
      debut: "",
      id: "",
      fin: "",
      couleur: "",
      allPro: [],
      isVisionExpanded: false,
      isObjectifExpanded: false,
      maxLength: 100,
      defaultOptions1: {
        animationData: animationData1,
      },
    };
  },
  components: {
    Layout,
    lottie: Lottie,

    // Swiper,
    // SwiperSlide,
  },
  methods: {
    toggleModal() {
      this.taskListModal = true;
      this.dataEdit = false;
    },
    editDetails() {
      this.dataEdit = true;
      this.taskListModal = true;
    },
    performAction() {
      if (this.dataEdit) {
        this.updatePro();
      } else {
        this.insertPro();
      }
    },
    formatDate(value) {
      if (value) {
        return moment(value).utc().format("YYYY-MM-DD");
      }
      return "";
    },
    deleteModal1(id) {
      this.deleteModal = true;
      this.id = id;
    },
    recup(id) {
      for (let u of this.allPro) {
        if (u.id_programme === id) {
          this.id = u.id_programme;
          this.code = u.code_programme;
          this.sigle = u.sigle_programme;
          this.nom = u.nom_programme;
          this.vision = u.vision_programme;
          this.objectif = u.objectif_programme;
          this.debut = this.formatDate(u.annee_debut_programme);
          this.couleur = u.couleur_programme;
          this.fin = this.formatDate(u.annee_fin_programme);
        }
      }
    },
    getPro() {
      axios
        .get(
          "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/programme/getAllProgramme"
        )
        .then(
          function (response) {
            this.allPro = response.data.data;
            console.log(response.data.data);
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    async insertPro() {
      try {
        await axios.post(
          "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/programme/insert",
          {
            code_programme: this.code,
            sigle_programme: this.sigle,
            nom_programme: this.nom,
            vision_programme: this.vision,
            objectif_programme: this.objectif,
            annee_debut_programme: this.debut,
            annee_fin_programme: this.fin,
            actif_programme: 1,
          }
        );
        this.getPro();
        this.clean();
        this.taskListModal = false;
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    async updatePro() {
      try {
        await axios.post(
          "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/programme/update",
          {
            id_programme: this.id,
            code_programme: this.code,
            sigle_programme: this.sigle,
            nom_programme: this.nom,
            vision_programme: this.vision,
            objectif_programme: this.objectif,
            annee_debut_programme: this.debut,
            annee_fin_programme: this.fin,
            couleur_programme: this.couleur,
            actif_programme: 1,
          }
        );
        this.getPro();
        this.clean();
        this.taskListModal = false;
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
      }
    },
    async deletePro() {
      try {
        await axios
          .delete(
            "https://cors-proxy.fringe.zone/https://ssise-cosit.com/api-ssise/programme/delete",
            {
              data: { id_programme: this.id },
            }
          )
          .then((response) => {
            console.log(response);
            this.getPro();
            this.id = "";
            this.deleteModal = false;
          });
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API : ", error);
        console.log(this.id);
      }
    },
    clean() {
      this.code = "";
      this.sigle = "";
      this.nom = "";
      this.vision = "";
      this.objectif = "";
      this.debut = "";
      this.fin = "";
    },
    toggleVision() {
      this.isVisionExpanded = !this.isVisionExpanded;
    },
    toggleObjectif() {
      this.isObjectifExpanded = !this.isObjectifExpanded;
    },
  },
  mounted() {
    this.getPro();
  },
  computed: {
    truncatedVision(task) {
      return task.vision_programme.substring(0, this.maxLength) + "...";
    },
    truncatedObjectif(task) {
      return task.objectif_programme.substring(0, this.maxLength) + "...";
    },
  },
};
</script>

<template>
  <Layout>
    <BRow>
      <div>
        <BTab class="nav-item pt-4">
          <BButton
            @click="toggleModal"
            style="background-color: #285e43; margin-bottom: 20px"
          >
            <i class="ri-add-line align-bottom me-1"></i> Nouveau
          </BButton>
          <BCard no-body>
            <BCardBody>
              <BRow>
                <BCol
                  xxl="3"
                  sm="6"
                  v-for="(task, index) of allPro"
                  :key="index"
                  style="margin-bottom: 20px"
                >
                  <BCard
                    no-body
                    class="profile-project-card shadow-none mb-0"
                    :style="{ borderLeftColor: task.couleur_programme }"
                  >
                    <BCardBody class="p-4">
                      <div class="d-flex">
                        <div class="flex-grow-1 text-muted overflow-hidden">
                          <h5 class="fs-15 text-truncate">
                            <BLink
                              href="#"
                              class="text-body"
                              style="font-size: 24px"
                              >{{ task.sigle_programme }}</BLink
                            >
                          </h5>
                          <h5 class="fs-15 text-truncate">
                            <BLink
                              href="#"
                              class="text-body"
                              style="font-size: 20px; font-weight: 400"
                              >{{ task.nom_programme }}</BLink
                            >
                          </h5>

                          <p class="text-muted text-truncate mb-0">
                            Code :
                            <span class="fw-semibold text-body">{{
                              task.code_programme
                            }}</span>
                          </p>

                          <p class="text-muted mb-0">
                            Vision :
                            <span class="fw-semibold text-body">{{
                              task.vision_programme
                            }}</span>
                          </p>
                          <p class="text-muted mb-0">
                            Objectifs :
                            <span class="fw-semibold text-body">{{
                              task.objectif_programme
                            }}</span>
                          </p>
                        </div>
                        <div class="flex-shrink-0 ms-2">
                          <span
                            class="text-info fs-11"
                            style="margin-right: 5px"
                            @click="
                              editDetails();
                              recup(task.id_programme);
                            "
                            ><i
                              class="ri-pencil-fill align-bottom me-2 text-muted"
                              style="font-size: 16px"
                            ></i>
                          </span>
                          <span
                            class="text-info fs-11"
                            @click="deleteModal1(task.id_programme)"
                            ><i
                              class="ri-delete-bin-fill align-bottom me-2 text-muted"
                              style="font-size: 16px"
                            ></i
                          ></span>
                        </div>
                      </div>
                      <div class="d-flex mt-4">
                        <div class="flex-grow-1">
                          <div class="d-flex align-items-center gap-2">
                            <div>
                              <h5 class="fs-13 text-muted mb-0">
                                Debut :
                                {{ formatDate(task.annee_debut_programme) }}
                              </h5>
                              <h5 class="fs-13 text-muted mb-0">
                                Fin :
                                {{ formatDate(task.annee_fin_programme) }}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </BCardBody>
                  </BCard>
                </BCol>

                <BCol lg="12">
                  <div class="mt-4">
                    <ul
                      class="pagination pagination-separated justify-content-center mb-0"
                    >
                      <li class="page-item disabled">
                        <BLink href="javascript:void(0);" class="page-link"
                          ><i class="mdi mdi-chevron-left"></i>
                        </BLink>
                      </li>
                      <li class="page-item active">
                        <BLink href="javascript:void(0);" class="page-link"
                          >1</BLink
                        >
                      </li>
                      <li class="page-item">
                        <BLink href="javascript:void(0);" class="page-link"
                          >2</BLink
                        >
                      </li>
                      <li class="page-item">
                        <BLink href="javascript:void(0);" class="page-link"
                          >3</BLink
                        >
                      </li>
                      <li class="page-item">
                        <BLink href="javascript:void(0);" class="page-link"
                          >4</BLink
                        >
                      </li>
                      <li class="page-item">
                        <BLink href="javascript:void(0);" class="page-link"
                          >5</BLink
                        >
                      </li>
                      <li class="page-item">
                        <BLink href="javascript:void(0);" class="page-link"
                          ><i class="mdi mdi-chevron-right"></i>
                        </BLink>
                      </li>
                    </ul>
                  </div>
                </BCol>
              </BRow>
            </BCardBody>
          </BCard>
        </BTab>
      </div>

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
                <label for="tasksTitle-field" class="form-label">Sigle</label>
                <input
                  type="text"
                  id="sigle"
                  class="form-control"
                  v-model="sigle"
                  :class="{ 'is-invalid': submitted && !event.task }"
                />
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
            </BCol>
            <BCol lg="6">
              <div>
                <label for="tasksTitle-field" class="form-label"
                  >Nom programme</label
                >
                <input
                  type="text"
                  id="nom"
                  class="form-control"
                  v-model="nom"
                  :class="{ 'is-invalid': submitted && !event.task }"
                />
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
            </BCol>

            <BCol lg="6">
              <div>
                <label for="tasksTitle-field" class="form-label">Début</label>
                <input
                  type="date"
                  id="debut"
                  class="form-control"
                  v-model="debut"
                  :class="{ 'is-invalid': submitted && !event.task }"
                />
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
            </BCol>
            <BCol lg="6">
              <div>
                <label for="tasksTitle-field" class="form-label">Vision</label>
                <textarea
                  id="vision"
                  class="form-control"
                  v-model="vision"
                  :class="{ 'is-invalid': submitted && !event.task }"
                ></textarea>
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
            </BCol>
            <BCol lg="6">
              <div>
                <label for="tasksTitle-field" class="form-label"
                  >Objectifs</label
                >
                <textarea
                  id="objectif"
                  class="form-control"
                  v-model="objectif"
                  :class="{ 'is-invalid': submitted && !event.task }"
                ></textarea>
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
            </BCol>
            <BCol lg="6">
              <div>
                <label for="tasksTitle-field" class="form-label">Fin</label>
                <input
                  type="date"
                  id="fin"
                  class="form-control"
                  v-model="fin"
                  :class="{ 'is-invalid': submitted && !event.task }"
                />
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
            </BCol>
            <BCol lg="6">
              <div>
                <label for="tasksTitle-field" class="form-label">Couleur</label>
                <input
                  type="color"
                  id="couleur"
                  class="form-control"
                  v-model="couleur"
                  :class="{ 'is-invalid': submitted && !event.task }"
                />
                <div class="invalid-feedback">Please enter a title.</div>
              </div>
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
            @click="deletePro"
          >
            Supprimer
          </button>
        </div>
      </BModal>
    </BRow>
  </Layout>
</template>

<style>
.tamp {
  position: absolute;
  top: 17px;
  right: 16px;
}
</style>
