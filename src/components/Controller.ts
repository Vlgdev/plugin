import { dataModel } from "./Model";
import View from "./View";

export default class Controller {
  public boundMove: any;
  public boundOff: any;

  constructor(model: dataModel, view: View) {
    model.target.addEventListener("mousedown", () => {
      this.fsdOn(model, view, <MouseEvent>event);
    })
    model.target.addEventListener('click', () => {
      this.fsdInteractive(model, view, <MouseEvent>event);
    })
    model.target.addEventListener("selectstart", () => {
      event?.preventDefault();
    })
    window.addEventListener("resize", () => {
      this.fsdResize(model, view)
    })
  }

  fsdOn(model: dataModel, view: View, event: MouseEvent) {
    let target: HTMLElement = <HTMLElement>event.target
    if (!target.closest('.fsd__slider')) return;

    let shift: number = 0;
    if (model.vertical === true) {
    } else {
      shift = event.clientX - target.getBoundingClientRect().left;
    }
    this.boundMove = this.fsdMove.bind(null, model, view, shift, <HTMLElement>target.closest('.fsd__slider-wrapper'));
    this.boundOff = this.fsdOff.bind(null, model);
    document.addEventListener("mousemove", this.boundMove);
    document.addEventListener("mouseup", this.boundOff);
  }

  fsdMove(model: dataModel, view: View, shift: number, slider: HTMLElement, event: MouseEvent) {
    if (model.vertical === true) {
    } else {

      let range: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__range"));
      let sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100;
      let interval: HTMLElement
      let widthInterval: number
      let leftInterval: number

      let left: number = ((event.clientX - shift - range.getBoundingClientRect().left) / range.offsetWidth) *
        100;
      let curPos: number

      if (model.interval === true && slider.classList.contains('fsd__start-wrapper')) {

        curPos = view.stepsWidth * (model.startValue! - 1) - sliderWidth / 2;
        if (left > curPos + view.stepsWidth / 2 && model.startValue != model.max && model.startValue != model.endValue) {
          left = curPos + view.stepsWidth;
          model.startValue!++;
        } else if (left < curPos - view.stepsWidth / 2 && model.startValue != model.min) {
          left = curPos - view.stepsWidth;
          model.startValue!--;
        } else return;

        if (model.prompt === true)
          slider.querySelector(".fsd__prompt")!.innerHTML = model.startValue + "";

      } else if (model.interval === true && slider.classList.contains('fsd__end-wrapper')) {

        curPos = view.stepsWidth * (model.endValue! - 1) - sliderWidth / 2;
        if (left > curPos + view.stepsWidth / 2 && model.endValue != model.max) {
          left = curPos + view.stepsWidth;
          model.endValue!++;
        } else if (left < curPos - view.stepsWidth / 2 && model.endValue != model.min && model.endValue != model.startValue) {
          left = curPos - view.stepsWidth;
          model.endValue!--;
        } else return;

        if (model.prompt === true)
          slider.querySelector(".fsd__prompt")!.innerHTML = model.endValue + "";

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
          slider.querySelector(".fsd__prompt")!.innerHTML = model.currentValue + "";
      }

      if (left < 0) left = 0;
      let right: number = 100 - sliderWidth;
      if (left > right) left = right;

      if (model.interval === true) {

        interval = <HTMLElement>model.target.querySelector('.fsd__interval')

        if (slider.classList.contains('fsd__start-wrapper')) {

          let end: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper')
          widthInterval = parseFloat(end.style.left) - left
          leftInterval = left + sliderWidth / 2

        } else {

          let start: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper')
          widthInterval = left - parseFloat(start.style.left)
          leftInterval = parseFloat(start.style.left) + sliderWidth / 2
        }
      }

      slider.style.left = left + "%";
      if (model.interval) {
        if (widthInterval! < 0) widthInterval = 0
        interval!.style.width = widthInterval! + '%'
        interval!.style.left = leftInterval! + '%'
      }
    }
  }

  fsdOff(model: dataModel) {
    let off = model.target.controller.boundOff;
    let move = model.target.controller.boundMove;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", off);
  }

