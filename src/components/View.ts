import { dataModel } from "./Model";

export default class View {

    public stepsWidth: number;

    constructor(model: dataModel){

        let fsd: HTMLElement;
        let fsdInner: HTMLElement;
        let fsdRange: HTMLElement;
        let steps: number = 0;
        let mn: number = model.min!;
        let startIntervalWrapper: HTMLElement;
        let startInterval: HTMLElement;
        let endIntervalWrapper: HTMLElement;
        let endInterval: HTMLElement;
        let sliderWrapper: HTMLElement;
        let slider: HTMLElement;
        let scaleOfValues: HTMLElement;
        let min: HTMLElement;
        let max: HTMLElement;
        let prompt: HTMLElement;
        let spans;

        fsd = document.createElement('div');
        fsd.classList.add('fsd');
        fsdInner = document.createElement('div');
        fsdInner.classList.add('fsd-inner');

        fsdRange = document.createElement('div');
        fsdRange.classList.add('fsd-range');
        fsdInner.append(fsdRange);

        while (mn < model.max!){
            steps++;
            mn += model.step!;
        }

        if (model.interval){
            startIntervalWrapper = document.createElement('div');
            startIntervalWrapper.classList.add('fsd-startWrapper', 'fsd-sliderWrapper');
            startInterval = document.createElement('div');
            startIntervalWrapper.append(startInterval);
            startInterval.classList.add('fsd-start', 'fsd-slider');

            endIntervalWrapper = document.createElement('div');
            endIntervalWrapper.classList.add('fsd-endWrapper', 'fsd-sliderWrapper');
            endInterval = document.createElement('div');
            endInterval.classList.add('fsd-end', 'fsd-slider');
            endIntervalWrapper.append(endInterval);
            
            fsd.classList.add('fsd-interval');
            fsdInner.append(startIntervalWrapper, endIntervalWrapper);
        } else{
            sliderWrapper = document.createElement('div');
            sliderWrapper.classList.add('fsd-sliderWrapper');
            slider = document.createElement('div');
            slider.classList.add('fsd-slider');
            sliderWrapper.append(slider);
            fsdInner.append(sliderWrapper);
        }

        scaleOfValues = document.createElement('div');
        scaleOfValues.classList.add('fsd-scale');
        min = document.createElement('span');
        min.classList.add('fsd-min');
        min.innerHTML = '' + model.min;
        scaleOfValues.append(min);
        max = document.createElement('span');
        max.classList.add('fsd-max');
        max.innerHTML = '' + model.max;
        scaleOfValues.append(max);
        if (model.scaleOfValues){
            let maxEl: HTMLElement = <HTMLElement>scaleOfValues.querySelector('.fsd-max');
            for (let i: number = model.min! + model.step!; i < model.max!; i += model.step!){
                let value: HTMLElement = document.createElement('span')
                value.innerHTML = i + '';
                maxEl?.before(value);
            }
        }
        fsd.append(scaleOfValues);

        if (model.vertical){
            fsd.classList.add('fsd-vertical');
        }

        if (model.prompt){
            if (model.interval === true){
                let startPrompt: HTMLElement = document.createElement('div');
                startPrompt.classList.add('fsd-prompt');
                startPrompt.innerHTML = model.startValue + '';
                startIntervalWrapper!.append(startPrompt);

                let endPrompt: HTMLElement = document.createElement('div');
                endPrompt.classList.add('fsd-prompt');
                endPrompt.innerHTML = model.endValue + '';
                endIntervalWrapper!.append(endPrompt);
            } else{
                prompt = document.createElement('div');
                prompt.innerHTML = model.currentValue + '';
                prompt.classList.add('fsd-prompt');
                sliderWrapper!.append(prompt);
            }
        }

        fsd.prepend(fsdInner);
        model.target.innerHTML = '';
        model.target.append(fsd);

        this.stepsWidth = fsdRange.offsetWidth / steps / fsdRange.offsetWidth * 100;

        scaleOfValues.style.minHeight = max.offsetHeight + 'px';
        spans = scaleOfValues.querySelectorAll('span');
        for (let i: number = 1; i < spans.length - 1; i++){
            let left: number = this.stepsWidth * i;
            spans[i].style.left = left + '%';
        }
        max.style.left = 100 - max.offsetWidth / fsdRange.offsetWidth * 100 + '%';

        if (model.interval === true){
            let sliderWidth: number = startIntervalWrapper!.offsetWidth / fsdRange.offsetWidth * 100
            let right = 100 - sliderWidth

            let leftStart: number = this.stepsWidth * (model.startValue! - 1) - sliderWidth / 2
            if (leftStart < 0) leftStart = 0
            if (leftStart > right) leftStart = right

            let leftEnd: number = this.stepsWidth * (model.endValue! - 1) - sliderWidth / 2
            if (leftEnd < 0) leftEnd = 0
            if (leftEnd > right) leftEnd = right

            startIntervalWrapper!.style.left = leftStart + '%'
            endIntervalWrapper!.style.left = leftEnd + '%'
        } else{
            let sliderWidth: number = sliderWrapper!.offsetWidth / fsdRange.offsetWidth * 100
            let left: number = this.stepsWidth * (model.currentValue! - 1) - sliderWidth / 2;
            let right: number = 100 - sliderWidth;
            if (left < 0) left = 0;
            if (left > right) left = right;
    
            sliderWrapper!.style.left = left + '%';
        }
        
    }
}