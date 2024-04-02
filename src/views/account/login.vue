<script>
import { required, email, helpers } from "@vuelidate/validators";
import Swal from "sweetalert2";
import axios from "axios";

import { authMethods, authFackMethods, notificationMethods } from "@/state/helpers";

export default {
  data() {
    return {
      API_URL: process.env.VUE_APP_BACK_URL,
      PROXY_URL: process.env.VUE_APP_BACK_URL_PROXY,
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      processing: false,
      LogoSysteme: null,
      NomSysteme: null,
      togglePassword: false,
      DescriptionSysteme: null,
    };
  },
  validations: {
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Please enter valid email", email),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
    },
  },
  computed: {},
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,

    async signinapi() {
      this.processing = true;
      try {
        const result = await axios.post( this.API_URL + "users/login", {
          login_user: this.email,
          pass_user: this.password,
        });
        // Vous pouvez ajuster cette condition en fonction de la réponse de votre API
        if (result.data.status === "success") {
          this.isLoggedIn = true;
          console.log(this.isLoggedIn);
          console.log("test", result.data);
          localStorage.setItem("jwt", result.data.data);
          this.$router.push({ path: "/" });
        } else {
          // Afficher une boîte de dialogue d'erreur avec Swal
          await Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Login ou mot de passe incorrect",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        this.authError =
          "Une erreur s'est produite lors de la connexion. Veuillez réessayer.";
      } finally {
        this.processing = false;
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
          "http://ssise-cosit.com/api-ssise/structureGenerale/getAllStructureGenerale"
        )
        .then((response) => {
          // Mettre à jour les structures générales avec les données reçues
          const data = response.data.data[0];

          this.LogoSysteme = data.LogoSysteme_sg;
          this.NomSysteme = data.NomSysteme_sg;
          this.DescriptionSysteme = data.DescriptionSysteme_sg;
          console.log("my data", data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des structures générales:",
            error
          );
        });
    },
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.processing = true;
      this.submitted = true;
      // stop here if form is invalid
      this.$touch;

      if (this.$invalid) {
        return;
      } else {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          this.tryingToLogIn = true;
          // Reset the authError if it existed.
          this.authError = null;
          return (
            this.logIn({
              email: this.email,
              password: this.password,
            })
              // eslint-disable-next-line no-unused-vars
              .then((token) => {
                this.tryingToLogIn = false;
                this.isAuthError = false;
                // Redirect to the originally requested page, or to the home page
                this.$router.push({
                  path: "/",
                });
              })
              .catch((error) => {
                this.tryingToLogIn = false;
                this.authError = error ? error : "";
                this.isAuthError = true;
                this.processing = false;
              })
          );
        } else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
          const { email, password } = this;
          if (email && password) {
            this.login({
              email,
              password,
            });
          }
        } else if (process.env.VUE_APP_DEFAULT_AUTH === "authapi") {
          axios
            .post("http://127.0.0.1:8000/api/login", {
              email: this.email,
              password: this.password,
            })
            .then((res) => {
              return res;
            });
        }
      }
    },
  },
  mounted() {
    this.getStructures();
  },
};
</script>

