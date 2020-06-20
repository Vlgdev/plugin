import { dataModel } from "./Model";

export default class View {
    constructor(model: dataModel){
        let rangeWrapper = document.createElement('div');
        rangeWrapper.classList.add('fsd-wrapper');
        let range = document.createElement('div');
        range.classList.add('fsd-range');
        rangeWrapper.append(range);
        if (model.interval){
            let startInterval = document.createElement('div');
            let endInterval = document.createElement('div');
            startInterval.classList.add('fsd-start', 'fsd-slider');
            endInterval.classList.add('fsd-end', 'fsd-slider');
            rangeWrapper.classList.add('fsd-interval');
            rangeWrapper.append(startInterval, endInterval);
        } else{
            let slider = document.createElement('div');
            slider.classList.add('fsd-slider');
            rangeWrapper.append(slider);
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
        rangeWrapper.append(scaleOfValues);

        if (model.vertical){
            rangeWrapper.classList.add('fsd-vertical');
        }

        if (model.prompt){
            let prompt = document.createElement('div');
            prompt.innerHTML = model.currentValue + '';
            prompt.classList.add('fsd-prompt');
        }

        model.target.innerHTML = '';
        model.target.append(rangeWrapper);
    }
}