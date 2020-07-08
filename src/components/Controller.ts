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
      shift = event.clientY - target.getBoundingClientRect().top
    } else {
      shift = event.clientX - target.getBoundingClientRect().left;
    }

    this.boundMove = this.fsdMove.bind(null, model, view, shift, <HTMLElement>target.closest('.fsd__slider-wrapper'));
    this.boundOff = this.fsdOff.bind(null, model);
    document.addEventListener("mousemove", this.boundMove);
    document.addEventListener("mouseup", this.boundOff);

  }

  fsdMove(model: dataModel, view: View, shift: number, slider: HTMLElement, event: MouseEvent) {

    let range: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__range"))
    let sliderSize: number
    if (model.vertical === true) {
      sliderSize = (slider.offsetHeight / range.offsetHeight) * 100
    } else {
      sliderSize = (slider.offsetWidth / range.offsetWidth) * 100
    }

    let interval: HTMLElement
    let widthInterval: number
    let leftInterval: number

    let distance: number
    if (model.vertical === true) {
      distance = ((event.clientY - shift - range.getBoundingClientRect().top) / range.offsetHeight) * 100
    } else {
      distance = ((event.clientX - shift - range.getBoundingClientRect().left) / range.offsetWidth) * 100
    }

    let curPos: number

    if (model.interval === true && slider.classList.contains('fsd__start-wrapper')) {

      curPos = view.stepsWidth * (model.startValue! - 1) - sliderSize / 2;

      let { area, i } = model.target.controller.getPos(model, view, distance)

      if (area > view.stepsWidth * (model.endValue! - 1)) return

      distance = area - sliderSize / 2
      model.startValue = (i + 1) * model.step!
      // if (model.startValue < model.min!){
      //   model.startValue = model.min
      // }

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.startValue + "";

    } else if (model.interval === true && slider.classList.contains('fsd__end-wrapper')) {

      curPos = view.stepsWidth * (model.endValue! - 1) - sliderSize / 2;

      let { area, i } = model.target.controller.getPos(model, view, distance)

      if (area < view.stepsWidth * (model.startValue! - 1)) return

      distance = area - sliderSize / 2
      model.endValue = (i + 1) * model.step!
      // if (model.endValue > model.max!){
      //   model.endValue = model.max
      // }

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.endValue + "";

    } else {

      curPos = view.stepsWidth * (model.currentValue! - 1) - sliderSize / 2;

      let { area, i } = model.target.controller.getPos(model, view, distance)

      distance = area - sliderSize / 2
      model.currentValue = (i + 1) * model.step!
      // if (model.currentValue > model.max!){
      //   model.currentValue = model.max
      // } else if (model.currentValue < model.min!){
      //   model.currentValue = model.min
      // }

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.currentValue + "";
    }

    if (distance < 0) distance = 0;
    let rightEdge: number = 100 - sliderSize;
    if (distance > rightEdge) distance = rightEdge;

    if (model.interval === true) {

      interval = <HTMLElement>model.target.querySelector('.fsd__interval')

      if (slider.classList.contains('fsd__start-wrapper')) {

        let end: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper')

        if (model.vertical === true) {
          widthInterval = parseFloat(end.style.top) - distance
          leftInterval = distance + sliderSize / 2
        } else {
          widthInterval = parseFloat(end.style.left) - distance
          leftInterval = distance + sliderSize / 2
        }

      } else {

        let start: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper')

        if (model.vertical === true) {
          widthInterval = distance - parseFloat(start.style.top)
          leftInterval = parseFloat(start.style.top) + sliderSize / 2
        } else {
          widthInterval = distance - parseFloat(start.style.left)
          leftInterval = parseFloat(start.style.left) + sliderSize / 2
        }

      }
    }

    if (model.vertical === true) {
      slider.style.top = distance + "%";
    } else {
      slider.style.left = distance + "%";
    }

    if (model.interval) {
      if (widthInterval! < 0) widthInterval = 0

      if (model.vertical === true) {
        interval!.style.height = widthInterval! + '%'
        interval!.style.top = leftInterval! + '%'
      } else {
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
    let sliderSize: number
    if (model.vertical === true) {
      sliderSize = (slider.offsetHeight / range.offsetHeight) * 100
    } else {
      sliderSize = (slider.offsetWidth / range.offsetWidth) * 100
    }

    let rightEdge: number = 100 - sliderSize;
    let distance: number
    if (model.vertical === true) {
      distance = ((event.clientY - range.getBoundingClientRect().top) / range.offsetHeight) * 100
    } else {
      distance = ((event.clientX - range.getBoundingClientRect().left) / range.offsetWidth) * 100
    }

    if (model.interval == true) {

      let startSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper')
      let endSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper')

      let startPos: number = view.stepsWidth * (model.startValue! - 1) - sliderSize / 2
      let endPos: number = view.stepsWidth * (model.endValue! - 1) - sliderSize / 2

      if (startPos < 0) startPos = 0
      if (startPos > rightEdge) startPos = rightEdge
      if (endPos < 0) endPos = 0
      if (endPos > rightEdge) endPos = rightEdge

      let pos: string

      if (distance <= endPos - (endPos - startPos) / 2) pos = 'start'
      else if (distance >= startPos + (endPos - startPos) / 2) pos = 'end'

      let { area, i } = this.getPos(model, view, distance)

      distance = area - sliderSize / 2
      if (pos! == 'start') {
        model.startValue = (i + 1) * model.step!
      } else {
        model.endValue = (i + 1) * model.step!
      }

      if (distance < 0) distance = 0;
      if (distance > rightEdge) distance = rightEdge;

      let prompt: HTMLElement
      let interval: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__interval')

      if (pos! == 'start') {
        prompt = <HTMLElement>startSlider.querySelector('.fsd__prompt')
        prompt.innerHTML = model.startValue + ''
        if (model.vertical === true) {
          startSlider.style.top = distance + '%'
          interval.style.height = endPos - distance + '%'
          interval.style.top = distance + sliderSize / 2 + '%'
        } else {
          startSlider.style.left = distance + '%'
          interval.style.width = endPos - distance + '%'
          interval.style.left = distance + sliderSize / 2 + '%'
        }

      } else {
        prompt = <HTMLElement>endSlider.querySelector('.fsd__prompt')
        prompt.innerHTML = model.endValue + ''

        if (model.vertical === true) {
          endSlider.style.top = distance + '%'
          interval.style.height = distance - startPos + '%'
          interval.style.top = startPos + sliderSize / 2 + '%'
        } else {
          endSlider.style.left = distance + '%'
          interval.style.width = distance - startPos + '%'
          interval.style.left = startPos + sliderSize / 2 + '%'
        }

      }

    } else {

      let { area, i } = this.getPos(model, view, distance)

      distance = area - sliderSize / 2;
      model.currentValue = (i + 1) * model.step!;

      if (distance < 0) distance = 0;
      if (distance > rightEdge) distance = rightEdge;

      let prompt: HTMLElement = <HTMLElement>slider.querySelector('.fsd__prompt')

      if (model.vertical === true) {
        slider.style.top = distance + "%";
      } else {
        slider.style.left = distance + "%";
      }

      prompt.innerHTML = model.currentValue + ''
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
    max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%';

    let s: number = 0
    let nextSpan: number
    let distance: number
    while (s < spans.length - 1) {
      nextSpan = 1
      let cur = s == 0 ? 0 : parseInt(spans[s].style.left)
      distance = parseInt(spans[s + nextSpan].style.left) - cur

      while (distance < spans[s].offsetWidth / range.offsetWidth * 100 + 10) {
        if (spans[s + nextSpan].classList.contains('fsd__max')) {
          spans[s].classList.add('hidden')
          break
        }

        spans[s + nextSpan].classList.add('hidden')
        nextSpan++

        distance = parseInt(spans[s + nextSpan].style.left) - cur
      }

      if (spans[s + nextSpan].classList.contains('hidden'))
        spans[s + nextSpan].classList.remove('hidden')

      s += nextSpan

    }

  }

  getPos(model: dataModel, view: View, distance: number): { area: number, i: number } {

    let min: number = model.min!;
    let steps: number = 0;
    while (min < model.max!) {
      min += model.step!;
      steps++;
    }

    let area: number = 0
    let i: number

    for (i = 0; i <= steps; i++) {
      area = view.stepsWidth * i
      if (
        ((distance <= area && distance >= area - view.stepsWidth / 2) ||
          (distance >= area && distance <= area + view.stepsWidth / 2)) &&
        !(distance > steps * view.stepsWidth) &&
        !(distance < 0)
      ) {
        return { area, i }
      }
    }

    if (distance > steps * view.stepsWidth) {
      return {
        area: steps * view.stepsWidth,
        i: steps
      }
    }

    return {
      area: 0,
      i: 0
    }

  }

}


