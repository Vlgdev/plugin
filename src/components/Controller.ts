import Model from "./Model" 
import View from "./View"
import {TKey} from './Model' 

export default class Controller {

  public boundMove: any 
  public boundOff: any 

  constructor(model: Model, view: View) {

    this.fsdInit(model, view) 

  }

  private fsdSettings(model: Model, view: View): void {

    const setterBind = setter.bind(this) 

    for (const key in model) {
      if (this.checkKeyForSettings(key)) continue 

      Object.defineProperty(model.target, key, {
        get: function (): TKey {

          if (key === 'currentValue') {
            if (model.interval === true) return null 
          } else if (key === 'startValue' || key === 'endValue') {
            if (model.interval !== true) return null 
          }

          return model[key] 
        },
        set: function (value) {
          setterBind(value, key)
        }
      })

    }

    function setter(this: Controller, value: number | string | boolean, key: string) {
      if (this.checkKeyForSetter(key)) {
        model[key] = +value 
      } else {
        model[key] = value 
      }

      if (key == 'currentValue') {
        model.checkCurVal() 
      } else if (key == 'startValue') {
        model.checkStartVal() 
      } else if (key == 'endValue') {
        model.checkEndVal() 
      } else if (key == 'min' || key == 'max') {
        model.checkMinMax() 
      }

      view.render(model, key) 
    }
  }

  fsdProtection(model: Model): void {
    Object.defineProperty(model.target, 'model', {
      get: function () {
        return null 
      },
      set: function () {
        console.error('Свойство model не может быть изменено') 
        return false 
      }
    }) 
    Object.defineProperty(model.target, 'view', {
      get: function () {
        return null 
      },
      set: function () {
        console.error('Свойство view не может быть изменено') 
        return false 
      }
    }) 
    Object.defineProperty(model.target, 'controller', {
      get: function () {
        return null 
      },
      set: function () {
        console.error('Свойство controller не может быть изменено') 
        return false 
      }
    }) 
  }

  private fsdInit(model: Model, view: View): void {
    // eslint-disable-next-line fsd/no-function-declaration-in-event-listener
    model.target.addEventListener("mousedown", () => {
      this.fsdOn(model, view, event as MouseEvent) 
    })
    // eslint-disable-next-line fsd/no-function-declaration-in-event-listener
    model.target.addEventListener('click', () => {
      this.fsdInteractive(model, view, event as MouseEvent) 
    })
    // eslint-disable-next-line fsd/no-function-declaration-in-event-listener
    model.target.addEventListener("selectstart", (event) => {
      event.preventDefault() 
    })
    // eslint-disable-next-line fsd/no-function-declaration-in-event-listener
    window.addEventListener("resize", () => {
      this.fsdResize(model, view) 
    })

    this.fsdSettings(model, view) 

    if (model.init) {
      model.init(model.target) 
    }
  }

  private fsdOn(model: Model, view: View, event: MouseEvent) {

    const target: HTMLElement = event.target as HTMLElement 
    if (!target.closest('.fsd__slider')) return 

    let shift = 0 
    if (model.vertical === true) {
      shift = event.clientY - target.getBoundingClientRect().top 
    } else {
      shift = event.clientX - target.getBoundingClientRect().left 
    }

    this.boundMove = this.fsdMove.bind(this, model, view, shift, target.closest('.fsd__slider-wrapper') as HTMLElement) 
    this.boundOff = this.fsdOff.bind(this) 
    document.addEventListener("mousemove", this.boundMove) 
    document.addEventListener("mouseup", this.boundOff) 

  }

  private fsdMove(model: Model, view: View, shift: number, slider: HTMLElement, event: MouseEvent) {

    const range: HTMLElement = model.target.querySelector(".fsd__range") as HTMLElement 
    let sliderSize: number 
    if (model.vertical === true) {
      sliderSize = (slider.offsetHeight / range.offsetHeight) * 100 
    } else {
      sliderSize = (slider.offsetWidth / range.offsetWidth) * 100 
    }

    let distance: number 
    if (model.vertical === true) {
      distance = ((event.clientY - shift - range.getBoundingClientRect().top) / range.offsetHeight) * 100 
    } else {
      distance = ((event.clientX - shift - range.getBoundingClientRect().left) / range.offsetWidth) * 100 
    }

    distance = this.setDistance(model, view, slider, distance, sliderSize)
    if (distance < 0) distance = 0 
    const rightEdge: number = 100 - sliderSize 
    if (distance > rightEdge) distance = rightEdge 

    if (model.vertical === true) {
      slider.style.top = distance + "%" 
    } else {
      slider.style.left = distance + "%" 
    }

    if (model.progressBar === true) {
      const progressBar: HTMLElement = model.target.querySelector('.fsd__progress') as HTMLElement
      const [progressSize, progressDistance] = this.setProgressBar(model, distance, slider, sliderSize)

      if (model.vertical === true) {
        progressBar.style.height = progressSize + '%'
      } else {
        progressBar.style.width = progressSize + '%'
      }

      if (model.interval === true) {
        if (model.vertical === true) {
          progressBar.style.top = progressDistance + '%'
        } else {
          progressBar.style.left = progressDistance + '%'
        }
      }
    }

    if (model.prompt === true && model.interval === true) {
      view.setAndCheckGeneralPrompt(model)
    }

    if (model.onMove) {
      model.onMove(slider, model.target) 
    }
  }

