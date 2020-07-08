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
      this[i].controller = new Controller(this[i].model, this[i].view);
      Object.defineProperties(this[i], {
        'min': {
          get() {
            return this.model.min
          }
        },
        'max': {
          get() {
            return this.model.max
          }
        },
        'currentValue': {
          get() {
            if (this.model.interval === true) return null
             return this.model.currentValue
          }
        },
        'vertical': {
          get() {
            return this.model.vertical
          }
        },
        'interval': {
          get() {
            return this.model.interval
          }
        },
        'startValue': {
          get() {
            if (this.model.interval !== true) return null
            return this.model.startValue
          }
        },
        'endValue': {
          get() {
            if (this.model.interval !== true) return null
            return this.model.endValue
          }
        },
        'step': {
          get() {
            return this.model.step
          }
        },
        'prompt': {
          get() {
            return this.model.prompt
          }
        },
        'scaleOfValues': {
          get() {
            return this.model.scaleOfValues
          }
        }
      })
    }
  };
})($);

export interface rangeItem extends HTMLElement {
  model: Model;
  view: View;
  controller: Controller;
}
