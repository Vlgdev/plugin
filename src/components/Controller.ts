import Model from "./Model";
import View from "./View";

export default class Controller {

  public boundMove: any;
  public boundOff: any;

  constructor(model: Model, view: View) {

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

    for (let key in model) {
      if (key === 'target') continue

      Object.defineProperty(model.target, key, {
        get: function () {

          if (key === 'currentValue') {
            if (this.model.interval === true) return null
          } else if (key === 'startValue' || key === 'endValue') {
            if (this.model.interval !== true) return null
          }

          return this.model[key]
        },
        set: function (value) {
          this.model[key] = value
          this.model.checkData()
          this.view.render(this.model, key)
        }
      })

    }

  }

  fsdOn(model: Model, view: View, event: MouseEvent) {

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

  fsdMove(model: Model, view: View, shift: number, slider: HTMLElement, event: MouseEvent) {

    let range: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__range"))
    let sliderSize: number
    if (model.vertical === true) {
      sliderSize = (slider.offsetHeight / range.offsetHeight) * 100
    } else {
      sliderSize = (slider.offsetWidth / range.offsetWidth) * 100
    }

    let interval: HTMLElement;
    let widthInterval: number;
    let leftInterval: number;
    let progressBar: HTMLElement;

    let distance: number
    if (model.vertical === true) {
      distance = ((event.clientY - shift - range.getBoundingClientRect().top) / range.offsetHeight) * 100
    } else {
      distance = ((event.clientX - shift - range.getBoundingClientRect().left) / range.offsetWidth) * 100
    }

    let maxPos: number;

    if (model.interval === true && slider.classList.contains('fsd__start-wrapper')) {

      let endWrap: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

      if (model.vertical === true)
        maxPos = parseFloat(endWrap.style.top) + sliderSize / 2;
      else
        maxPos = parseFloat(endWrap.style.left) + sliderSize / 2;

      let { area, i } = model.target.controller.getPos(model, view, distance);

      if (area > maxPos) area = maxPos;

      distance = area - sliderSize / 2

      model.startValue = model.min + i * model.step
      model.checkStartVal()

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.startValue + "";

    } else if (model.interval === true && slider.classList.contains('fsd__end-wrapper')) {

      let startWrap: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper')
      if (model.vertical === true)
        maxPos = parseFloat(startWrap.style.top) + sliderSize / 2;
      else
        maxPos = parseFloat(startWrap.style.left) + sliderSize / 2;

      let { area, i } = model.target.controller.getPos(model, view, distance)

      if (area < maxPos) area = maxPos

      distance = area - sliderSize / 2
      model.endValue = model.min + i * model.step
      model.checkEndVal()

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.endValue + "";

    } else {


      let { area, i } = model.target.controller.getPos(model, view, distance)

      distance = area - sliderSize / 2
      model.currentValue = model.min + i * model.step!
      model.checkCurVal();

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

    if (model.progressBar === true && model.interval !== true) {
      progressBar = <HTMLElement>model.target.querySelector('.fsd__progress');
    }

    if (model.vertical === true) {
      slider.style.top = distance + "%";
    } else {
      slider.style.left = distance + "%";
    }

    if (model.progressBar === true && model.interval !== true) {
      if (model.vertical === true) {
        progressBar!.style.height = distance + sliderSize / 2 + '%';
      } else {
        progressBar!.style.width = distance + sliderSize / 2 + '%';
      }
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

    if (model.prompt === true && model.interval === true) {
      let start: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
      let end: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

      let startPrompt: HTMLElement = <HTMLElement>start.querySelector('.fsd__prompt');
      let endPrompt: HTMLElement = <HTMLElement>end.querySelector('.fsd__prompt');

      let startDistance: number
      let endDistance: number
      let generalPrompt: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__prompt-general');
      if (model.vertical === true) {
        startDistance = startPrompt.getBoundingClientRect().top + startPrompt.offsetHeight;
        endDistance = endPrompt.getBoundingClientRect().top
        generalPrompt.style.top = parseFloat(start.style.top) + (parseFloat(end.style.top) + sliderSize - parseFloat(start.style.top)) / 2 + '%';
      } else {
        startDistance = startPrompt.getBoundingClientRect().left + startPrompt.offsetWidth;
        endDistance = endPrompt.getBoundingClientRect().left
        generalPrompt.style.left = parseFloat(start.style.left) + (parseFloat(end.style.left) + sliderSize - parseFloat(start.style.left)) / 2 + '%';
      }


      if (model.endValue == model.startValue) {
        generalPrompt.innerHTML = model.startValue + '';
      } else {
        generalPrompt.innerHTML = model.startValue + ' - ' + model.endValue;
      }

      if (endDistance - startDistance <= 0) {
        startPrompt.style.visibility = 'hidden';
        endPrompt.style.visibility = 'hidden';
        generalPrompt.style.visibility = 'visible';
      } else {
        startPrompt.style.visibility = 'visible';
        endPrompt.style.visibility = 'visible';
        generalPrompt.style.visibility = 'hidden';
      }
    }

  }

  fsdOff(model: Model) {

    let off = model.target.controller.boundOff;
    let move = model.target.controller.boundMove;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", off);

  }

  fsdInteractive(model: Model, view: View, event: MouseEvent) {

    let target: HTMLElement = <HTMLElement>event.target

    if (!(target.closest('.fsd__scale') || target.closest('.fsd__range') || target.closest('.fsd__interval') || target.closest('.fsd__progress'))) return;

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

      let startPos: number
      let endPos: number
      if (model.vertical === true){
        startPos = parseFloat(startSlider.style.top);
        endPos = parseFloat(endSlider.style.top);
      } else {
        startPos = parseFloat(startSlider.style.left);
        endPos = parseFloat(endSlider.style.left);
      }

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
        model.startValue = model.min + i * model.step;
        model.checkStartVal();
      } else {
        model.endValue = model.min + i * model.step
        model.checkEndVal();
      }

      if (distance < 0) distance = 0;
      if (distance > rightEdge) distance = rightEdge;

      let prompt: HTMLElement
      let interval: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__interval')
      let intervalWidth: number;

      if (pos! == 'start') {

        if (model.prompt === true){
          prompt = <HTMLElement>startSlider.querySelector('.fsd__prompt')
          prompt.innerHTML = model.startValue + ''
        }
        
        if (model.vertical === true) {
          startSlider.style.top = distance + '%'
          intervalWidth = endPos - distance;
          if (intervalWidth < 0) intervalWidth = 0
          interval.style.height = intervalWidth + '%'
          interval.style.top = distance + sliderSize / 2 + '%'
        } else {
          startSlider.style.left = distance + '%'
          intervalWidth = endPos - distance;
          if (intervalWidth < 0) intervalWidth = 0
          interval.style.width = intervalWidth + '%'
          interval.style.left = distance + sliderSize / 2 + '%'
        }

      } else {

        if (model.prompt === true){
          prompt = <HTMLElement>endSlider.querySelector('.fsd__prompt')
          prompt.innerHTML = model.endValue + ''
        }

        if (model.vertical === true) {
          endSlider.style.top = distance + '%'
          intervalWidth = distance - startPos;
          if (intervalWidth < 0) intervalWidth = 0;
          interval.style.height = intervalWidth + '%'
          interval.style.top = startPos + sliderSize / 2 + '%'
        } else {
          endSlider.style.left = distance + '%'
          intervalWidth = distance - startPos;
          if (intervalWidth < 0) intervalWidth = 0;
          interval.style.width = intervalWidth + '%'
          interval.style.left = startPos + sliderSize / 2 + '%'
        }

      }

      if (model.prompt === true) {
        let start: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
        let end: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

        let startPrompt: HTMLElement = <HTMLElement>start.querySelector('.fsd__prompt');
        let endPrompt: HTMLElement = <HTMLElement>end.querySelector('.fsd__prompt');

        let startDistance: number
        let endDistance: number
        if (model.vertical === true) {
          startDistance = startPrompt.getBoundingClientRect().top + startPrompt.offsetHeight;
          endDistance = endPrompt.getBoundingClientRect().top
          console.log('vert')
        } else {
          startDistance = startPrompt.getBoundingClientRect().left + startPrompt.offsetWidth;
          endDistance = endPrompt.getBoundingClientRect().left
          console.log('hor')
        }

        let generalPrompt: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__prompt-general');
        if (model.endValue == model.startValue) {
          generalPrompt.innerHTML = model.startValue + '';
        } else {
          generalPrompt.innerHTML = model.startValue + ' - ' + model.endValue;
        }
        if (model.vertical === true){
          generalPrompt.style.top = parseFloat(start.style.top) + (parseFloat(end.style.top) + sliderSize - parseFloat(start.style.top)) / 2 + '%';
        } else {
          generalPrompt.style.left = parseFloat(start.style.left) + (parseFloat(end.style.left) + sliderSize - parseFloat(start.style.left)) / 2 + '%';
        }
        

        if (endDistance - startDistance <= 0) {
          startPrompt.style.visibility = 'hidden';
          endPrompt.style.visibility = 'hidden';
          generalPrompt.style.visibility = 'visible';
        } else {
          startPrompt.style.visibility = 'visible';
          endPrompt.style.visibility = 'visible';
          generalPrompt.style.visibility = 'hidden';
        }
      }

    } else {

      let { area, i } = this.getPos(model, view, distance)

      distance = area - sliderSize / 2;
      model.currentValue = model.min + i * model.step!
      model.checkCurVal();

      if (distance < 0) distance = 0;
      if (distance > rightEdge) distance = rightEdge;

      let prompt: HTMLElement
      if (model.prompt === true)
        prompt = <HTMLElement>slider.querySelector('.fsd__prompt')

      let progressBar: HTMLElement;
      if (model.progressBar === true)
        progressBar = <HTMLElement>model.target.querySelector('.fsd__progress');

      if (model.vertical === true) {
        slider.style.top = distance + "%";
        progressBar!.style.height = distance + sliderSize / 2 + '%';
      } else {
        slider.style.left = distance + "%";
        progressBar!.style.width = distance + sliderSize / 2 + '%';
      }

      if (model.prompt === true)
        prompt!.innerHTML = model.currentValue + ''
    }
  }

  fsdResize(model: Model, view: View) {
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
      let left: number = view.stepsWidth * i - spans[i].offsetWidth / range.offsetWidth * 100 / 2;
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

  getPos(model: Model, view: View, distance: number): { area: number, i: number } {

    let area: number = 0
    let i: number

    for (i = 0; i <= view.steps; i++) {
      area = view.stepsWidth * i
      if (
        ((distance <= area && distance >= area - view.stepsWidth / 2) ||
          (distance >= area && distance <= area + view.stepsWidth / 2)) &&
        !(distance > view.steps * view.stepsWidth) &&
        !(distance < 0)
      ) {
        return { area, i }
      }
    }

    if (distance > view.steps * view.stepsWidth) {
      return {
        area: view.steps * view.stepsWidth,
        i: view.steps
      }
    }

    return {
      area: 0,
      i: 0
    }

  }

}


