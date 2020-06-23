import { dataModel } from "./Model";

export default class View {
    constructor(model: dataModel){
        let fsd = document.createElement('div');
        fsd.classList.add('fsd');
        let fsdInner = document.createElement('div');
        fsdInner.classList.add('fsd-inner');
        let fsdRange = document.createElement('div');
        fsdRange.classList.add('fsd-range');
        fsdInner.append(fsdRange);
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
    }
}