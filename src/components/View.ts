import Model from "./Model";
import { extend } from "jquery";

export default class View {

    public stepsWidth!: number;
    public steps: number = 0;

    constructor(model: Model) {

        this.render(model, null)

    }

    render(model: Model, subject: string | null) {

        if (subject === null || subject == 'min' || subject == 'max' || subject == 'vertical' || subject == 'step') {
            let fsd: HTMLElement;
            let fsdInner: HTMLElement;
            let fsdRange: HTMLElement;

            let mn: number = model.min!
            this.steps = 0;

            while (mn < model.max!) {
                this.steps++;
                mn += model.step!;
            }

            fsd = document.createElement('div');
            fsd.classList.add('fsd');
            fsdInner = document.createElement('div');
            fsdInner.classList.add('fsd__inner');

            fsdRange = document.createElement('div');
            fsdRange.classList.add('fsd__range');
            fsdInner.append(fsdRange);

            if (model.vertical) {
                fsd.classList.add('fsd-vertical');
            }

            fsd = this.renderScale(model, fsd)

            if (model.interval === true) {
                fsdInner = this.renderInterval(model, fsdInner)
                fsd.classList.add('fsd-interval');
            } else {
                fsdInner = this.renderStandart(model, fsdInner)
            }

            fsd.prepend(fsdInner);
            model.target.innerHTML = '';
            model.target.append(fsd);

            this.setScale(model);
            if (model.interval === true) {
                this.setInterval(model);
            } else {
                this.setStandart(model);
            }
            this.setPrompt(model);
        } else if (subject == 'currentValue' && model.interval !== true) {
            this.setStandart(model);
        } else if ((subject == 'startValue' || subject == 'endValue') && model.interval === true) {
            this.setInterval(model);
        } else if ((subject == 'interval' || subject == 'prompt') && model.interval == true) {
            let fsdInner: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__inner')!;
            fsdInner = this.renderInterval(model, fsdInner);
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd');
            fsd.classList.add('fsd-interval');
            fsd.querySelector('.fsd__inner')?.remove();
            fsd.prepend(fsdInner);
            this.setInterval(model);
        } else if ((subject == 'interval' || subject == 'prompt') && model.interval == false) {
            let fsdInner: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__inner')!;
            fsdInner = this.renderStandart(model, fsdInner);
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd');
            fsd.classList.remove('fsd-interval');
            fsd.querySelector('.fsd__inner')?.remove();
            fsd.prepend(fsdInner);
            this.setStandart(model);
        } else if (subject == 'scaleOfValues') {
            model.target.querySelector('.fsd__scale')?.remove()
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd');
            fsd = this.renderScale(model, fsd);
            model.target.append(fsd);
            this.setScale(model);
        }

    }

    renderScale(model: Model, fsd: HTMLElement): HTMLElement {

        let scaleOfValues = document.createElement('div');
        scaleOfValues.classList.add('fsd__scale');

        let min = document.createElement('span');
        min.classList.add('fsd__min');
        min.innerHTML = '' + model.min;
        scaleOfValues.append(min);

        let max = document.createElement('span');
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

        return fsd

    }


