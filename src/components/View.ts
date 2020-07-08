import { dataModel } from "./Model";
import { extend } from "jquery";

export default class View {

    public stepsWidth!: number;

    constructor(model: dataModel) {

        let fsd: HTMLElement;
        let fsdInner: HTMLElement;
        let fsdRange: HTMLElement;
        let steps: number = 0;
        let mn: number = model.min!;
        let startIntervalWrapper: HTMLElement;
        let startInterval: HTMLElement;
        let endIntervalWrapper: HTMLElement;
        let endInterval: HTMLElement;
        let lengthInterval: HTMLElement;
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
        fsdInner.classList.add('fsd__inner');

        fsdRange = document.createElement('div');
        fsdRange.classList.add('fsd__range');
        fsdInner.append(fsdRange);

        while (mn < model.max!) {
            steps++;
            mn += model.step!;
        }

        if (model.interval) {
            startIntervalWrapper = document.createElement('div');
            startIntervalWrapper.classList.add('fsd__start-wrapper', 'fsd__slider-wrapper');
            startInterval = document.createElement('div');
            startIntervalWrapper.append(startInterval);
            startInterval.classList.add('fsd__start', 'fsd__slider');

            endIntervalWrapper = document.createElement('div');
            endIntervalWrapper.classList.add('fsd__end-wrapper', 'fsd__slider-wrapper');
            endInterval = document.createElement('div');
            endInterval.classList.add('fsd__end', 'fsd__slider');
            endIntervalWrapper.append(endInterval);

            lengthInterval = document.createElement('div')
            lengthInterval.classList.add('fsd__interval')
            fsdInner.append(lengthInterval)

            fsd.classList.add('fsd-interval');
            fsdInner.append(startIntervalWrapper, endIntervalWrapper);
        } else {
            sliderWrapper = document.createElement('div');
            sliderWrapper.classList.add('fsd__slider-wrapper');
            slider = document.createElement('div');
            slider.classList.add('fsd__slider');
            sliderWrapper.append(slider);
            fsdInner.append(sliderWrapper);
        }

        scaleOfValues = document.createElement('div');
        scaleOfValues.classList.add('fsd__scale');

        min = document.createElement('span');
        min.classList.add('fsd__min');
        min.innerHTML = '' + model.min;
        scaleOfValues.append(min);

        max = document.createElement('span');
        max.classList.add('fsd__max');
        max.innerHTML = '' + model.max;
        scaleOfValues.append(max);

        if (model.scaleOfValues) {
            let maxEl: HTMLElement = <HTMLElement>scaleOfValues.querySelector('.fsd__max');
            for (let i: number = model.min! + model.step!; i < model.max!; i += model.step!) {
                let value: HTMLElement = document.createElement('span')
                value.innerHTML = i + '';
                maxEl?.before(value);
            }
        }

        fsd.append(scaleOfValues);

        if (model.vertical) {
            fsd.classList.add('fsd-vertical');
        }

        if (model.prompt) {
            if (model.interval === true) {
                let startPrompt: HTMLElement = document.createElement('div');
                startPrompt.classList.add('fsd__prompt');
                startPrompt.innerHTML = model.startValue + '';
                startIntervalWrapper!.append(startPrompt);

                let endPrompt: HTMLElement = document.createElement('div');
                endPrompt.classList.add('fsd__prompt');
                endPrompt.innerHTML = model.endValue + '';
                endIntervalWrapper!.append(endPrompt);
            } else {
                prompt = document.createElement('div');
                prompt.innerHTML = model.currentValue + '';
                prompt.classList.add('fsd__prompt');
                sliderWrapper!.append(prompt);
            }
        }

        fsd.prepend(fsdInner);
        model.target.innerHTML = '';
        model.target.append(fsd);

        if (model.vertical === true) {
            this.stepsWidth = fsdRange.offsetHeight / steps / fsdRange.offsetHeight * 100
        } else {
            this.stepsWidth = fsdRange.offsetWidth / steps / fsdRange.offsetWidth * 100
        }

        if (model.prompt === true && model.vertical === true) {
            let prompt: HTMLElement = <HTMLElement>fsd.querySelector('.fsd__prompt')
            let stylePrompt = getComputedStyle(prompt)
            fsd.style.paddingLeft = max.offsetWidth + parseInt(stylePrompt.paddingLeft) + parseInt(stylePrompt.paddingRight) + 10 + 'px'
        }

        if (model.vertical === true) {
            scaleOfValues.style.minWidth = max.offsetWidth + 'px'
        } else {
            scaleOfValues.style.minHeight = max.offsetHeight + 'px'
        }

        spans = scaleOfValues.querySelectorAll('span')

        if (model.vertical === true) {
            for (let i: number = 1; i < spans.length - 1; i++) {
                let distance: number = this.stepsWidth * i;
                spans[i].style.top = distance + '%';
            }

            max.style.top = 100 - max.offsetHeight / fsdRange.offsetHeight * 100 + '%'
        } else {
            for (let i: number = 1; i < spans.length - 1; i++) {
                let distance: number = this.stepsWidth * i;
                spans[i].style.left = distance + '%';
            }

            max.style.left = 100 - max.offsetWidth / fsdRange.offsetWidth * 100 + '%'
        }

        let s: number = 0
        let nextSpan: number
        let distance: number
        while (s < spans.length - 1) {
            nextSpan = 1
            let cur: number

            if (s == 0) {
                cur = 0
            } else if (model.vertical === true) {
                cur = parseInt(spans[s].style.top)
            } else {
                cur = parseInt(spans[s].style.left)
            }

            distance = (model.vertical === true ? parseInt(spans[s + nextSpan].style.top) : parseInt(spans[s + nextSpan].style.left)) - cur

            let condition: number
            if (model.vertical === true) {
                condition = spans[s].offsetHeight / fsdRange.offsetHeight * 100 + 10
            } else {
                condition = spans[s].offsetWidth / fsdRange.offsetWidth * 100 + 10
            }

            while (distance < condition!) {
                if (spans[s + nextSpan].classList.contains('fsd__max')) {
                    spans[s].classList.add('hidden')
                    break
                }

                spans[s + nextSpan].classList.add('hidden')
                nextSpan++

                distance = (model.vertical === true ? parseInt(spans[s + nextSpan].style.top) : parseInt(spans[s + nextSpan].style.left)) - cur
            }

            if (spans[s + nextSpan].classList.contains('hidden'))
                spans[s + nextSpan].classList.remove('hidden')

            s += nextSpan
        }

        if (model.interval === true) {

            let sliderSize: number = startIntervalWrapper!.offsetHeight / fsdRange.offsetHeight * 100
            if (model.vertical === true) {
                sliderSize = startIntervalWrapper!.offsetHeight / fsdRange.offsetHeight * 100
            } else {
                sliderSize = startIntervalWrapper!.offsetWidth / fsdRange.offsetWidth * 100
            }
            let rightEdge = 100 - sliderSize

            let start: number = this.stepsWidth * (model.startValue! - 1) - sliderSize / 2
            if (start < 0) start = 0
            if (start > rightEdge) start = rightEdge

            let end: number = this.stepsWidth * (model.endValue! - 1) - sliderSize / 2
            if (end < 0) end = 0
            if (end > rightEdge) end = rightEdge

            if (model.vertical === true) {
                lengthInterval!.style.height = end - start + '%'
                lengthInterval!.style.top = start + sliderSize / 2 + '%'
            } else {
                lengthInterval!.style.width = end - start + '%'
                lengthInterval!.style.left = start + sliderSize / 2 + '%'
            }

            if (model.vertical === true) {
                startIntervalWrapper!.style.top = start + '%'
                endIntervalWrapper!.style.top = end + '%'
            } else {
                startIntervalWrapper!.style.left = start + '%'
                endIntervalWrapper!.style.left = end + '%'
            }

        } else {

            let sliderSize: number
            if (model.vertical === true){
                sliderSize = sliderWrapper!.offsetHeight / fsdRange.offsetHeight * 100
            } else {
                sliderSize = sliderWrapper!.offsetWidth / fsdRange.offsetWidth * 100
            }

            let distance: number = this.stepsWidth * (model.currentValue! - 1) - sliderSize / 2;
            let rightEdge: number = 100 - sliderSize;
            if (distance < 0) distance = 0;
            if (distance > rightEdge) distance = rightEdge;

            if (model.vertical === true){
                sliderWrapper!.style.top = distance + '%';
            } else {
                sliderWrapper!.style.left = distance + '%';
            }
            
        }

    }
}