

token = localStorage.getItem("jwt");
// const apiClient = axios.create({
//   baseURL: "https://ssise-cosit.com/",
//   headers: {
//     "Content-Type": "application/json",

//     Authorization: "Bearer ${token}",
//   },
// });

 function getHeaders() {
  return headers( {
    "Content-Type": "application/json",

    Authorization: "Bearer ${token}",
  });
};

export default apiClient;