  private fsdOff() {
    document.removeEventListener("mousemove", this.boundMove) 
    document.removeEventListener("mouseup", this.boundOff) 
  }

  private fsdInteractive(model: Model, view: View, event: MouseEvent) {

    const target: HTMLElement = event.target as HTMLElement 

    if (!(target.closest('.fsd__scale') || target.closest('.fsd__range') || target.closest('.fsd__interval') || target.closest('.fsd__progress'))) return 

    const range: HTMLElement = model.target.querySelector(".fsd__range") as HTMLElement 

    let sliderSize: number 
    {
      const slider: HTMLElement = model.target.querySelector(".fsd__slider-wrapper") as HTMLElement 
      if (model.vertical === true) {
        sliderSize = (slider.offsetHeight / range.offsetHeight) * 100 
      } else {
        sliderSize = (slider.offsetWidth / range.offsetWidth) * 100 
      }
    }

    const rightEdge: number = 100 - sliderSize 
    let distance: number 
    if (model.vertical === true) {
      distance = ((event.clientY - range.getBoundingClientRect().top) / range.offsetHeight) * 100 
    } else {
      distance = ((event.clientX - range.getBoundingClientRect().left) / range.offsetWidth) * 100 
    }

    const progressBar: HTMLElement = model.target.querySelector('.fsd__progress') as HTMLElement 

    if (model.interval == true) {

      const startSlider: HTMLElement = model.target.querySelector('.fsd__start-wrapper') as HTMLElement 
      const endSlider: HTMLElement = model.target.querySelector('.fsd__end-wrapper') as HTMLElement 

      let startPos: number 
      let endPos: number 
      if (model.vertical === true) {
        startPos = parseFloat(startSlider.style.top) 
        endPos = parseFloat(endSlider.style.top) 
      } else {
        startPos = parseFloat(startSlider.style.left) 
        endPos = parseFloat(endSlider.style.left) 
      }

      if (startPos < 0) startPos = 0 
      if (startPos > rightEdge) startPos = rightEdge 
      if (endPos < 0) endPos = 0 
      if (endPos > rightEdge) endPos = rightEdge 

      let typePosition: string
      if (distance <= endPos - (endPos - startPos) / 2) {
        typePosition = 'start'
      }
      else {
        typePosition = 'end'
      }

      if (typePosition == 'start') {
        distance = this.setDistance(model, view, startSlider, distance, sliderSize)
      } else if (typePosition == 'end') {
        distance = this.setDistance(model, view, endSlider, distance, sliderSize)
      }

      if (distance < 0) distance = 0 
      if (distance > rightEdge) distance = rightEdge 

      if (typePosition == 'start') {
        if (model.vertical === true) {
          startSlider.style.top = distance + '%'
        } else {
          startSlider.style.left = distance + '%'
        }
      } else {
        if (model.vertical === true) {
          endSlider.style.top = distance + '%'
        } else {
          endSlider.style.left = distance + '%'
        }
      }

      if (model.progressBar === true) {
        const progressBar: HTMLElement = model.target.querySelector('.fsd__progress') as HTMLElement
        const [progressSize, progressDistance] = this.setProgressBar(model, distance, typePosition == 'start' ? startSlider : endSlider, sliderSize)
        if (model.vertical === true) {
          progressBar.style.height = progressSize + '%'
          progressBar.style.top = progressDistance + '%'
        } else {
          progressBar.style.width = progressSize + '%'
          progressBar.style.left = progressDistance + '%'
        }
      }

      if (model.prompt === true) {
        view.setAndCheckGeneralPrompt(model) 
      }

      if (model.onMove) {
        if (typePosition == 'start') {
          model.onMove(startSlider, model.target)
        } else {
          model.onMove(endSlider, model.target)
        }
      }

    } else {
      const slider: HTMLElement = model.target.querySelector(".fsd__slider-wrapper") as HTMLElement 

      distance = this.setDistance(model, view, slider, distance, sliderSize)

      if (distance < 0) distance = 0 
      if (distance > rightEdge) distance = rightEdge 


      if (model.vertical === true) {
        slider.style.top = distance + "%" 
        progressBar.style.height = distance + sliderSize / 2 + '%' 
      } else {
        slider.style.left = distance + "%" 
        progressBar.style.width = distance + sliderSize / 2 + '%' 
      }

      if (model.onMove) {
        model.onMove(slider, model.target)
      }
    }

  }