    renderInterval(model: Model, fsdInner: HTMLElement): HTMLElement {
        let startIntervalWrapper = document.createElement('div');
        startIntervalWrapper.classList.add('fsd__start-wrapper', 'fsd__slider-wrapper');
        let startInterval = document.createElement('div');
        startIntervalWrapper.append(startInterval);
        startInterval.classList.add('fsd__start', 'fsd__slider');

        let endIntervalWrapper = document.createElement('div');
        endIntervalWrapper.classList.add('fsd__end-wrapper', 'fsd__slider-wrapper');
        let endInterval = document.createElement('div');
        endInterval.classList.add('fsd__end', 'fsd__slider');
        endIntervalWrapper.append(endInterval);

        let generalPrompt: HTMLElement;
        if (model.prompt === true) {
            startIntervalWrapper = this.renderPropmt(model, startIntervalWrapper)
            endIntervalWrapper = this.renderPropmt(model, endIntervalWrapper)
            generalPrompt = document.createElement('div');
            generalPrompt.classList.add('fsd__prompt', 'fsd__prompt-general');
            generalPrompt.style.visibility = 'hidden';
        }

        let lengthInterval = document.createElement('div')
        lengthInterval.classList.add('fsd__interval')

        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelector('.fsd__interval')?.remove()
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove()
            })
        }

        fsdInner.append(lengthInterval)

        fsdInner.append(startIntervalWrapper, endIntervalWrapper);
        fsdInner.append(generalPrompt!);

        return fsdInner

    }


    renderStandart(model: Model, fsdInner: HTMLElement): HTMLElement {
        let sliderWrapper = document.createElement('div');
        sliderWrapper.classList.add('fsd__slider-wrapper');
        let slider = document.createElement('div');
        slider.classList.add('fsd__slider');
        sliderWrapper.append(slider);

        let progressBar: HTMLElement;
        if (model.progressBar === true) {
            progressBar = document.createElement('div');
            progressBar.classList.add('fsd__progress')

        }

        if (model.prompt === true)
            sliderWrapper = this.renderPropmt(model, sliderWrapper)

        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelector('.fsd__interval')?.remove()
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove()
            })
            model.target.querySelector('.fsd__progress')?.remove()
            model.target.querySelector('.fsd')?.classList.remove('fsd__interval')
        }

        if (model.progressBar === true)
            fsdInner.append(progressBar!)
        fsdInner.append(sliderWrapper);

        return fsdInner
    }


    renderPropmt(model: Model, sliderWrapper: HTMLDivElement): HTMLDivElement {
        let prompt: HTMLElement = document.createElement('div')
        prompt.classList.add('fsd__prompt');

        sliderWrapper.append(prompt);

        return sliderWrapper
    }

    setScale(model: Model) {

        let range: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__range')
        let scaleOfValues: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__scale')
        let max: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__max')

        if (model.vertical === true) {
            this.stepsWidth = range.offsetHeight / this.steps / range.offsetHeight * 100
        } else {
            this.stepsWidth = range.offsetWidth / this.steps / range.offsetWidth * 100
        }

        let spans = scaleOfValues.querySelectorAll('span')

        if (model.vertical === true) {
            for (let i: number = 1; i < spans.length - 1; i++) {
                let distance: number = this.stepsWidth * i - spans[i].offsetHeight / range.offsetHeight * 100 / 2;
                spans[i].style.top = distance + '%';
            }

            max.style.top = 100 - max.offsetHeight / range.offsetHeight * 100 + '%'
        } else {
            for (let i: number = 1; i < spans.length - 1; i++) {
                let distance: number = this.stepsWidth * i - spans[i].offsetWidth / range.offsetWidth * 100 / 2;
                spans[i].style.left = distance + '%';
            }

            max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%'
        }

        if (model.vertical === true) {
            scaleOfValues.style.minWidth = max.offsetWidth + 'px'
        } else {
            scaleOfValues.style.minHeight = max.offsetHeight + 'px'
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
                condition = spans[s].offsetHeight / range.offsetHeight * 100 + 10
            } else {
                condition = spans[s].offsetWidth / range.offsetWidth * 100 + 10
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
    }

    setInterval(model: Model) {

        let range: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__range')
        let startIntervalWrapper: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper')
        let endIntervalWrapper: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper')
        let lengthInterval: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__interval')

        let startPrompt: HTMLElement;
        let endPrompt: HTMLElement;
        let generalPrompt: HTMLElement;
        if (model.prompt === true) {
            startPrompt = <HTMLElement>model.target.querySelector('.fsd__start-wrapper > .fsd__prompt');
            endPrompt = <HTMLElement>model.target.querySelector('.fsd__end-wrapper > .fsd__prompt');
            generalPrompt = <HTMLElement>model.target.querySelector('.fsd__prompt-general');
        }

        let sliderSize: number
        if (model.vertical === true) {
            sliderSize = startIntervalWrapper!.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = startIntervalWrapper!.offsetWidth / range.offsetWidth * 100
        }
        let rightEdge = 100 - sliderSize

        let start: number;
        [model.startValue, start] = this.getStartPos(model, model.startValue);
        start -= sliderSize / 2;
        if (start < 0) start = 0
        if (start > rightEdge) start = rightEdge

        let end: number;
        [model.endValue, end] = this.getStartPos(model, model.endValue);
        end -= sliderSize / 2;

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

        if (model.prompt === true) {
            startPrompt!.innerHTML = model.startValue + '';
            endPrompt!.innerHTML = model.endValue + '';
            if (model.endValue == model.startValue) {
                generalPrompt!.innerHTML = model.startValue + '';
            } else {
                generalPrompt!.innerHTML = model.startValue + ' - ' + model.endValue;
            }
            if (model.vertical === true){
                generalPrompt!.style.top = start + (end + sliderSize - end) / 2 + '%';
            } else {
                generalPrompt!.style.left = start + (end + sliderSize - end) / 2 + '%';
            }
        }
    }

    setStandart(model: Model) {

        let range: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__range')
        let sliderWrapper: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__slider-wrapper')

        let progressBar: HTMLElement;
        if (model.progressBar === true)
            progressBar = <HTMLElement>model.target.querySelector('.fsd__progress')

        let prompt: HTMLElement;
        if (model.prompt === true)
            prompt = <HTMLElement>model.target.querySelector('.fsd__prompt');

        let sliderSize: number
        if (model.vertical === true) {
            sliderSize = sliderWrapper!.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = sliderWrapper!.offsetWidth / range.offsetWidth * 100
        }

        let distance: number;
        [model.currentValue, distance] = this.getStartPos(model, model.currentValue);
        distance -= sliderSize / 2;

        let rightEdge: number = 100 - sliderSize;
        if (distance < 0) distance = 0;
        if (distance > rightEdge) distance = rightEdge;

        if (model.vertical === true) {
            sliderWrapper!.style.top = distance + '%';
        } else {
            sliderWrapper!.style.left = distance + '%';
        }

        if (model.progressBar === true && model.vertical === true) {
            progressBar!.style.height = distance + sliderSize / 2 + '%';
        } else if (model.progressBar === true) {
            progressBar!.style.width = distance + sliderSize / 2 + '%';
        }

        if (model.prompt === true)
            prompt!.innerHTML = model.currentValue + '';
    }

    setPrompt(model: Model) {
        if (model.prompt === true && model.vertical === true) {
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd')
            let prompt: HTMLElement = <HTMLElement>fsd.querySelector('.fsd__prompt')
            let max: HTMLElement = <HTMLElement>fsd.querySelector('.fsd__max')
            let stylePrompt = getComputedStyle(prompt)
            fsd.style.paddingLeft = max.offsetWidth + parseInt(stylePrompt.paddingLeft) + parseInt(stylePrompt.paddingRight) + 10 + 'px'
        }
    }

    getStartPos(model: Model, value: number): Array<number> {
        for (let i = 0; i <= this.steps; i++) {
            let num = model.min + i * model.step
            if (num == value) {
                return [num, i * this.stepsWidth]
            }
        }
        for (let i = 0; i < this.steps; i++) {
            let num = model.min + i * model.step;
            if (value > num && value < num + model.step) {
                return [num, i * this.stepsWidth];
            }
        }

        return [model.min, 0];
    }

}