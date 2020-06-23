import $ from "jquery";
import Model, { dataModel } from "./components/Model";
import View from "./components/View";
import Controller from "./components/Controller";
import "@data/styles";
import "@data/images";
import "@js/main";

(function ($: any) {
  $.fn.rangeFSD = function (params: dataModel) {
    for (let i = 0; i < this.length; i++){
      !params ? params = {target: this[i]} : params.target = this[i];
      this[i].model = new Model(params);
      this[i].view = new View(this[i].model);
      this[i].controller = new Controller(this[i].model);
    }
  };
})($);

interface rangeItem extends HTMLElement {
  model: Model;
  view: View;
  Controller: Controller;
}