  private fsdResize(model: Model, view: View) {
    if (model.vertical === true) return 

    const range: HTMLElement = model.target.querySelector(".fsd__range") as HTMLElement 

    if (model.interval === true) {
      const startSlider: HTMLElement = model.target.querySelector('.fsd__start-wrapper') as HTMLElement 
      const endSlider: HTMLElement = model.target.querySelector('.fsd__end-wrapper') as HTMLElement 
      const sliderWidth: number = startSlider.offsetWidth / range.offsetWidth * 100 
      const right: number = 100 - sliderWidth 

      let startPos: number = (model.startValue - model.min) / model.step * view.stepsWidth - sliderWidth / 2
      if (startPos < 0) startPos = 0 
      if (startPos > right) startPos = right 

      let endPos: number = (model.endValue - model.min) / model.step * view.stepsWidth - sliderWidth / 2
      if (endPos < 0) endPos = 0 
      if (endPos > right) endPos = right 

      startSlider.style.left = startPos + '%' 
      endSlider.style.left = endPos + '%' 
      if (model.progressBar === true) {
        const progressBar: HTMLElement = model.target.querySelector('.fsd__progress') as HTMLElement 
        progressBar.style.width = endPos - startPos + '%' 
        progressBar.style.left = startPos + sliderWidth / 2 + '%' 
      }

    } else {
      const slider: HTMLElement = model.target.querySelector(".fsd__slider-wrapper") as HTMLElement 

      const sliderWidth: number = (slider.offsetWidth / range.offsetWidth) * 100 
      let curPos: number = (model.currentValue - model.min) / model.step * view.stepsWidth - sliderWidth / 2
      if (curPos < 0) curPos = 0 
      const right: number = 100 - sliderWidth 
      if (curPos > right) curPos = right 
      slider.style.left = curPos + "%" 
      if (model.progressBar === true) {
        const progressBar: HTMLElement = model.target.querySelector('.fsd__progress') as HTMLElement
        progressBar.style.width = curPos + sliderWidth / 2 + '%' 
      }
    }

    const scale: HTMLElement = model.target.querySelector('.fsd__scale') as HTMLElement 
    const max: HTMLElement = scale.querySelector('.fsd__max') as HTMLElement 
    const min: HTMLElement = scale.querySelector('.fsd__min') as HTMLElement 

    min.style.left = 0 + '%' 
    max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%' 

    const spans: HTMLElement[] = scale.querySelectorAll('span') as unknown as HTMLElement[] 

    for (let i = 0;  i < spans.length - 1;  i++) {
      const distance: number = parseFloat(spans[i + 1].style.left) - (parseFloat(spans[i].style.left) + spans[i].offsetWidth / range.offsetWidth * 100) 

      if (distance < 7 || distance > 10) {

        scale.querySelectorAll('span').forEach(elem => {
          if (elem.classList.contains('fsd__min') || elem.classList.contains('fsd__max')) return 

          elem.remove() 
        })

        if (model.scaleOfValues === true) {
          let curSpan: HTMLElement = min 
          for (let i = 1 ; i < view.steps;  i++) {
            const span: HTMLElement = document.createElement('span') 
            span.innerHTML = model.min + i * model.step + '' 
            max.before(span) 
            const distance: number = view.stepsWidth * i - span.offsetWidth / range.offsetWidth * 100 / 2 
            const condition: number = distance - (parseFloat(curSpan.style.left) + curSpan.offsetWidth / range.offsetWidth * 100) 
            const maxDistance: number = parseFloat(max.style.left) - (distance + span.offsetWidth / range.offsetWidth * 100) 
            if (condition < 7 || maxDistance < 7) {
              span.remove()
            } else {
              span.style.left = distance + '%' 
              curSpan = span 
            }
          }
        }

        break 
      }
    }

  }

