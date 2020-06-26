import { dataModel } from "./Model";

export default class View {

    public stepsWidth: number;
    public curPos: number;

    constructor(model: dataModel){
        let fsd = document.createElement('div');
        fsd.classList.add('fsd');
        let fsdInner = document.createElement('div');
        fsdInner.classList.add('fsd-inner');
        let fsdRange = document.createElement('div');
        fsdRange.classList.add('fsd-range');
        fsdInner.append(fsdRange);
        let steps: number = 0;
        let mn: number = model.min!;
        while (mn < model.max!){
            steps++;
            mn += model.step!;
        }
        if (model.interval){
            let startInterval = document.createElement('div');
            let endInterval = document.createElement('div');
            startInterval.classList.add('fsd-start', 'fsd-slider');
            endInterval.classList.add('fsd-end', 'fsd-slider');
            fsd.classList.add('fsd-interval');
            fsdInner.append(startInterval, endInterval);
        } else{
            let slider = document.createElement('div');
            slider.classList.add('fsd-slider');
            fsdInner.append(slider);
        }

        let scaleOfValues = document.createElement('div');
        scaleOfValues.classList.add('fsd-scale');
        let min = document.createElement('span');
        min.classList.add('fsd-min');
        min.innerHTML = '' + model.min;
        scaleOfValues.append(min);
        let max = document.createElement('span');
        max.classList.add('fsd-max');
        max.innerHTML = '' + model.max;
        scaleOfValues.append(max);
        if (model.scaleOfValues){
            let maxEl = scaleOfValues.querySelector('.fsd-max');
            for (let i = model.min! + model.step!; i < model.max!; i += model.step!){
                let value = document.createElement('span')
                value.innerHTML = i + '';
                maxEl?.before(value);
            }
        }
        fsd.append(scaleOfValues);

        if (model.vertical){
            fsd.classList.add('fsd-vertical');
        }

        if (model.prompt){
            let prompt = document.createElement('div');
            prompt.innerHTML = model.currentValue + '';
            prompt.classList.add('fsd-prompt');
            fsdInner.append(prompt);
        }
        fsd.prepend(fsdInner);
        model.target.innerHTML = '';
        model.target.append(fsd);
        scaleOfValues.style.minHeight = max.offsetHeight + 'px';
        let spans = scaleOfValues.querySelectorAll('span');
        this.stepsWidth = fsdRange.offsetWidth / steps / fsdRange.offsetWidth * 100;

        for (let i = 1; i < spans.length - 1; i++){
            let left = this.stepsWidth * i;
            spans[i].style.left = left + '%';
        }
        max.style.left = 100 - max.offsetWidth / fsdRange.offsetWidth * 100 + '%';

        let slider = <HTMLElement>fsdInner.querySelector('.fsd-slider');
        let sliderWidth = slider.offsetWidth / fsdRange.offsetWidth * 100
        let left: number = this.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
        let right: number = 100 - sliderWidth;
        if (left < 0) left = 0;
        if (left > right) left = right;

        slider.style.left = left + '%';
        this.curPos = left;
    }
}