import { dataModel } from "./Model";

export default class Controller {
    public boundMove: Function;
    constructor(model: dataModel) {
        model.target.querySelector('.fsd-slider')!.addEventListener('mousedown', () => {
            this.fsdOn(model)
        })
    }

    fsdOn(model: dataModel){
        let shift: number = 0;
        if (model.vertical === true){
            
        } else{
            shift = event.clientX - model.target.querySelector('.fsd-slider')!.getBoundingClientRect().left;
        }
        this.boundMove = this.fsdMove.bind(null, model, shift);
        let boundMove = this.boundMove;
        document.addEventListener('mousemove', boundMove);
        document.addEventListener('mouseup', this.fsdOff);
    }

    fsdMove(model: dataModel, shift: number){

        if (model.vertical === true){

        } else{
            let slider = model.target.querySelector('.fsd-slider')!;
            let range = model.target.querySelector('.fsd-range')!;
            let left = event.clientX - shift - range.getBoundingClientRect().left;
            if (left < 0) left = 0;
            let right = range.offsetWidth - slider.offsetWidth;
            if (left > right) left = right;
            slider.style.left = left + 'px';
        }
    }

    fsdOff(){
        console.log('off')
        let boundMove = this.boundMove;
        document.removeEventListener('mousemove', boundMove);
        document.removeEventListener('mouseup', this.fsdOff);
    }
}
