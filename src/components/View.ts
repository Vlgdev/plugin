import Model from "./Model"

export default class View {

    public stepsWidth!: number
    public steps = 0

    constructor(model: Model) {

        this.render(model, null)

    }

    render(model: Model, subject: string | null): void {

        const isDefaultRender: boolean = subject === null || subject == 'min' || subject == 'max' || subject == 'vertical' || subject == 'step'

        const onIntervalOrPrompt: boolean = (subject == 'interval' || subject == 'prompt') && model.interval == true

        const isCurrentValue: boolean = subject == 'currentValue' && model.interval !== true

        const isStartOrEndValue: boolean = (subject == 'startValue' || subject == 'endValue') && model.interval === true

        const offIntervalOrPrompt: boolean = (subject == 'interval' || subject == 'prompt') && model.interval == false

        const isScaleOfValues: boolean = subject == 'scaleOfValues'
        const isProgressBar: boolean = subject == 'progressBar'

        if (isDefaultRender) {
            this.defaultRender(model)
        } else if (isCurrentValue) {
            this.setStandart(model)
        } else if (isStartOrEndValue) {
            this.setInterval(model)
        } else if (onIntervalOrPrompt) {
            let fsdInner: HTMLElement = model.target.querySelector('.fsd__inner') as HTMLElement
            fsdInner = this.renderInterval(model, fsdInner)
            const fsd: HTMLElement = model.target.querySelector('.fsd') as HTMLElement
            fsd.classList.add('fsd-interval')
            fsd.querySelector('.fsd__inner')?.remove()
            fsd.prepend(fsdInner)
            this.setInterval(model)
        } else if (offIntervalOrPrompt) {
            let fsdInner: HTMLElement = model.target.querySelector('.fsd__inner') as HTMLElement
            fsdInner = this.renderStandart(model, fsdInner)
            const fsd: HTMLElement = model.target.querySelector('.fsd') as HTMLElement
            fsd.classList.remove('fsd-interval')
            fsd.querySelector('.fsd__inner')?.remove()
            fsd.prepend(fsdInner)
            this.setStandart(model)
        } else if (isScaleOfValues) {
            model.target.querySelector('.fsd__scale')?.remove()
            let fsd: HTMLElement = model.target.querySelector('.fsd') as HTMLElement
            fsd = this.renderScale(model, fsd)
            model.target.append(fsd)
            this.setScale(model)
        } else if (isProgressBar) {
            if (model.progressBar === true) {
                const progress: HTMLElement = document.createElement('div')
                progress.classList.add('fsd__progress')
                const inner: HTMLElement = model.target.querySelector('.fsd__inner') as HTMLElement
                inner.append(progress)
                if (model.interval === true) {
                    this.setInterval(model)
                } else {
                    this.setStandart(model)
                }
            } else {
                model.target.querySelector('.fsd__progress')?.remove()
            }
        }

    }

    private defaultRender(model: Model): void {
        let fsd: HTMLElement
        let fsdInner: HTMLElement
        const fsdRange: HTMLElement = document.createElement('div')

        let mn: number = +model.min
        this.steps = 0

        while (mn < model.max) {
            this.steps++
            mn += model.step
        }

        fsd = document.createElement('div')
        fsd.classList.add('fsd')
        fsdInner = document.createElement('div')
        fsdInner.classList.add('fsd__inner')

        fsdRange.classList.add('fsd__range')
        fsdInner.append(fsdRange)

        if (model.vertical) {
            fsd.classList.add('fsd-vertical')
        }

        fsd = this.renderScale(model, fsd)

        if (model.interval === true) {
            fsdInner = this.renderInterval(model, fsdInner)
            fsd.classList.add('fsd-interval')
        } else {
            fsdInner = this.renderStandart(model, fsdInner)
        }

        fsd.prepend(fsdInner)
        model.target.innerHTML = ''
        model.target.append(fsd)

        this.setScale(model)
        if (model.interval === true) {
            this.setInterval(model)
        } else {
            this.setStandart(model)
        }
        this.setPrompt(model)
    }

