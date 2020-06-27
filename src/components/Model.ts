import {rangeItem} from '../index';

export default class Model {

  public target: rangeItem;
  public max: number;
  public min: number;
  public currentValue: number;
  public vertical: boolean;
  public interval: boolean;
  public startValue: number;
  public endValue: number;
  public step: number;
  public prompt: boolean;
  public scaleOfValues: boolean;

    constructor(params: dataModel) {
      let {target, min = 1, max = 10, currentValue = min, vertical = false, interval = false, step = 1, prompt = true, scaleOfValues = false, startValue = min, endValue = max} = params!;
      this.target = target!;
      this.min = min;
      this.max = max;
      this.currentValue = currentValue;
      this.vertical = vertical;
      this.interval = interval;
      this.startValue = startValue;
      this.endValue = endValue;
      this.step = step;
      this.prompt = prompt;
      this.scaleOfValues = scaleOfValues;
    }
  }



export  interface dataModel{
    target: rangeItem,
    max?: number,
    min?: number,
    currentValue?: number,
    vertical?: boolean,
    interval?: boolean,
    startValue?: number,
    endValue?: number,
    step?: number,
    prompt?: boolean,
    scaleOfValues?: boolean
  }