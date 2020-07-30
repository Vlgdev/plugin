import Model from "./Model";

export default class View {

    public stepsWidth!: number;
    public steps: number = 0;

    constructor(model: Model) {

        this.render(model, null);

    }

    render(model: Model, subject: string | null) {

        if (subject === null || subject == 'min' || subject == 'max' || subject == 'vertical' || subject == 'step') {
            let fsd: HTMLElement;
            let fsdInner: HTMLElement;
            let fsdRange: HTMLElement;

            let mn: number = +model.min!;
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

            fsd = this.renderScale(model, fsd);

            if (model.interval === true) {
                fsdInner = this.renderInterval(model, fsdInner);
                fsd.classList.add('fsd-interval');
            } else {
                fsdInner = this.renderStandart(model, fsdInner);
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

            let className: string = model.target.className;
            let currentField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__currentVal');
            let progressField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__progressBar');
            let intervalField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__interval');
            let startField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__start');
            let endField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__end');
            let minField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__min');
            let maxField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__max');
            let stepField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__step');
            let scaleOfValues: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__scale');
            let promptField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__prompt');
            let verticalField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__vertical');

            currentField.value = model.currentValue + '';
            progressField.checked = model.progressBar;
            intervalField.checked = model.interval;
            startField.value = model.startValue + '';
            endField.value = model.endValue + '';
            minField.value = model.min + '';
            maxField.value = model.max + '';
            stepField.value = model.step + '';
            scaleOfValues.checked = model.scaleOfValues;
            promptField.checked = model.prompt;
            verticalField.checked = model.vertical;

        } else if (subject == 'currentValue' && model.interval !== true) {
            this.setStandart(model);

            let className: string = model.target.className;
            let currentField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__currentVal');
            currentField.value = '' + model.currentValue;

        } else if ((subject == 'startValue' || subject == 'endValue') && model.interval === true) {
            this.setInterval(model);

            let className: string = model.target.className;
            if (subject == 'startValue') {
                let startField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__start');
                startField.value = model.startValue + '';
            } else {
                let endField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__end');
                endField.value = model.endValue + '';
            }

        } else if ((subject == 'interval' || subject == 'prompt') && model.interval == true) {
            let fsdInner: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__inner')!;
            fsdInner = this.renderInterval(model, fsdInner);
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd');
            fsd.classList.add('fsd-interval');
            fsd.querySelector('.fsd__inner')?.remove();
            fsd.prepend(fsdInner);
            this.setInterval(model);

            let className: string = model.target.className;
            if (subject == 'interval') {
                let intervalField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__interval');
                let startField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__start');
                let endField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__end');

                intervalField.checked = model.interval;
                startField.value = model.startValue + '';
                endField.value = model.endValue + '';
            } else {
                let propmtField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__prompt');
                propmtField.checked = model.prompt;
            }

        } else if ((subject == 'interval' || subject == 'prompt') && model.interval == false) {
            let fsdInner: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__inner')!;
            fsdInner = this.renderStandart(model, fsdInner);
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd');
            fsd.classList.remove('fsd-interval');
            fsd.querySelector('.fsd__inner')?.remove();
            fsd.prepend(fsdInner);
            this.setStandart(model);

            let className: string = model.target.className;
            if (subject == 'interval') {
                let intervalField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__interval');
                let currentField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__currentVal');

                intervalField.checked = model.interval;
                currentField.value = model.startValue + '';
            } else {
                let propmtField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__prompt');
                propmtField.checked = model.prompt;
            }

        } else if (subject == 'scaleOfValues') {
            model.target.querySelector('.fsd__scale')?.remove();
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd');
            fsd = this.renderScale(model, fsd);
            model.target.append(fsd);
            this.setScale(model);

            let className: string = model.target.className;
            let scaleField: HTMLInputElement = <HTMLInputElement>document.getElementById(className + '__scale');
            scaleField.checked = model.scaleOfValues;
        } else if (subject == 'progressBar') {
            if (model.progressBar === true) {
                let progress: HTMLElement = document.createElement('div');
                progress.classList.add('fsd__progress');
                let inner: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__inner');
                inner.append(progress);
                if (model.interval === true) {
                    this.setInterval(model);
                } else {
                    this.setStandart(model);
                }
            } else {
                model.target.querySelector('.fsd__progress')?.remove();
            }
        }

    }

    private renderScale(model: Model, fsd: HTMLElement): HTMLElement {

        let scaleOfValues: HTMLElement = document.createElement('div');
        scaleOfValues.classList.add('fsd__scale');

        let min: HTMLElement = document.createElement('span');
        min.classList.add('fsd__min');
        min.innerHTML = '' + model.min;
        scaleOfValues.append(min);

        let max: HTMLElement = document.createElement('span');
        max.classList.add('fsd__max');
        max.innerHTML = '' + model.max;
        scaleOfValues.append(max);

        fsd.append(scaleOfValues);

        return fsd;

    }


    private renderInterval(model: Model, fsdInner: HTMLElement): HTMLElement {
        let startIntervalWrapper: HTMLElement = document.createElement('div');
        startIntervalWrapper.classList.add('fsd__start-wrapper', 'fsd__slider-wrapper');
        let startInterval: HTMLElement = document.createElement('div');
        startIntervalWrapper.append(startInterval);
        startInterval.classList.add('fsd__start', 'fsd__slider');

        let endIntervalWrapper: HTMLElement = document.createElement('div');
        endIntervalWrapper.classList.add('fsd__end-wrapper', 'fsd__slider-wrapper');
        let endInterval: HTMLElement = document.createElement('div');
        endInterval.classList.add('fsd__end', 'fsd__slider');
        endIntervalWrapper.append(endInterval);

        let generalPrompt: HTMLElement;
        if (model.prompt === true) {
            startIntervalWrapper = this.renderPropmt(model, startIntervalWrapper);
            endIntervalWrapper = this.renderPropmt(model, endIntervalWrapper);
            generalPrompt = document.createElement('div');
            generalPrompt.classList.add('fsd__prompt', 'fsd__prompt-general');
            generalPrompt.style.visibility = 'hidden';
        }

        let progressBar: HTMLElement;
        if (model.progressBar === true) {
            progressBar = document.createElement('div');
            progressBar.classList.add('fsd__progress');
        }

        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelector('.fsd__interval')?.remove();
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove();
            });
            model.target.querySelectorAll('.fsd__prompt')?.forEach(elem => {
                elem.remove();
            });
            model.target.querySelector('.fsd__progress')?.remove();
        }

        if (model.progressBar === true) {
            fsdInner.append(progressBar!);
        }

        fsdInner.append(startIntervalWrapper, endIntervalWrapper);
        if (model.prompt === true) {
            fsdInner.append(generalPrompt!);
        }

        return fsdInner;

    }


    private renderStandart(model: Model, fsdInner: HTMLElement): HTMLElement {
        let sliderWrapper: HTMLElement = document.createElement('div');
        sliderWrapper.classList.add('fsd__slider-wrapper');
        let slider: HTMLElement = document.createElement('div');
        slider.classList.add('fsd__slider');
        sliderWrapper.append(slider);

        let progressBar: HTMLElement;
        if (model.progressBar === true) {
            progressBar = document.createElement('div');
            progressBar.classList.add('fsd__progress');
        }

        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove();
            });
            model.target.querySelectorAll('.fsd__prompt').forEach(elem => {
                elem.remove();
            });
            model.target.querySelector('.fsd__progress')?.remove();
            model.target.querySelector('.fsd')?.classList.remove('fsd__interval');
        }

        if (model.prompt === true)
            sliderWrapper = this.renderPropmt(model, sliderWrapper);

        if (model.progressBar === true)
            fsdInner.append(progressBar!);
        fsdInner.append(sliderWrapper);

        return fsdInner;
    }


    private renderPropmt(model: Model, sliderWrapper: HTMLElement): HTMLElement {
        let prompt: HTMLElement = document.createElement('div');
        prompt.classList.add('fsd__prompt');

        sliderWrapper.append(prompt);

        return sliderWrapper;
    }

    private setScale(model: Model) {

        let range: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__range');
        let scaleOfValues: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__scale');
        let min: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__min');
        let max: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__max');

        if (model.vertical === true) {
            this.stepsWidth = range.offsetHeight / this.steps / range.offsetHeight * 100;
        } else {
            this.stepsWidth = range.offsetWidth / this.steps / range.offsetWidth * 100;
        }

        if (model.vertical === true) {
            min.style.top = 0 + '%';
            max.style.top = 100 - max.offsetHeight / range.offsetHeight * 100 + '%';
        } else {
            min.style.left = 0 + '%';
            max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%';
        }
        
        if (model.scaleOfValues === true) {
            let curSpan: HTMLElement = min;
            for (let i: number = 1; i < this.steps; i++) {
                let span: HTMLElement = document.createElement('span');
                span.innerHTML = model.min + i * model.step! + '';
                max.before(span);
                let distance: number;
                let condition: number;
                let maxDistance: number;
                if (model.vertical === true) {
                    distance = this.stepsWidth * i - span.offsetHeight / range.offsetHeight * 100 / 2;
                    condition = distance - (parseFloat(curSpan.style.top) + curSpan.offsetHeight / range.offsetHeight * 100);
                    maxDistance = parseFloat(max.style.top) - (distance + span.offsetHeight / range.offsetHeight * 100);
                } else {
                    distance = this.stepsWidth * i - span.offsetWidth / range.offsetWidth * 100 / 2;
                    condition = distance - (parseFloat(curSpan.style.left) + curSpan.offsetWidth / range.offsetWidth * 100);
                    maxDistance = parseFloat(max.style.left) - (distance + span.offsetWidth / range.offsetWidth * 100);
                }
                if (condition < 7 || maxDistance < 7) {
                    span.remove()
                } else {
                    if (model.vertical === true) {
                        span.style.top = distance + '%';
                    } else {
                        span.style.left = distance + '%';
                    }
                    curSpan = span;
                }
            }
        }

        if (model.vertical === true) {
            scaleOfValues.style.minWidth = max.offsetWidth + 'px';
        } else {
            scaleOfValues.style.minHeight = max.offsetHeight + 'px';
        }

    }

    private setInterval(model: Model) {

        let range: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__range');
        let startIntervalWrapper: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__start-wrapper');
        let endIntervalWrapper: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__end-wrapper');
        let progressBar: HTMLElement;
        if (model.progressBar === true) {
            progressBar = <HTMLElement>model.target.querySelector('.fsd__progress');
        }

        let startPrompt: HTMLElement;
        let endPrompt: HTMLElement;
        let generalPrompt: HTMLElement;
        if (model.prompt === true) {
            startPrompt = <HTMLElement>model.target.querySelector('.fsd__start-wrapper > .fsd__prompt');
            endPrompt = <HTMLElement>model.target.querySelector('.fsd__end-wrapper > .fsd__prompt');
            generalPrompt = <HTMLElement>model.target.querySelector('.fsd__prompt-general');
        }

        let sliderSize: number;
        if (model.vertical === true) {
            sliderSize = startIntervalWrapper!.offsetHeight / range.offsetHeight * 100;
        } else {
            sliderSize = startIntervalWrapper!.offsetWidth / range.offsetWidth * 100;
        }
        let rightEdge: number = 100 - sliderSize;

        let start: number;
        [model.startValue, start] = this.getStartPos(model, model.startValue);
        start -= sliderSize / 2;
        if (start < 0) start = 0;
        if (start > rightEdge) start = rightEdge;

        let end: number;
        [model.endValue, end] = this.getStartPos(model, model.endValue);
        end -= sliderSize / 2;

        if (end < 0) end = 0;
        if (end > rightEdge) end = rightEdge;

        if (model.progressBar === true) {
            if (model.vertical === true) {
                progressBar!.style.height = end - start + '%';
                progressBar!.style.top = start + sliderSize / 2 + '%';
            } else {
                progressBar!.style.width = end - start + '%';
                progressBar!.style.left = start + sliderSize / 2 + '%';
            }
        }

        if (model.vertical === true) {
            startIntervalWrapper!.style.top = start + '%';
            endIntervalWrapper!.style.top = end + '%';
        } else {
            startIntervalWrapper!.style.left = start + '%';
            endIntervalWrapper!.style.left = end + '%';
        }

        if (model.prompt === true) {
            startPrompt!.innerHTML = model.startValue + '';
            endPrompt!.innerHTML = model.endValue + '';
            if (model.endValue == model.startValue) {
                generalPrompt!.innerHTML = model.startValue + '';
            } else {
                generalPrompt!.innerHTML = model.startValue + (model.vertical === true ? '<span>-</span>' : ' - ') + model.endValue;
            }
            if (model.vertical === true) {
                generalPrompt!.style.top = parseFloat(startIntervalWrapper.style.top) + (parseFloat(endIntervalWrapper.style.top) + sliderSize - parseFloat(startIntervalWrapper.style.top)) / 2 + '%';
            } else {
                generalPrompt!.style.left = parseFloat(startIntervalWrapper.style.left) + (parseFloat(endIntervalWrapper.style.left) + sliderSize - parseFloat(startIntervalWrapper.style.left)) / 2 + '%';
            }
            let startDistance: number;
            let endDistance: number;
            if (model.vertical === true) {
                startDistance = startPrompt!.getBoundingClientRect().top + startPrompt!.offsetHeight;
                endDistance = endPrompt!.getBoundingClientRect().top;
            } else {
                startDistance = startPrompt!.getBoundingClientRect().left + startPrompt!.offsetWidth;
                endDistance = endPrompt!.getBoundingClientRect().left;
            }
            if (endDistance - startDistance <= 0) {
                startPrompt!.style.visibility = 'hidden';
                endPrompt!.style.visibility = 'hidden';
                generalPrompt!.style.visibility = 'visible';
            } else {
                startPrompt!.style.visibility = 'visible';
                endPrompt!.style.visibility = 'visible';
                generalPrompt!.style.visibility = 'hidden';
            }
        }
    }

    private setStandart(model: Model) {

        let range: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__range');
        let sliderWrapper: HTMLElement = <HTMLElement>model.target.querySelector('.fsd__slider-wrapper');

        let progressBar: HTMLElement;
        if (model.progressBar === true)
            progressBar = <HTMLElement>model.target.querySelector('.fsd__progress');

        let prompt: HTMLElement;
        if (model.prompt === true)
            prompt = <HTMLElement>model.target.querySelector('.fsd__prompt');

        let sliderSize: number
        if (model.vertical === true) {
            sliderSize = sliderWrapper!.offsetHeight / range.offsetHeight * 100;
        } else {
            sliderSize = sliderWrapper!.offsetWidth / range.offsetWidth * 100;
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

    private setPrompt(model: Model) {
        if (model.prompt === true && model.vertical === true) {
            let fsd: HTMLElement = <HTMLElement>model.target.querySelector('.fsd');
            let prompt: HTMLElement = <HTMLElement>fsd.querySelector('.fsd__prompt');
            let max: HTMLElement = <HTMLElement>fsd.querySelector('.fsd__max');
            let stylePrompt: CSSStyleDeclaration = getComputedStyle(prompt);
            fsd.style.paddingLeft = max.offsetWidth + parseInt(stylePrompt.paddingLeft) + parseInt(stylePrompt.paddingRight) + 10 + 'px';
        }
    }

    private getStartPos(model: Model, value: number): Array<number> {
        for (let i = 0; i <= this.steps; i++) {
            let num: number = model.min + i * model.step;
            if (num == value) {
                return [num, i * this.stepsWidth];
            }
        }
        for (let i = 0; i < this.steps; i++) {
            let num: number = model.min + i * model.step;
            if (value > num && value < num + model.step) {
                return [num, i * this.stepsWidth];
            }
        }

        return [model.min, 0];
    }

}