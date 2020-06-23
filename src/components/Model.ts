export default class Model {
  public target: HTMLElement;
  public max: number;
  public min: number;
  public currentValue: number;
  public vertical: boolean;
  public interval: boolean;
  public step: number;
  public prompt: boolean;
  public scaleOfValues: boolean;
    constructor(params?: dataModel) {
      let {target, min = 1, max = 10, currentValue = min, vertical = false, interval = false, step = 1, prompt = false, scaleOfValues = false} = params!;
      this.target = target!;
      this.min = min;
      this.max = max;
      this.currentValue = currentValue;
      this.vertical = vertical;
      this.interval = interval;
      this.step = step;
      this.prompt = prompt;
      this.scaleOfValues = scaleOfValues;
    }
  }

export  interface dataModel{
    target: Element,
    max?: number,
    min?: number,
    currentValue?: number,
    vertical?: boolean,
    interval?: boolean,
    step?: number,
    prompt?: boolean,
    scaleOfValues?: boolean
  }