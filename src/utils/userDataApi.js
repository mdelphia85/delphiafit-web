import { apiRequest } from "./api.js";

export const userDataApi = {
  list: (collection) => apiRequest(`/user-data/${collection}`),
  create: (collection, data) => apiRequest(`/user-data/${collection}`, { method: "POST", body: { data } }),
  update: (collection, id, data) => apiRequest(`/user-data/${collection}/${id}`, { method: "PUT", body: { data } }),
  remove: (collection, id) => apiRequest(`/user-data/${collection}/${id}`, { method: "DELETE" })
};