  fsdInteractive(model: dataModel, view: View, event: MouseEvent) {

    let target: HTMLElement = <HTMLElement>event.target

    if (!(target.closest('.fsd__scale') || target.closest('.fsd__range') || target.closest('.fsd__interval'))) return;

    let range: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__range"));

    let slider: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__slider-wrapper"));
    let sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100;

    let right: number = 100 - sliderWidth;
    let left: number = ((event.clientX - range.getBoundingClientRect().left) / range.offsetWidth) * 100;

    let min: number = model.min!;
    let steps: number = 0;
    while (min < model.max!) {
      min += model.step!;
      steps++;
    }

    if (model.vertical === true) {
    } else {

      if (model.interval == true) {

        let startSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper')
        let endSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper')

        let startPos: number = view.stepsWidth * (model.startValue! - 1) - sliderWidth / 2
        let endPos: number = view.stepsWidth * (model.endValue! - 1) - sliderWidth / 2

        if (startPos < 0) startPos = 0
        if (startPos > right) startPos = right
        if (endPos < 0) endPos = 0
        if (endPos > right) endPos = right

        let pos: string

        if (left <= endPos - (endPos - startPos) / 2) pos = 'start'
        else if (left >= startPos + (endPos - startPos) / 2) pos = 'end'

        for (let i: number = 0; i <= steps; i++) {
          let width: number = view.stepsWidth * i
          if (
            (left <= width && left >= width - view.stepsWidth / 2) ||
            (left >= width && left <= width + view.stepsWidth / 2)
          ) {
            left = width - sliderWidth / 2
            if (pos! == 'start') {
              model.startValue = (i + 1) * model.step!
            } else {
              model.endValue = (i + 1) * model.step!
            }
            break;
          }
        }

        if (left < 0) left = 0;
        if (left > right) left = right;

        let prompt: HTMLElement
        let interval: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__interval')

        if (pos! == 'start') {
          prompt = <HTMLElement>startSlider.querySelector('.fsd__prompt')
          prompt.innerHTML = model.startValue + ''
          startSlider.style.left = left + '%'
          interval.style.width = endPos - left + '%'
          interval.style.left = left + sliderWidth / 2 + '%'
        } else {
          prompt = <HTMLElement>endSlider.querySelector('.fsd__prompt')
          prompt.innerHTML = model.endValue + ''
          endSlider.style.left = left + '%'
          interval.style.width = left - startPos + '%'
          interval.style.left = startPos + sliderWidth / 2 + '%'
        }

      } else {

        for (let i: number = 0; i <= steps; i++) {
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

        let prompt: HTMLElement = <HTMLElement>slider.querySelector('.fsd__prompt')
        slider.style.left = left + "%";
        prompt.innerHTML = model.currentValue + ''
      }
    }
  }

  fsdResize(model: dataModel, view: View) {
    if (model.vertical === true) return;

    let range: HTMLElement = <HTMLElement>(
      model.target.querySelector(".fsd__range")
    );

    if (model.interval === true) {
      let startSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper')
      let endSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper')
      let sliderWidth: number = startSlider.offsetWidth / range.offsetWidth * 100
      let interval: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__interval')
      let right = 100 - sliderWidth

      let startPos: number = view.stepsWidth * (model.startValue! - 1) - sliderWidth / 2
      if (startPos < 0) startPos = 0
      if (startPos > right) startPos = right

      let endPos: number = view.stepsWidth * (model.endValue! - 1) - sliderWidth / 2
      if (endPos < 0) endPos = 0
      if (endPos > right) endPos = right

      startSlider.style.left = startPos + '%'
      endSlider.style.left = endPos + '%'
      interval.style.width = endPos - startPos + '%'
      interval.style.left = startPos + sliderWidth / 2 + '%'

    } else {
      let slider: HTMLElement = <HTMLElement>(
        model.target.querySelector(".fsd__slider-wrapper")
      );

      let sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100;
      let curPos: number =
        view.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
      if (curPos < 0) curPos = 0;
      let right: number = 100 - sliderWidth;
      if (curPos > right) curPos = right;
      slider.style.left = curPos + "%";
    }

    let scale: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__scale')
    let max: HTMLElement = <HTMLElement>scale.querySelector('.fsd__max')
    let spans = scale.querySelectorAll('span');
    for (let i: number = 1; i < spans.length - 1; i++) {
      let left: number = view.stepsWidth * i;
      spans[i].style.left = left + '%';
    }
    console.log(view.stepsWidth)
    max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%';

  }

}
