import $ajax from "../ajax";
export default {
  getChenJian() {
    return $ajax({
      method: "GET",
      url: `/api/Web/GetGDChenJian`
    });
  },
  getGongDuan(params) {
    return $ajax({ method: "GET", url: `/api/Web/GetGongDuan`, params });
  },
  getGongXuNumber(params) {
    return $ajax({ method: "GET", url: `/api/Web/GetGongXu`, params });
  },
  getGongXu(params) {
    return $ajax({ method: "GET", url: `/api/Web/GetProportion`, params });
  }
};
