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
      this.fsdResize(model, view);
    })

  }

  private fsdOn(model: Model, view: View, event: MouseEvent) {

    let target: HTMLElement = <HTMLElement>event.target;
    if (!target.closest('.fsd__slider')) return;

    let shift: number = 0;
    if (model.vertical === true) {
      shift = event.clientY - target.getBoundingClientRect().top;
    } else {
      shift = event.clientX - target.getBoundingClientRect().left;
    }

    this.boundMove = this.fsdMove.bind(this, model, view, shift, <HTMLElement>target.closest('.fsd__slider-wrapper'));
    this.boundOff = this.fsdOff.bind(this);
    document.addEventListener("mousemove", this.boundMove);
    document.addEventListener("mouseup", this.boundOff);

  }

  private fsdMove(model: Model, view: View, shift: number, slider: HTMLElement, event: MouseEvent) {

    let range: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__range"));
    let sliderSize: number;
    if (model.vertical === true) {
      sliderSize = (slider.offsetHeight / range.offsetHeight) * 100;
    } else {
      sliderSize = (slider.offsetWidth / range.offsetWidth) * 100;
    }

    let progressWidth: number;
    let progressLeft: number;
    let progressBar: HTMLElement;

    let distance: number;
    if (model.vertical === true) {
      distance = ((event.clientY - shift - range.getBoundingClientRect().top) / range.offsetHeight) * 100;
    } else {
      distance = ((event.clientX - shift - range.getBoundingClientRect().left) / range.offsetWidth) * 100;
    }

    let maxPos: number;

    if (model.interval === true && slider.classList.contains('fsd__start-wrapper')) {

      let endWrap: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

      if (model.vertical === true)
        maxPos = parseFloat(endWrap.style.top) + sliderSize / 2;
      else
        maxPos = parseFloat(endWrap.style.left) + sliderSize / 2;

      let { area, i } = this.getPos(view, distance);

      if (area > maxPos) area = maxPos;

      distance = area - sliderSize / 2;

      model.startValue = model.min + i * model.step;
      model.checkStartVal();

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.startValue + "";

      let className: string = model.target.className;
      let startField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__start');
      startField.value = model.startValue + '';

    } else if (model.interval === true && slider.classList.contains('fsd__end-wrapper')) {

      let startWrap: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
      if (model.vertical === true)
        maxPos = parseFloat(startWrap.style.top) + sliderSize / 2;
      else
        maxPos = parseFloat(startWrap.style.left) + sliderSize / 2;

      let { area, i } = this.getPos(view, distance);

      if (area < maxPos) area = maxPos;

      distance = area - sliderSize / 2;
      model.endValue = model.min + i * model.step;
      model.checkEndVal();

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.endValue + "";

      let className: string = model.target.className;
      let endField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__end');
      endField.value = model.endValue + '';

    } else {


      let { area, i } = this.getPos(view, distance);

      distance = area - sliderSize / 2;
      model.currentValue = model.min + i * model.step!;
      model.checkCurVal();

      if (model.prompt === true)
        slider.querySelector(".fsd__prompt")!.innerHTML = model.currentValue + "";

      let className: string = model.target.className;
      let curField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__currentVal');
      curField.value = model.currentValue + '';
    }

    if (distance < 0) distance = 0;
    let rightEdge: number = 100 - sliderSize;
    if (distance > rightEdge) distance = rightEdge;

    if (model.interval === true) {

      if (model.progressBar === true) {
        progressBar = <HTMLElement>model.target.querySelector('.fsd__progress');
      }

      if (slider.classList.contains('fsd__start-wrapper')) {

        let end: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

        if (model.progressBar === true) {
          if (model.vertical === true) {
            progressWidth = parseFloat(end.style.top) - distance;
            progressLeft = distance + sliderSize / 2;
          } else {
            progressWidth = parseFloat(end.style.left) - distance;
            progressLeft = distance + sliderSize / 2;
          }
        }

      } else {

        let start: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');

        if (model.progressBar === true) {
          if (model.vertical === true) {
            progressWidth = distance - parseFloat(start.style.top);
            progressLeft = parseFloat(start.style.top) + sliderSize / 2;
          } else {
            progressWidth = distance - parseFloat(start.style.left);
            progressLeft = parseFloat(start.style.left) + sliderSize / 2;
          }
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

    if (model.interval && model.progressBar === true) {
      if (progressWidth! < 0) progressWidth = 0;

      if (model.vertical === true) {
        progressBar!.style.height = progressWidth! + '%';
        progressBar!.style.top = progressLeft! + '%';
      } else {
        progressBar!.style.width = progressWidth! + '%';
        progressBar!.style.left = progressLeft! + '%';
      }

    }

    if (model.prompt === true && model.interval === true) {
      let start: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
      let end: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

      let startPrompt: HTMLElement = <HTMLElement>start.querySelector('.fsd__prompt');
      let endPrompt: HTMLElement = <HTMLElement>end.querySelector('.fsd__prompt');

      let startDistance: number;
      let endDistance: number;
      let generalPrompt: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__prompt-general');
      if (model.vertical === true) {
        startDistance = startPrompt.getBoundingClientRect().top + startPrompt.offsetHeight;
        endDistance = endPrompt.getBoundingClientRect().top;
        generalPrompt.style.top = parseFloat(start.style.top) + (parseFloat(end.style.top) + sliderSize - parseFloat(start.style.top)) / 2 + '%';
      } else {
        startDistance = startPrompt.getBoundingClientRect().left + startPrompt.offsetWidth;
        endDistance = endPrompt.getBoundingClientRect().left;
        generalPrompt.style.left = parseFloat(start.style.left) + (parseFloat(end.style.left) + sliderSize - parseFloat(start.style.left)) / 2 + '%';
      }


      if (model.endValue == model.startValue) {
        generalPrompt.innerHTML = model.startValue + '';
      } else {
        generalPrompt.innerHTML = model.startValue + (model.vertical === true ? '<span>-</span>' : ' - ') + model.endValue;
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

  private fsdOff() {
    document.removeEventListener("mousemove", this.boundMove);
    document.removeEventListener("mouseup", this.boundOff);
  }

  private fsdInteractive(model: Model, view: View, event: MouseEvent) {

    let target: HTMLElement = <HTMLElement>event.target;

    if (!(target.closest('.fsd__scale') || target.closest('.fsd__range') || target.closest('.fsd__interval') || target.closest('.fsd__progress'))) return;

    let range: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__range"));

    let slider: HTMLElement = <HTMLElement>(model.target.querySelector(".fsd__slider-wrapper"));
    let sliderSize: number;
    if (model.vertical === true) {
      sliderSize = (slider.offsetHeight / range.offsetHeight) * 100;
    } else {
      sliderSize = (slider.offsetWidth / range.offsetWidth) * 100;
    }

    let rightEdge: number = 100 - sliderSize;
    let distance: number;
    if (model.vertical === true) {
      distance = ((event.clientY - range.getBoundingClientRect().top) / range.offsetHeight) * 100;
    } else {
      distance = ((event.clientX - range.getBoundingClientRect().left) / range.offsetWidth) * 100;
    }

    if (model.interval == true) {

      let startSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
      let endSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

      let startPos: number;
      let endPos: number;
      if (model.vertical === true) {
        startPos = parseFloat(startSlider.style.top);
        endPos = parseFloat(endSlider.style.top);
      } else {
        startPos = parseFloat(startSlider.style.left);
        endPos = parseFloat(endSlider.style.left);
      }

      if (startPos < 0) startPos = 0;
      if (startPos > rightEdge) startPos = rightEdge;
      if (endPos < 0) endPos = 0;
      if (endPos > rightEdge) endPos = rightEdge;

      let pos: string

      if (distance <= endPos - (endPos - startPos) / 2) pos = 'start';
      else if (distance >= startPos + (endPos - startPos) / 2) pos = 'end';

      let { area, i } = this.getPos(view, distance);

      distance = area - sliderSize / 2;
      if (pos! == 'start') {
        model.startValue = model.min + i * model.step;
        model.checkStartVal();
      } else {
        model.endValue = model.min + i * model.step;
        model.checkEndVal();
      }

      if (distance < 0) distance = 0;
      if (distance > rightEdge) distance = rightEdge;

      let prompt: HTMLElement;
      let progressBar: HTMLElement;
      let progressWidth: number;
      if (model.progressBar === true) {
        progressBar = <HTMLElement>model.target.querySelector('.fsd__progress');
      }

      if (pos! == 'start') {

        if (model.prompt === true) {
          prompt = <HTMLElement>startSlider.querySelector('.fsd__prompt');
          prompt.innerHTML = model.startValue + '';
        }

        if (model.vertical === true) {
          startSlider.style.top = distance + '%';
          if (model.progressBar === true) {
            progressWidth = endPos - distance;
            if (progressWidth < 0) progressWidth = 0;
            progressBar!.style.height = progressWidth + '%';
            progressBar!.style.top = distance + sliderSize / 2 + '%';
          }
        } else {
          startSlider.style.left = distance + '%';
          if (model.progressBar === true) {
            progressWidth = endPos - distance;
            if (progressWidth < 0) progressWidth = 0;
            progressBar!.style.width = progressWidth + '%';
            progressBar!.style.left = distance + sliderSize / 2 + '%';
          }
        }

        let className: string = model.target.className;
        let startField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__start');
        startField.value = model.startValue + '';

      } else {

        if (model.prompt === true) {
          prompt = <HTMLElement>endSlider.querySelector('.fsd__prompt');
          prompt.innerHTML = model.endValue + '';
        }

        if (model.vertical === true) {
          endSlider.style.top = distance + '%';
          if (model.progressBar === true) {
            progressWidth = distance - startPos;
            if (progressWidth < 0) progressWidth = 0;
            progressBar!.style.height = progressWidth + '%';
            progressBar!.style.top = startPos + sliderSize / 2 + '%';
          }
        } else {
          endSlider.style.left = distance + '%';
          if (model.progressBar === true) {
            progressWidth = distance - startPos;
            if (progressWidth < 0) progressWidth = 0;
            progressBar!.style.width = progressWidth + '%';
            progressBar!.style.left = startPos + sliderSize / 2 + '%';
          }
        }

        let className: string = model.target.className;
        let endField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__end');
        endField.value = model.endValue + '';

      }

      if (model.prompt === true) {
        let start: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
        let end: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');

        let startPrompt: HTMLElement = <HTMLElement>start.querySelector('.fsd__prompt');
        let endPrompt: HTMLElement = <HTMLElement>end.querySelector('.fsd__prompt');

        let startDistance: number;
        let endDistance: number;
        if (model.vertical === true) {
          startDistance = startPrompt.getBoundingClientRect().top + startPrompt.offsetHeight;
          endDistance = endPrompt.getBoundingClientRect().top;
        } else {
          startDistance = startPrompt.getBoundingClientRect().left + startPrompt.offsetWidth;
          endDistance = endPrompt.getBoundingClientRect().left;
        }

        let generalPrompt: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__prompt-general');
        if (model.endValue == model.startValue) {
          generalPrompt.innerHTML = model.startValue + '';
        } else {
          generalPrompt.innerHTML = model.startValue + (model.vertical === true ? '<span>-</span>' : ' - ') + model.endValue;
        }
        if (model.vertical === true) {
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

      let { area, i } = this.getPos(view, distance);

      distance = area - sliderSize / 2;
      model.currentValue = model.min + i * model.step!;
      model.checkCurVal();

      if (distance < 0) distance = 0;
      if (distance > rightEdge) distance = rightEdge;

      let prompt: HTMLElement;
      if (model.prompt === true)
        prompt = <HTMLElement>slider.querySelector('.fsd__prompt');

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
        prompt!.innerHTML = model.currentValue + '';

      let className: string = model.target.className;
      let curField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__currentVal');
      curField.value = model.currentValue + '';
    }
  }

  private fsdResize(model: Model, view: View) {
    if (model.vertical === true) return;

    let range: HTMLElement = <HTMLElement>(
      model.target.querySelector(".fsd__range")
    );

    if (model.interval === true) {
      let startSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
      let endSlider: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');
      let sliderWidth: number = startSlider.offsetWidth / range.offsetWidth * 100;
      let progressBar: HTMLElement;
      if (model.progressBar === true) {
        progressBar = <HTMLElement>model.target.querySelector('.fsd__progress');
      }
      let right: number = 100 - sliderWidth;

      let startPos: number = view.stepsWidth * (model.startValue! - 1) - sliderWidth / 2;
      if (startPos < 0) startPos = 0;
      if (startPos > right) startPos = right;

      let endPos: number = view.stepsWidth * (model.endValue! - 1) - sliderWidth / 2;
      if (endPos < 0) endPos = 0;
      if (endPos > right) endPos = right;

      startSlider.style.left = startPos + '%';
      endSlider.style.left = endPos + '%';
      progressBar!.style.width = endPos - startPos + '%';
      progressBar!.style.left = startPos + sliderWidth / 2 + '%';

    } else {
      let slider: HTMLElement = <HTMLElement>(
        model.target.querySelector(".fsd__slider-wrapper")
      );

      let sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100;
      let curPos: number = view.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
      if (curPos < 0) curPos = 0;
      let right: number = 100 - sliderWidth;
      if (curPos > right) curPos = right;
      slider.style.left = curPos + "%";
    }

    let scale: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__scale');
    let max: HTMLElement = <HTMLElement>scale.querySelector('.fsd__max');
    let min: HTMLElement = <HTMLElement>scale.querySelector('.fsd__min');

    min.style.left = 0 + '%';
    max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%';

    let spans: NodeListOf<HTMLSpanElement> = scale.querySelectorAll('span');

    for (let i = 0; i < spans.length - 1; i++) {
      let distance: number = parseFloat(spans[i + 1].style.left) - (parseFloat(spans[i].style.left) + spans[i].offsetWidth / range.offsetWidth * 100);

      if (distance < 7){

        scale.querySelectorAll('span').forEach(elem => {
          if (elem.classList.contains('fsd__min') || elem.classList.contains('fsd__max')) return;
    
          elem.remove();
        })
    
        if (model.scaleOfValues === true) {
          let curSpan: HTMLElement = min;
          for (let i: number = 1; i < view.steps; i++) {
            let span: HTMLElement = document.createElement('span');
            span.innerHTML = model.min + i * model.step! + '';
            max.before(span);
            let distance: number = view.stepsWidth * i - span.offsetWidth / range.offsetWidth * 100 / 2;
            let condition: number = distance - (parseFloat(curSpan.style.left) + curSpan.offsetWidth / range.offsetWidth * 100);
            let maxDistance: number = parseFloat(max.style.left) - (distance + span.offsetWidth / range.offsetWidth * 100);
            if (condition < 7 || maxDistance < 7) {
              span.remove()
            } else {
              span.style.left = distance + '%';
              curSpan = span;
            }
          }
        }
        
        break;
      }
    }

    

  }

  private getPos(view: View, distance: number): { area: number, i: number } {

    let area: number = 0;
    let i: number;

    for (i = 0; i <= view.steps; i++) {
      area = view.stepsWidth * i;
      if (
        ((distance <= area && distance >= area - view.stepsWidth / 2) ||
          (distance >= area && distance <= area + view.stepsWidth / 2)) &&
        !(distance > view.steps * view.stepsWidth) &&
        !(distance < 0)
      ) {
        return { area, i };
      }
    }

    if (distance > view.steps * view.stepsWidth) {
      return {
        area: view.steps * view.stepsWidth,
        i: view.steps
      };
    }

    return {
      area: 0,
      i: 0
    };

  }

  fsdProtection(model: Model, view: View) {
    Object.defineProperty(model.target, 'model', {
      get: function() {
        return undefined;
      },
      set: function(){
        console.log('Свойство model не может быть изменено');
        return false;
      }
    });
    Object.defineProperty(model.target, 'view', {
      get: function() {
        return undefined;
      },
      set: function(){
        console.log('Свойство view не может быть изменено');
        return false;
      }
    });
    Object.defineProperty(model.target, 'controller', {
      get: function() {
        return undefined;
      },
      set: function(){
        console.log('Свойство controller не может быть изменено');
        return false;
      }
    });

    for (let key in model) {
      if (key === 'target') continue;

      Object.defineProperty(model.target, key, {
        get: function () {

          if (key === 'currentValue') {
            if (model.interval === true) return null;
          } else if (key === 'startValue' || key === 'endValue') {
            if (model.interval !== true) return null;
          }

          return model[key];
        },
        set: function (value) {

          if (key == 'currentValue' || key == 'startValue' || key == 'endValue' || key == 'min' || key == 'max' || key == 'step') {
            model[key] = +value;
          } else {
            model[key] = value;
          }

          if (key == 'currentValue') {
            model.checkCurVal();
          } else if (key == 'startValue') {
            model.checkStartVal();
          } else if (key == 'endValue') {
            model.checkEndVal();
          } else if (key == 'min' || key == 'max') {
            model.checkMinMax();
          }

          view.render(model, key);
        }
      })

    }
  }

}


