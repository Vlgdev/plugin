import { dataModel } from "./Model";
import View from './View'

export default class Controller {
    
    public boundMove: any;
    public boundOff: any;

    constructor(model: dataModel, view: View) {
        model.target.querySelector('.fsd-slider')!.addEventListener('mousedown', () => {
            this.fsdOn(model, view, <MouseEvent>event)
        });
        model.target.querySelector('.fsd-range')!.addEventListener('click', () => {
            this.fsdInteractive(model, view, <MouseEvent>event);
        });
        model.target.querySelector('.fsd-scale')!.addEventListener('click', () => {
            this.fsdInteractive(model, view, <MouseEvent>event);
        });
        model.target.addEventListener('selectstart', () => {
            event?.preventDefault();
        })
    }

    fsdOn(model: dataModel, view: View, event: MouseEvent){
        let shift: number = 0;
        if (model.vertical === true){
            
        } else{
            shift = event.clientX - model.target.querySelector('.fsd-slider')!.getBoundingClientRect().left;
        }
        this.boundMove = this.fsdMove.bind(null, model, view, shift);
        this.boundOff = this.fsdOff.bind(null, model);
        document.addEventListener('mousemove', this.boundMove);
        document.addEventListener('mouseup', this.boundOff);
    }

    fsdMove(model: dataModel, view: View, shift: number, event: MouseEvent){

        if (model.vertical === true){

        } else{
            let slider = <HTMLElement>model.target.querySelector('.fsd-slider');
            let range = <HTMLElement>model.target.querySelector('.fsd-range');
            let left = (event.clientX - shift - range.getBoundingClientRect().left) / range.offsetWidth * 100;
            let sliderWidth = slider.offsetWidth / range.offsetWidth * 100;
            let curPos: number = view.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
            if (left > curPos + view.stepsWidth / 2){
                left = curPos + view.stepsWidth;
                model.currentValue!++;
            } else if (left < curPos - view.stepsWidth / 2){
                left = curPos - view.stepsWidth;
                model.currentValue!--;
            } else return;
            if (left < 0) left = 0;
            let right = 100 - sliderWidth;
            if (left > right) left = right;
            console.log(left);
            slider.style.left = left + '%';
        }
    }

    fsdOff(model: dataModel){
        let off = model.target.controller.boundOff;
        let move = model.target.controller.boundMove;
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', off);
    }
    fsdInteractive(model: dataModel, view: View, event: MouseEvent){
        let slider = <HTMLElement>model.target.querySelector('.fsd-slider');
        let range = <HTMLElement>model.target.querySelector('.fsd-range');
        if (model.vertical === true){
            
        } else{
            let left = (event.clientX - range.getBoundingClientRect().left) / range.offsetWidth * 100;
            let sliderWidth = slider.offsetWidth / range.offsetWidth * 100;
            let right = 100 - sliderWidth;
            // let curPos = view.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
            let min = model.min!;
            let steps = 0;
            while (min < model.max!){
                min += model.step!;
                steps++;
            }
            for (let i = 0; i < steps; i++){
                let width = view.stepsWidth * i;
                if (left <= width && left >= width - view.stepsWidth / 2 || left >= width && left <= width + view.stepsWidth / 2){
                    left = width - sliderWidth / 2;
                    model.currentValue = (i + 1) * model.step!;
                    console.log(model.currentValue);
                    break;
                }
            }
            if (left < 0) left = 0;
            if (left > right) left = right;
            slider.style.left = left + '%';
        }
    }
}