<template>
  <BCard no-body class="overflow-hidden m-0">
    <BRow class="g-0" style="height: 100%;">
      <BCol lg="8">
        <div class="p-lg-5 p-4 auth-one-bg h-100">
          <div class="bg-overlay"></div>
          <div class="position-relative h-100 d-flex flex-column">
            <div class="mb-4">
              <div class="dropdown-header">
                <h3 class="mb-2 text-uppercase" style="color: white; font-weight: 800">
                  {{ NomSysteme }}
                </h3>
              </div>
            </div>
            <div class="mt-auto">
              <div class="mb-3">
                <!-- <i class="ri-double-quotes-l display-4 text-success"></i> -->
              </div>

              <div id="qoutescarouselIndicators" class="carousel slide" data-bs-ride="carousel">
                <Swiper class="text-center text-white pb-5" :autoplay="{ delay: 3000, disableOnInteraction: false }"
                  :loop="true" :modules="[Autoplay, Navigation, Pagination]"
                  :pagination="{ clickable: true, el: '.swiper-pagination' }">
                  <swiper-slide>
                    <div class="active">
                      <p class="fs-15 fst-italic">
                        <!-- "{{ DescriptionSysteme }}" -->
                      </p>
                    </div>
                  </swiper-slide>
                  <div class="swiper-pagination"></div>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </BCol>
      <!-- style="margin-bottom: 21rem !important;" -->
      <BCol lg="4" class="align-items-center" style="height: 100vh">
        <div class="p-lg-5 p-4">
          <div class="text-center">
            <div class="mb-5">
              <router-link to="/" class="d-block">
                <img :src="LogoSysteme" alt="" height="50" />
              </router-link>
            </div>
            <h5 class="form-label">Connexion</h5>
            <p class="text-muted">Veuillez entrer vos identifiants.</p>
          </div>

          <div class="mt-4">
            <form class="needs-validation" novalidate>
              <div class="mb-3">
                <label for="username" class="form-label">Login <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="login_user" placeholder="Enter login" v-model="email"
                  required />
                <div class="invalid-feedback">Please enter Login</div>
              </div>

              <div class="mb-3">
                <label class="form-label" for="password-input">Mot de passe <span class="text-danger">*</span>
                </label>
                <div class="position-relative auth-pass-inputgroup">
                  <!-- <input
                    type="password"
                    v-model="password"
                    class="form-control pe-5"
                    placeholder="Enter password"
                    required
                  />
                  <BButton
                    variant="link"
                    class="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                    type="button"
                    id="password-addon"
                    ><i class="ri-eye-fill align-middle"></i
                  ></BButton> -->
                  <input :type="togglePassword ? 'text' : 'password'" v-model="password" class="form-control pe-5"
                    placeholder="Enter password" id="password-input" />
                  <BButton variant="link" class="position-absolute end-0 top-0 text-decoration-none text-muted"
                    type="button" id="password-addon" @click="togglePassword = !togglePassword"><i
                      class="ri-eye-fill align-middle"></i></BButton>
                  <div class="invalid-feedback">Please enter password</div>
                </div>
              </div>

              <div class="mb-4"></div>
              <div id="password-contain" class="p-3 bg-light mb-2 rounded">
                <h5 class="fs-14">Password must contain:</h5>
                <p id="pass-length" class="invalid fs-13 mb-2">
                  Minimum <b>8 characters</b>
                </p>
                <p id="pass-lower" class="invalid fs-13 mb-2">
                  At <b>lowercase</b> letter (a-z)
                </p>
                <p id="pass-upper" class="invalid fs-13 mb-2">
                  At least
                  <b>uppercase</b>
                  letter (A-Z)
                </p>
                <p id="pass-number" class="invalid fs-13 mb-0">
                  A least <b>number</b>
                  (0-9)
                </p>
              </div>
              <div class="mt-4">
                <BButton class="btn btn-md w-100" style="background-color: #288f24;" type="submit" @click="signinapi"
                  :disabled="processing">
                  {{ processing ? "Connexion" : "Se connecter" }}
                </BButton>
              </div>
              <div class="mt-4 text-center">
                <router-link to="/" class="d-block">
                  <img src="@/assets/images/merf.jpg" alt="" height="150" />
                </router-link>
              </div>
              <footer class="mt-4" style="
                  bottom: 0;
                  padding: 20px calc(1.5rem * 0.5);
                  position: absolute;
                  color: #288f24;
                  height: 60px;
                ">
                <BContainer fluid>
                  <BRow>
                    <BCol col sm="6">
                      {{ new Date().getFullYear() }} © Copyright | Tous droits reservés
                    </BCol>
                    <BCol col sm="6">
                      <div class="text-sm-end d-none d-sm-block">COSIT</div>
                    </BCol>
                  </BRow>
                </BContainer>
                <!-- Contenu de votre footer ici -->
              </footer>
            </form>
          </div>
        </div>
      </BCol>
    </BRow>
  </BCard>
  <!-- <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
    <div class="bg-overlay"></div>
    <div class="auth-page-content overflow-hidden pt-lg-5">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <BCard no-body class="overflow-hidden m-0">
              <BRow class="justify-content-center g-0">
                <BCol lg="6">
                  <div class="p-lg-5 p-4 auth-one-bg h-100">
                    <div class="bg-overlay"></div>
                    <div class="position-relative h-100 d-flex flex-column">
                      <div class="mb-4">
                        <router-link to="/" class="d-block">
                          <img src="@/assets/images/logo-light.png" alt="" height="18">
                        </router-link>
                      </div>
                      <div class="mt-auto">
                        <div class="mb-3">
                          <i class="ri-double-quotes-l display-4 text-success"></i>
                        </div>

                        <div id="qoutescarouselIndicators" class="carousel slide" data-bs-ride="carousel">
                          <Swiper class=" text-center text-white pb-5"
                            :autoplay="{ delay: 3000, disableOnInteraction: false }" :loop="true"
                            :modules="[Autoplay, Navigation, Pagination]"
                            :pagination="{ clickable: true, el: '.swiper-pagination' }">
                            <swiper-slide>
                              <div class="active">
                                <p class="fs-15 fst-italic">" Great! Clean code, clean
                                  design, easy for customization. Thanks very much! "</p>
                              </div>
                            </swiper-slide>
                            <swiper-slide>
                              <div>
                                <p class="fs-15 fst-italic">" The theme is really great with
                                  an amazing customer support."</p>
                              </div>
                            </swiper-slide>
                            <swiper-slide>
                              <div>
                                <p class="fs-15 fst-italic">" Great! Clean code, clean
                                  design, easy for customization. Thanks very much! "</p>
                              </div>
                            </swiper-slide>
                            <div class="swiper-pagination"></div>
                          </Swiper>
                        </div>

                      </div>
                    </div>
                  </div>
                </BCol>

                <BCol lg="6">
                  <div class="p-lg-5 p-4">
                    <div>
                      <h5 class="text-primary">Register Account</h5>
                      <p class="text-muted">Get your Free Velzon account now.</p>
                    </div>

                    <div class="mt-4">
                      <form class="needs-validation" novalidate>


                        <div class="mb-3">
                          <label for="username" class="form-label">Username <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" id="login_user" placeholder="Enter login"
                            v-model="email" required>
                          <div class="invalid-feedback">
                            Please enter username
                          </div>
                        </div>

                        <div class="mb-3">
                          <label class="form-label" for="password-input">Password</label>
                          <div class="position-relative auth-pass-inputgroup">
                            <input type="password" v-model="password" class="form-control pe-5"
                              placeholder="Enter password" required>
                            <BButton variant="link"
                              class="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button" id="password-addon"><i class="ri-eye-fill align-middle"></i></BButton>
                            <div class="invalid-feedback">
                              Please enter password
                            </div>
                          </div>
                        </div>

                        <div class="mb-4">
                        
                        </div>
                        <div id="password-contain" class="p-3 bg-light mb-2 rounded">
                          <h5 class="fs-14">Password must contain:</h5>
                          <p id="pass-length" class="invalid fs-13 mb-2">Minimum <b>8
                              characters</b>
                          </p>
                          <p id="pass-lower" class="invalid fs-13 mb-2">At <b>lowercase</b>
                            letter
                            (a-z)</p>
                          <p id="pass-upper" class="invalid fs-13 mb-2">At least
                            <b>uppercase</b>
                            letter (A-Z)
                          </p>
                          <p id="pass-number" class="invalid fs-13 mb-0">A least <b>number</b>
                            (0-9)
                          </p>
                        </div>
                        <div class="mt-4">
                      
                          <BButton variant="success" class="w-100" type="submit" @click="signinapi" :disabled="processing">
                        {{ processing ? "Connexion" : "Se connecter" }}
                      </BButton>

                        </div>

                        <div class="mt-4 text-center">
                          <div class="signin-other-title">
                            <h5 class="fs-13 mb-4 title text-muted">Create account with</h5>
                          </div>

                          <div>
                            <BButton type="button" variant="primary" class="btn-icon"><i
                                class="ri-facebook-fill fs-16"></i></BButton>
                            <BButton type="button" variant="danger" class="btn-icon ms-1">
                              <i class="ri-google-fill fs-16"></i>
                            </BButton>
                            <BButton type="button" variant="dark" class="btn-icon ms-1"><i
                                class="ri-github-fill fs-16"></i></BButton>
                            <BButton type="button" variant="info" class="btn-icon ms-1"><i
                                class="ri-twitter-fill fs-16"></i></BButton>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div class="mt-5 text-center">
                      <p class="mb-0">Already have an account ? <router-link to="/auth/signin-cover"
                          class="fw-semibold text-primary text-decoration-underline"> Signin
                        </router-link>
                      </p>
                    </div>
                  </div>
                </BCol>
              </BRow>
            </BCard>
          </BCol>

        </BRow>
      </BContainer>
    </div>

    <footer class="footer">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center">
              <p class="mb-0">&copy; {{ new Date().getFullYear() }} Velzon. Crafted with <i
                  class="mdi mdi-heart text-danger"></i> by Themesbrand</p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </footer>
  </div> -->
</template>
