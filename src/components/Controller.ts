import { dataModel } from "./Model";

export default class Controller {
    
    public boundMove: any;
    public boundOff: any;

    constructor(model: dataModel) {
        model.target.querySelector('.fsd-slider')!.addEventListener('mousedown', () => {
            this.fsdOn(model, <MouseEvent>event)
        });
        model.target.querySelector('.fsd-range')!.addEventListener('click', () => {
            this.fsdInteractive(model, <MouseEvent>event);
        });
        model.target.querySelector('.fsd-scale')!.addEventListener('click', () => {
            this.fsdInteractive(model, <MouseEvent>event);
        });
        model.target.addEventListener('selectstart', () => {
            event?.preventDefault();
        })
    }

    fsdOn(model: dataModel, event: MouseEvent){
        let shift: number = 0;
        if (model.vertical === true){
            
        } else{
            shift = event.clientX - model.target.querySelector('.fsd-slider')!.getBoundingClientRect().left;
        }
        this.boundMove = this.fsdMove.bind(null, model, shift);
        this.boundOff = this.fsdOff.bind(null, model);
        document.addEventListener('mousemove', this.boundMove);
        document.addEventListener('mouseup', this.boundOff);
    }

    fsdMove(model: dataModel, shift: number, event: MouseEvent){

        if (model.vertical === true){

        } else{
            let slider = <HTMLElement>model.target.querySelector('.fsd-slider');
            let range = <HTMLElement>model.target.querySelector('.fsd-range');
            let left = event.clientX - shift - range.getBoundingClientRect().left;
            if (left < 0) left = 0;
            let right = range.offsetWidth - slider.offsetWidth;
            if (left > right) left = right;
            slider.style.left = left + 'px';
        }
    }

    fsdOff(model: dataModel){
        let off = model.target.controller.boundOff;
        let move = model.target.controller.boundMove;
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', off);
    }
    fsdInteractive(model: dataModel, event: MouseEvent){
        let slider = <HTMLElement>model.target.querySelector('.fsd-slider');
        let range = <HTMLElement>model.target.querySelector('.fsd-range');
        if (model.vertical === true){
            
        } else{
            let left = event.clientX - slider.offsetWidth / 2 - range.getBoundingClientRect().left;
            let right = range.offsetWidth - slider.offsetWidth;
            if (left < 0) left = 0;
            if (left > right) left = right;
            slider.style.left = left + 'px';
        }
    }
}

