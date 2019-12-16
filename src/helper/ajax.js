import axios from "axios";
export default async opts => {
  try {
    const options = {
      baseURL: "http://fctoday.com:9050",
      timeout: 15000,
      ...opts
    };
    let response = await axios(options);
    if (response.data) {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    }
  } catch (err) {
    if (opts.autoErrMsg !== false) {
      let msg = `${err}`;
      if (err) msg = err.message || msg;
      if (err.response)
        msg = `${err.response.statusText} ${err.response.status}` || msg;
      if (err.response && err.response.data && err.response.data.message)
        msg = `${err.response.data.message} ${err.response.data.status}` || msg;
      throw new Error(msg);
    }
    throw err;
  }
};