  private getPos(view: View, distance: number): { area: number, i: number } {

    let area = 0 
    let i: number 

    for (i = 0; i <= view.steps; i++) {
      area = view.stepsWidth * i 
      if (this.checkNewPos(distance, area, view)) {
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

  private setDistance(model: Model, view: View, slider: HTMLElement, distance: number, sliderSize: number): number {
    let maxPos: number 

    if (model.interval === true && slider.classList.contains('fsd__start-wrapper')) {
      const endWrap: HTMLElement = model.target.querySelector('.fsd__end-wrapper') as HTMLElement 
      if (model.vertical === true)
        maxPos = parseFloat(endWrap.style.top) + sliderSize / 2 
      else
        maxPos = parseFloat(endWrap.style.left) + sliderSize / 2 

      const { area, i } = this.getPos(view, distance) 
      distance = area
      if (distance > maxPos) distance = maxPos 

      distance -= sliderSize / 2 

      model.startValue = model.min + i * model.step 
      model.checkStartVal() 

      if (model.prompt === true) {
        const prompt: HTMLElement = slider.querySelector(".fsd__prompt") as HTMLElement 
        prompt.innerHTML = model.startValue + "" 
      }
    } else if (model.interval === true && slider.classList.contains('fsd__end-wrapper')) {
      const startWrap: HTMLElement = model.target.querySelector('.fsd__start-wrapper') as HTMLElement 
      if (model.vertical === true)
        maxPos = parseFloat(startWrap.style.top) + sliderSize / 2 
      else
        maxPos = parseFloat(startWrap.style.left) + sliderSize / 2 

      const { area, i } = this.getPos(view, distance) 
      distance = area
      if (distance < maxPos) distance = maxPos 

      distance -= sliderSize / 2 
      model.endValue = model.min + i * model.step 
      model.checkEndVal() 

      if (model.prompt === true) {
        const prompt: HTMLElement = slider.querySelector(".fsd__prompt") as HTMLElement 
        prompt.innerHTML = model.endValue + "" 
      }
    } else {
      const { area, i } = this.getPos(view, distance) 

      distance = area - sliderSize / 2 
      model.currentValue = model.min + i * model.step 
      model.checkCurVal() 

      if (model.prompt === true) {
        const prompt: HTMLElement = slider.querySelector(".fsd__prompt") as HTMLElement
         
        prompt.innerHTML = model.currentValue + "" 
      }
    }

    return distance
  }

  private setProgressBar(model: Model, distance: number, slider: HTMLElement, sliderSize: number): [number, number | null] {
    let progressSize: number
    if (model.interval === true) {
      let progressDistance: number

      if (slider.classList.contains('fsd__start-wrapper')) {
        const end: HTMLElement = model.target.querySelector('.fsd__end-wrapper') as HTMLElement 

        if (model.vertical === true) {
          progressSize = parseFloat(end.style.top) - distance 
          progressDistance = distance + sliderSize / 2 
        } else {
          progressSize = parseFloat(end.style.left) - distance 
          progressDistance = distance + sliderSize / 2 
        }

      } else {
        const start: HTMLElement = model.target.querySelector('.fsd__start-wrapper') as HTMLElement 

        if (model.vertical === true) {
          progressSize = distance - parseFloat(start.style.top) 
          progressDistance = parseFloat(start.style.top) + sliderSize / 2 
        } else {
          progressSize = distance - parseFloat(start.style.left) 
          progressDistance = parseFloat(start.style.left) + sliderSize / 2 
        }
      }
      if (progressSize < 0) progressSize = 0 

      return [progressSize, progressDistance]
    } else {
      if (model.vertical === true) {
        progressSize = distance + sliderSize / 2 
      } else {
        progressSize = distance + sliderSize / 2 
      }
      if (progressSize < 0) progressSize = 0 

      return [progressSize, null]
    }
  }

  private checkKeyForSettings(key: string): boolean {
    return key == 'target' || key == 'init' || key == 'onMove' 
  }

  checkKeyForSetter(key: string): boolean {
    return key == 'currentValue' || key == 'startValue' || key == 'endValue' || key == 'min' || key == 'max' || key == 'step' 
  }

  private checkNewPos(distance: number, area: number, view: View): boolean {
    return ((distance <= area && distance >= area - view.stepsWidth / 2) || (distance >= area && distance <= area + view.stepsWidth / 2)) && !(distance > view.steps * view.stepsWidth) && !(distance < 0) 
  }

}


