export type TKey = boolean | number | CallableFunction | string | HTMLElement | void | null

export default class Model {

  public target: HTMLElement
  public max: number
  public min: number
  public currentValue: number
  public vertical: boolean
  public interval: boolean
  public startValue: number
  public endValue: number
  public step: number
  public prompt: boolean
  public scaleOfValues: boolean
  public progressBar: boolean
  public init?: CallableFunction
  public onMove?: CallableFunction
  [key: string]: TKey

  constructor(params: dataModel) {
    const { target, min = 1, max = 10, currentValue = min, vertical = false, interval = false, step = 1, prompt = true, scaleOfValues = false, startValue = min, endValue = max, progressBar = true, init, onMove } = params 
    this.target = target 
    this.min = min 
    this.max = max 
    this.currentValue = currentValue 
    this.vertical = vertical 
    this.interval = interval 
    this.startValue = startValue 
    this.endValue = endValue 
    this.step = step 
    this.prompt = prompt 
    this.scaleOfValues = scaleOfValues 
    this.progressBar = progressBar 
    this.checkMinMax() 
    this.checkCurVal() 
    this.checkStartVal() 
    this.checkEndVal() 
    if (init) {
      this.init = init 
    }
    if (onMove) {
      this.onMove = onMove 
    }
  }

  checkMinMax(): void {

    if (this.min >= this.max) {
      this.min = this.max - this.step 
    }

    if (this.max - this.min < this.step) {
      this.step = this.max - this.min 
    }

  }

  checkCurVal(): void {
    if (this.currentValue < this.min) {
      this.currentValue = this.min 
    } else if (this.currentValue > this.max) {
      this.currentValue = this.max 
    }

    const value: number | boolean = this.checkValue(this.currentValue) 
    if (value !== false) {
      this.currentValue = value 
    }

  }
  checkStartVal(): void {
    if (this.startValue < this.min) {
      this.startValue = this.min 
    } else if (this.conditionForCheckStartVal()) {
      this.startValue = this.endValue 
    } else if (this.startValue > this.max) {
      this.startValue = this.max 
    }

    const value: number | boolean = this.checkValue(this.startValue) 
    if (value !== false) {
      this.startValue = value 
    }

  }

  private conditionForCheckStartVal(): boolean {
    return this.startValue > this.endValue && this.endValue >= this.min && this.endValue <= this.max 
  }

  checkEndVal(): void {
    if (this.endValue > this.max) {
      this.endValue = this.max 
    } else if (this.endValue < this.startValue) {
      this.endValue = this.startValue 
    }

    const value: number | boolean = this.checkValue(this.endValue) 
    if (value !== false) {
      this.endValue = value 
    }

  }

  checkValue(value: number): number | false {
    for (let i = this.min;  i < this.max;  i += this.step) {
      let nextValue: number = i + this.step 
      if (nextValue > this.max)
        nextValue = this.max
      if (value > i && value < nextValue) {
        return i 
      }
    }
    return false 
  }

}

export interface dataModel {
  target: HTMLElement,
  max?: number,
  min?: number,
  currentValue?: number,
  vertical?: boolean,
  interval?: boolean,
  startValue?: number,
  endValue?: number,
  step?: number,
  prompt?: boolean,
  scaleOfValues?: boolean,
  progressBar?: boolean,
  init?: CallableFunction,
  onMove?: CallableFunction
}