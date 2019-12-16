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
  getProductType(params) {
    return $ajax({ method: "GET", url: `/api/Web/GetCPLB`, params });
  },
  getWorkProduce(params) {
    return $ajax({ method: "GET", url: `/api/Web/GetWorkProduce`, params });
  },
  getControlPoint(params) {
    return $ajax({ method: "GET", url: `/api/Web/GetControlPoint`, params });
  },
  getEJJMSJ(params) {
    return $ajax({ method: "GET", url: `/api/Web/GetEJJMSJ`, params });
  }
};
