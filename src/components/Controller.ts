import { dataModel } from "./Model";
import View from "./View";

export default class Controller {
  public boundMove: any;
  public boundOff: any;

  constructor(model: dataModel, view: View) {
    model.target.addEventListener("mousedown", () => {
      this.fsdOn(model, view, <MouseEvent>event);
    });
    model.target.querySelector(".fsd-range")!.addEventListener("click", () => {
      this.fsdInteractive(model, view, <MouseEvent>event);
    });
    model.target.querySelector(".fsd-scale")!.addEventListener("click", () => {
      this.fsdInteractive(model, view, <MouseEvent>event);
    });
    model.target.addEventListener("selectstart", () => {
      event?.preventDefault();
    });
    window.addEventListener("resize", () => {
      this.fsdResize(model, view)
    });
  }

  fsdOn(model: dataModel, view: View, event: MouseEvent) {
    let target: HTMLElement = <HTMLElement>event.target
    if (!target.closest('.fsd-slider')) return;

    let shift: number = 0;
    if (model.vertical === true) {
    } else {
      shift = event.clientX - target.getBoundingClientRect().left;
    }
    this.boundMove = this.fsdMove.bind(null, model, view, shift, <HTMLElement>target.closest('.fsd-sliderWrapper'));
    this.boundOff = this.fsdOff.bind(null, model);
    document.addEventListener("mousemove", this.boundMove);
    document.addEventListener("mouseup", this.boundOff);
  }

  fsdMove(model: dataModel, view: View, shift: number, slider: HTMLElement, event: MouseEvent) {
    if (model.vertical === true) {
    } else {
      
      let range: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd-range"));
      let sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100;

      let left: number = ((event.clientX - shift - range.getBoundingClientRect().left) / range.offsetWidth) *
        100;
      let curPos: number

      if (model.interval === true && slider.classList.contains('fsd-startWrapper')) {

        curPos = view.stepsWidth * (model.startValue! - 1) - sliderWidth / 2;
        if (left > curPos + view.stepsWidth / 2 && model.startValue != model.max) {
          left = curPos + view.stepsWidth;
          model.startValue!++;
        } else if (left < curPos - view.stepsWidth / 2 && model.startValue != model.min) {
          left = curPos - view.stepsWidth;
          model.startValue!--;
        } else return;

        if (model.prompt === true)
          slider.querySelector(".fsd-prompt")!.innerHTML = model.startValue + "";

      } else if (model.interval === true && slider.classList.contains('fsd-endWrapper')) {

        curPos = view.stepsWidth * (model.endValue! - 1) - sliderWidth / 2;
        if (left > curPos + view.stepsWidth / 2 && model.endValue != model.max) {
          left = curPos + view.stepsWidth;
          model.endValue!++;
        } else if (left < curPos - view.stepsWidth / 2 && model.endValue != model.min) {
          left = curPos - view.stepsWidth;
          model.endValue!--;
        } else return;

        if (model.prompt === true)
          slider.querySelector(".fsd-prompt")!.innerHTML = model.endValue + "";

      } else {

        curPos = view.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
        if (left > curPos + view.stepsWidth / 2 && model.currentValue != model.max) {
          left = curPos + view.stepsWidth;
          model.currentValue!++;
        } else if (left < curPos - view.stepsWidth / 2 && model.currentValue != model.min) {
          left = curPos - view.stepsWidth;
          model.currentValue!--;
        } else return;

        if (model.prompt === true)
          slider.querySelector(".fsd-prompt")!.innerHTML = model.currentValue + "";
      }

      if (left < 0) left = 0;
      let right: number = 100 - sliderWidth;
      if (left > right) left = right;
      slider.style.left = left + "%";
    }
  }

  fsdOff(model: dataModel) {
    let off = model.target.controller.boundOff;
    let move = model.target.controller.boundMove;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", off);
  }

  fsdInteractive(model: dataModel, view: View, event: MouseEvent) {

    let range: HTMLElement = <HTMLElement>(
      model.target.querySelector(".fsd-range")
    );
    if (model.vertical === true) {
    } else {
      // if (model.interval == true){

      // } else{
      let slider: HTMLElement = <HTMLElement>(
        model.target.querySelector(".fsd-sliderWrapper")
      );
      let left: number =
        ((event.clientX - range.getBoundingClientRect().left) /
          range.offsetWidth) *
        100;
      let sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100;
      let right: number = 100 - sliderWidth;
      let min: number = model.min!;
      let steps: number = 0;
      while (min < model.max!) {
        min += model.step!;
        steps++;
      }
      for (let i = 0; i <= steps; i++) {
        let width: number = view.stepsWidth * i;
        if (
          (left <= width && left >= width - view.stepsWidth / 2) ||
          (left >= width && left <= width + view.stepsWidth / 2)
        ) {
          left = width - sliderWidth / 2;
          model.currentValue = (i + 1) * model.step!;
          break;
        }
      }
      if (left < 0) left = 0;
      if (left > right) left = right;
      slider.style.left = left + "%";
    }
    // }
  }

  fsdResize(model: dataModel, view: View) {
    if (model.vertical === true) return;

    let range: HTMLElement = <HTMLElement>(
      model.target.querySelector(".fsd-range")
    );

    if (model.interval === true) {
      let startSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd-startWrapper')
      let endSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd-endWrapper')
      let sliderWidth: number = startSlider.offsetWidth / range.offsetWidth * 100
      let right = 100 - sliderWidth

      let startPos: number = view.stepsWidth * (model.startValue! - 1) - sliderWidth / 2
      if (startPos < 0) startPos = 0
      if (startPos > right) startPos = right

      let endPos: number = view.stepsWidth * (model.endValue! - 1) - sliderWidth / 2
      if (endPos < 0) endPos = 0
      if (endPos > right) endPos = right

      startSlider.style.left = startPos + '%'
      endSlider.style.left = endPos + '%'
    } else {
      let slider: HTMLElement = <HTMLElement>(
        model.target.querySelector(".fsd-sliderWrapper")
      );

      let sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100;
      let curPos: number =
        view.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
      if (curPos < 0) curPos = 0;
      let right: number = 100 - sliderWidth;
      if (curPos > right) curPos = right;
      slider.style.left = curPos + "%";
    }

  }

}