    private renderScale(model: Model, fsd: HTMLElement): HTMLElement {

        const scaleOfValues: HTMLElement = document.createElement('div')
        scaleOfValues.classList.add('fsd__scale')

        const min: HTMLElement = document.createElement('span')
        min.classList.add('fsd__min')
        min.innerHTML = '' + model.min
        scaleOfValues.append(min)

        const max: HTMLElement = document.createElement('span')
        max.classList.add('fsd__max')
        max.innerHTML = '' + model.max
        scaleOfValues.append(max)

        fsd.append(scaleOfValues)

        return fsd

    }


    private renderInterval(model: Model, fsdInner: HTMLElement): HTMLElement {
        let startIntervalWrapper: HTMLElement = document.createElement('div')
        startIntervalWrapper.classList.add('fsd__start-wrapper', 'fsd__slider-wrapper')
        const startInterval: HTMLElement = document.createElement('div')
        startIntervalWrapper.append(startInterval)
        startInterval.classList.add('fsd__start', 'fsd__slider')

        let endIntervalWrapper: HTMLElement = document.createElement('div')
        endIntervalWrapper.classList.add('fsd__end-wrapper', 'fsd__slider-wrapper')
        const endInterval: HTMLElement = document.createElement('div')
        endInterval.classList.add('fsd__end', 'fsd__slider')
        endIntervalWrapper.append(endInterval)

        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelector('.fsd__interval')?.remove()
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove()
            })
            model.target.querySelectorAll('.fsd__prompt')?.forEach(elem => {
                elem.remove()
            })
            model.target.querySelector('.fsd__progress')?.remove()
        }

        let progressBar: HTMLElement
        if (model.progressBar === true) {
            progressBar = document.createElement('div')
            progressBar.classList.add('fsd__progress')
            fsdInner.append(progressBar)
        }

        fsdInner.append(startIntervalWrapper, endIntervalWrapper)

        let generalPrompt: HTMLElement
        if (model.prompt === true) {
            startIntervalWrapper = this.renderPropmt(startIntervalWrapper)
            endIntervalWrapper = this.renderPropmt(endIntervalWrapper)
            generalPrompt = document.createElement('div')
            generalPrompt.classList.add('fsd__prompt', 'fsd__prompt-general')
            generalPrompt.style.visibility = 'hidden'
            fsdInner.append(generalPrompt)
        }

        return fsdInner

    }


    private renderStandart(model: Model, fsdInner: HTMLElement): HTMLElement {
        let sliderWrapper: HTMLElement = document.createElement('div')
        sliderWrapper.classList.add('fsd__slider-wrapper')
        const slider: HTMLElement = document.createElement('div')
        slider.classList.add('fsd__slider')
        sliderWrapper.append(slider)



        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove()
            })
            model.target.querySelectorAll('.fsd__prompt').forEach(elem => {
                elem.remove()
            })
            model.target.querySelector('.fsd__progress')?.remove()
            model.target.querySelector('.fsd')?.classList.remove('fsd__interval')
        }

        if (model.prompt === true)
            sliderWrapper = this.renderPropmt(sliderWrapper)

        let progressBar: HTMLElement
        if (model.progressBar === true) {
            progressBar = document.createElement('div')
            progressBar.classList.add('fsd__progress')
            fsdInner.append(progressBar)
        }

        fsdInner.append(sliderWrapper)

        return fsdInner
    }


    private renderPropmt(sliderWrapper: HTMLElement): HTMLElement {
        const prompt: HTMLElement = document.createElement('div')
        prompt.classList.add('fsd__prompt')

        sliderWrapper.append(prompt)

        return sliderWrapper
    }

    private setScale(model: Model) {

        const range: HTMLElement = model.target.querySelector('.fsd__range') as HTMLElement
        const min: HTMLElement = model.target.querySelector('.fsd__min') as HTMLElement
        const max: HTMLElement = model.target.querySelector('.fsd__max') as HTMLElement

        if (model.vertical === true) {
            this.stepsWidth = range.offsetHeight / this.steps / range.offsetHeight * 100
        } else {
            this.stepsWidth = range.offsetWidth / this.steps / range.offsetWidth * 100
        }

        if (model.vertical === true) {
            min.style.top = 0 + '%'
            max.style.top = 100 - max.offsetHeight / range.offsetHeight * 100 + '%'
        } else {
            min.style.left = 0 + '%'
            max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%'
        }

        if (model.scaleOfValues === true) {
            let curSpan: HTMLElement = min
            for (let i = 1; i < this.steps; i++) {
                const span: HTMLElement = document.createElement('span')
                span.innerHTML = model.min + i * model.step + ''
                max.before(span)
                let distance: number
                let condition: number
                let maxDistance: number
                if (model.vertical === true) {
                    distance = this.stepsWidth * i - span.offsetHeight / range.offsetHeight * 100 / 2
                    condition = distance - (parseFloat(curSpan.style.top) + curSpan.offsetHeight / range.offsetHeight * 100)
                    maxDistance = parseFloat(max.style.top) - (distance + span.offsetHeight / range.offsetHeight * 100)
                } else {
                    distance = this.stepsWidth * i - span.offsetWidth / range.offsetWidth * 100 / 2
                    condition = distance - (parseFloat(curSpan.style.left) + curSpan.offsetWidth / range.offsetWidth * 100)
                    maxDistance = parseFloat(max.style.left) - (distance + span.offsetWidth / range.offsetWidth * 100)
                }
                if (condition < 7 || maxDistance < 7) {
                    span.remove()
                } else {
                    if (model.vertical === true) {
                        span.style.top = distance + '%'
                    } else {
                        span.style.left = distance + '%'
                    }
                    curSpan = span
                }
            }
        }

        const scaleOfValues: HTMLElement = model.target.querySelector('.fsd__scale') as HTMLElement
        if (model.vertical === true) {
            scaleOfValues.style.minWidth = max.offsetWidth + 'px'
        } else {
            scaleOfValues.style.minHeight = max.offsetHeight + 'px'
        }

    }

    private setInterval(model: Model) {

        const range: HTMLElement = model.target.querySelector('.fsd__range') as HTMLElement
        const startIntervalWrapper: HTMLElement = model.target.querySelector('.fsd__start-wrapper') as HTMLElement
        const endIntervalWrapper: HTMLElement = model.target.querySelector('.fsd__end-wrapper') as HTMLElement

        let sliderSize: number
        if (model.vertical === true) {
            sliderSize = startIntervalWrapper.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = startIntervalWrapper.offsetWidth / range.offsetWidth * 100
        }
        const rightEdge: number = 100 - sliderSize

        let start: number
        start = this.getStartPos(model, model.startValue)
        start -= sliderSize / 2
        if (start < 0) start = 0
        if (start > rightEdge) start = rightEdge

        let end: number
        end = this.getStartPos(model, model.endValue)
        end -= sliderSize / 2

        if (end < 0) end = 0
        if (end > rightEdge) end = rightEdge

        let progressBar: HTMLElement
        if (model.progressBar === true) {
            progressBar = model.target.querySelector('.fsd__progress') as HTMLElement
            if (model.vertical === true) {
                progressBar.style.height = end - start + '%'
                progressBar.style.top = start + sliderSize / 2 + '%'
            } else {
                progressBar.style.width = end - start + '%'
                progressBar.style.left = start + sliderSize / 2 + '%'
            }
        }

        if (model.vertical === true) {
            startIntervalWrapper.style.top = start + '%'
            endIntervalWrapper.style.top = end + '%'
        } else {
            startIntervalWrapper.style.left = start + '%'
            endIntervalWrapper.style.left = end + '%'
        }

        if (model.prompt === true) {
            this.setAndCheckGeneralPrompt(model)
        }

    }

    private setStandart(model: Model) {

        const range: HTMLElement = model.target.querySelector('.fsd__range') as HTMLElement
        const sliderWrapper: HTMLElement = model.target.querySelector('.fsd__slider-wrapper') as HTMLElement

        let sliderSize: number
        if (model.vertical === true) {
            sliderSize = sliderWrapper.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = sliderWrapper.offsetWidth / range.offsetWidth * 100
        }

        let distance: number
        distance = this.getStartPos(model, model.currentValue)
        distance -= sliderSize / 2

        const rightEdge: number = 100 - sliderSize
        if (distance < 0) distance = 0
        if (distance > rightEdge) distance = rightEdge

        if (model.vertical === true) {
            sliderWrapper.style.top = distance + '%'
        } else {
            sliderWrapper.style.left = distance + '%'
        }

        let progressBar: HTMLElement
        if (model.progressBar === true) {
            progressBar = model.target.querySelector('.fsd__progress') as HTMLElement
            if (model.vertical === true) {
                progressBar.style.height = distance + sliderSize / 2 + '%'
            } else {
                progressBar.style.width = distance + sliderSize / 2 + '%'
            }
        }

        let prompt: HTMLElement
        if (model.prompt === true) {
            prompt = model.target.querySelector('.fsd__prompt') as HTMLElement
            prompt.innerHTML = model.currentValue + ''
        }

    }

    private setPrompt(model: Model) {
        if (model.prompt === true && model.vertical === true) {
            const fsd: HTMLElement = model.target.querySelector('.fsd') as HTMLElement
            const prompt: HTMLElement = fsd.querySelector('.fsd__prompt') as HTMLElement
            const max: HTMLElement = fsd.querySelector('.fsd__max') as HTMLElement
            const stylePrompt: CSSStyleDeclaration = getComputedStyle(prompt)
            fsd.style.paddingLeft = max.offsetWidth + parseInt(stylePrompt.paddingLeft) + parseInt(stylePrompt.paddingRight) + 10 + 'px'
        }
    }

    setAndCheckGeneralPrompt(model: Model): void {
        const range: HTMLElement = model.target.querySelector('.fsd__range') as HTMLElement
        const startWrapper: HTMLElement = model.target.querySelector('.fsd__start-wrapper') as HTMLElement
        const endWrapper: HTMLElement = model.target.querySelector('.fsd__end-wrapper') as HTMLElement
        const startPrompt: HTMLElement = startWrapper.querySelector('.fsd__prompt') as HTMLElement
        const endPrompt: HTMLElement = endWrapper.querySelector('.fsd__prompt') as HTMLElement
        const generalPrompt: HTMLElement = model.target.querySelector('.fsd__prompt-general') as HTMLElement
        let sliderSize: number
        if (model.vertical === true) {
            sliderSize = startWrapper.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = startWrapper.offsetWidth / range.offsetWidth * 100
        }

        startPrompt.innerHTML = model.startValue + ''
        endPrompt.innerHTML = model.endValue + ''

        if (model.endValue == model.startValue) {
            generalPrompt.innerHTML = model.startValue + ''
        } else {
            generalPrompt.innerHTML = model.startValue + (model.vertical === true ? '<span>-</span>' : ' - ') + model.endValue
        }
        if (model.vertical === true) {
            generalPrompt.style.top = parseFloat(startWrapper.style.top) + (parseFloat(endWrapper.style.top) + sliderSize - parseFloat(startWrapper.style.top)) / 2 + '%'
        } else {
            generalPrompt.style.left = parseFloat(startWrapper.style.left) + (parseFloat(endWrapper.style.left) + sliderSize - parseFloat(startWrapper.style.left)) / 2 + '%'
        }

        let startDistance: number
        let endDistance: number
        if (model.vertical === true) {
            startDistance = startPrompt.getBoundingClientRect().top + startPrompt.offsetHeight
            endDistance = endPrompt.getBoundingClientRect().top
        } else {
            startDistance = startPrompt.getBoundingClientRect().left + startPrompt.offsetWidth
            endDistance = endPrompt.getBoundingClientRect().left
        }
        if (endDistance - startDistance <= 0) {
            startPrompt.style.visibility = 'hidden'
            endPrompt.style.visibility = 'hidden'
            generalPrompt.style.visibility = 'visible'
        } else {
            startPrompt.style.visibility = 'visible'
            endPrompt.style.visibility = 'visible'
            generalPrompt.style.visibility = 'hidden'
        }
    }

    private getStartPos(model: Model, value: number): number {
        for (let i = 0; i <= this.steps; i++) {
            const num: number = model.min + i * model.step
            if (num == value) {
                return i * this.stepsWidth
            }
        }

        return 0
    }
}