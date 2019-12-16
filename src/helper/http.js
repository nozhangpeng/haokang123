import axios from "axios";

const http = {
  async POST(url, parameters, responseType) {
    try {
      const res = await axios.post(url, parameters, {
        responseType: responseType ? responseType : "json"
      });
      if (responseType === "blob") {
        return res;
      }
    } catch (error) {
      return error;
    }
  },
  async GET(url, responseType, params) {
    try {
      const res = await axios.get(url, params, {
        responseType: responseType ? responseType : "json"
      });
      if (responseType === "blob") {
        return res;
      }
    } catch (error) {
      return error;
    }
  }
};

export default http;
