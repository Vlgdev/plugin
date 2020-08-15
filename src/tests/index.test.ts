import Model from '../components/Model';
import View from '../components/View';
import Controller from '../components/Controller';


//------------------- MODEL ------------------

describe('Test Model', () => {

    const target: HTMLElement = document.createElement('div');
    target.classList.add('slider');
    let model = new Model({
        target: target,
    })

    describe('Target', () => {

        test('HTMLElement should be here', () => {
            expect(model.target).toBeTruthy()
            expect(model.target).toBeInstanceOf(HTMLElement)
        })

    });

    describe('Min', () => {

        test('should be a default', () => {
            model = new Model({
                target
            });
            expect(model.min).toEqual(1);
        });
        
        test('should be an integer', () => {
            model = new Model({
                target,
                min: 2
            });
            expect(model.min).toEqual(2);
        })

        test('should be a float', () => {
            model = new Model({
                target,
                min: 2.5
            });
            expect(model.min).toBeCloseTo(2.5)
        });

        test('should be a negative number', () => {
            model = new Model({
                target,
                min: -1000
            });
            expect(model.min).toEqual(-1000);
        });

        test('should not be greater than or equal to max', () => {
            model = new Model({
                target,
                min: 11
            });
            expect(model.min).toEqual(9);
        });
    });

    describe('Max', () => {

        test('should be a default', () => {
            model = new Model({
                target
            });
            expect(model.max).toEqual(10);
        });

        test('should be an integer', () => {
            model = new Model({
                target,
                max: 5
            });
            expect(model.max).toEqual(5);
        });

        test('should be a float', () => {
            model = new Model({
                target,
                max: 3.5
            });
            expect(model.max).toBeCloseTo(3.5)
        });

        test('should be a negative number', () => {
            model = new Model({
                target,
                min: -100,
                max: -50
            });
            expect(model.max).toEqual(-50);
        });

        test('should not be less than or equal to min', () => {
            model = new Model({
                target,
                max: 0,
            });
            expect(model.max).toEqual(0);
            expect(model.min).toEqual(-1);
        });

    });

    describe('Current value', () => {

        test('should be a default', () => {
            model = new Model({
                target
            })
            expect(model.currentValue).toEqual(1);
        });

        test('should be an integer', () => {
            model = new Model({
                target,
                currentValue: 5
            });
            expect(model.currentValue).toEqual(5);
        });

        test('should be a float', () => {
            model = new Model({
                target,
                currentValue: 3.5,
                step: 0.5
            });
            expect(model.currentValue).toBeCloseTo(3.5)
        });

        test('should be a negative number', () => {
            model = new Model({
                target,
                min: -100,
                currentValue: -50
            });
            expect(model.currentValue).toEqual(-50);
        });

        test('should not be less than min', () => {
            model = new Model({
                target,
                currentValue: -40,
            });
            expect(model.currentValue).toEqual(1);
        });

        test('should not be greater than max', () => {
            model = new Model({
                target, 
                currentValue: 40
            });
            expect(model.currentValue).toEqual(10)

        });

        test('step should fall on this value', () => {
            model = new Model({
                target,
                currentValue: 4.5,
            });
            expect(model.currentValue).toEqual(4);
        });

    });

    describe('Vertical', () => {

        test('should be a default', () => {
            model = new Model({
                target
            })
            expect(model.vertical).toEqual(false);
        });

        test('should be a true', () => {
            model = new Model({
                target,
                vertical: true
            })
            expect(model.vertical).toEqual(true);
        });
    });

    describe('Interval', () => {

        test('should be a default', () => {
            model = new Model({
                target
            })
            expect(model.interval).toEqual(false);
        });

        test('should be a true', () => {
            model = new Model({
                target,
                interval: true
            })
            expect(model.interval).toEqual(true);
        });
    });

    describe('Start value', () => {

        test('should be a default', () => {
            model = new Model({
                target
            })
            expect(model.startValue).toEqual(1);
        });

        test('should be an integer', () => {
            model = new Model({
                target,
                startValue: 5
            });
            expect(model.startValue).toEqual(5);
        });

        test('should be a float', () => {
            model = new Model({
                target,
                startValue: 3.5,
                step: 0.5
            });
            expect(model.startValue).toBeCloseTo(3.5)
        });

        test('should be a negative number', () => {
            model = new Model({
                target,
                min: -100,
                startValue: -50
            });
            expect(model.startValue).toEqual(-50);
        });

        test('should not be less than min', () => {
            model = new Model({
                target,
                startValue: -40,
            });
            expect(model.startValue).toEqual(1);
        });

        test('should not be greater than end value', () => {
            model = new Model({
                target, 
                startValue: 41,
                endValue: 40
            });
            expect(model.startValue).toEqual(10);
            expect(model.endValue).toEqual(10);
            expect(model.max).toEqual(10);
        });

        test('step should fall on this value', () => {
            model = new Model({
                target,
                startValue: 4.5,
            });
            expect(model.startValue).toEqual(4);
        });
    });

    describe('End value', () => {

        test('should be a default', () => {
            model = new Model({
                target
            })
            expect(model.endValue).toEqual(10);
        });

        test('should be an integer', () => {
            model = new Model({
                target,
                endValue: 5
            });
            expect(model.endValue).toEqual(5);
        });

        test('should be a float', () => {
            model = new Model({
                target,
                endValue: 3.5,
                step: 0.5
            });
            expect(model.endValue).toBeCloseTo(3.5)
        });

        test('should be a negative number', () => {
            model = new Model({
                target,
                min: -100,
                endValue: -50
            });
            expect(model.endValue).toEqual(-50);
        });

        test('should not be greater than max', () => {
            model = new Model({
                target,
                endValue: 40,
            });
            expect(model.endValue).toEqual(10);
        });

        test('should not be less than start value', () => {
            model = new Model({
                target, 
                startValue: 7,
                endValue: -40
            });
            expect(model.endValue).toEqual(7);
            expect(model.startValue).toEqual(7);
            expect(model.min).toEqual(1);

        });

        test('step should fall on this value', () => {
            model = new Model({
                target,
                endValue: 4.5,
            });
            expect(model.endValue).toEqual(4);
        });
    });

    describe('Step', () => {

        test('should be a default', () =>{
            model = new Model({
                target
            });
            expect(model.step).toEqual(1);
        });

        test('should be an integer', () =>{
            model = new Model({
                target,
                step: 2
            });
            expect(model.step).toEqual(2);
        });

        test('should be a float', () =>{
            model = new Model({
                target,
                step: 2.1
            });
            expect(model.step).toBeCloseTo(2.1);
        });

        test('should be at least one step', () =>{
            model = new Model({
                target,
                step: 53
            });
            expect(model.step).toEqual(9);
        });

    });

    describe('Prompt', () => {

        test('should be a default', () => {
            model = new Model({
                target, 
            });
            expect(model.prompt).toEqual(true);
        });

        test('should be a false', () => {
            model = new Model({
                target,
                prompt: false 
            });
            expect(model.prompt).toEqual(false);
        });

    });

    describe('Scale of values', () => {

        test('should be a default', () => {
            model = new Model({
                target, 
            });
            expect(model.scaleOfValues).toEqual(false);
        });

        test('should be a true', () => {
            model = new Model({
                target,
                scaleOfValues: true 
            });
            expect(model.scaleOfValues).toEqual(true);
        });

    });

    describe('Progress bar', () => {

        test('should be a default', () => {
            model = new Model({
                target, 
            });
            expect(model.progressBar).toEqual(true);
        });

        test('should be a false', () => {
            model = new Model({
                target,
                progressBar: false 
            });
            expect(model.progressBar).toEqual(false);
        });

    });

});


//------------------ END MODEL -----------------------------------
// ----------------- VIEW ---------------------


describe('Test View', () => {

    const target: HTMLElement = document.createElement('div');
    target.classList.add('slider')

    let model = new Model({
        target
    });
    let view = new View(model);

    describe('Steps', () => {
        test('must be 9', () => {
            expect(view.steps).toEqual(9);
        });
        test('must be 4', () => {
            model = new Model({
                target,
                max: 5
            });
            view = new View(model);
            expect(view.steps).toEqual(4);
        });
        test('must be 345', () => {
            model = new Model({
                target,
                max: 350,
                min: 5
            });
            view = new View(model);
            expect(view.steps).toEqual(345);
        })
    });

    describe('Render', () => {
        test('default', () => {
            model = new Model({target});
            view = new View(model);
            const fsd: HTMLElement = <HTMLElement>target.querySelector('.fsd');
            const inner: HTMLElement = <HTMLElement>target.querySelector('.fsd__inner');
            const range: HTMLElement = <HTMLElement>target.querySelector('.fsd__range');
            const sliderWrappers: NodeListOf<Element> = target.querySelectorAll('.fsd__slider-wrapper');
            const slider: HTMLElement = <HTMLElement>target.querySelector('.fsd__slider');
            const prompt: NodeListOf<Element> = target.querySelectorAll('.fsd__prompt');
            const progressBar: HTMLElement = <HTMLElement>target.querySelector('.fsd__progress');
            const scale: HTMLElement = <HTMLElement>target.querySelector('.fsd__scale');
            const min: HTMLElement = <HTMLElement>target.querySelector('.fsd__min');
            const max: HTMLElement = <HTMLElement>target.querySelector('.fsd__max');
            expect(fsd).toBeTruthy()
            expect(inner).toBeTruthy()
            expect(range).toBeTruthy()
            expect(sliderWrappers.length).toEqual(1)
            expect(sliderWrappers[0]).toBeTruthy()
            expect(slider).toBeTruthy()
            expect(prompt.length).toEqual(1)
            expect(prompt[0]).toBeTruthy()
            expect(progressBar).toBeTruthy()
            expect(scale).toBeTruthy()
            expect(min).toBeTruthy()
            expect(min.innerHTML).toEqual(model.min + '')
            expect(max).toBeTruthy()
            expect(max.innerHTML).toEqual(model.max + '')
        });
        test('interval: true', () => {
            model = new Model({
                target,
                interval: true
            });
            view = new View(model);
            const fsd: HTMLElement = <HTMLElement>target.querySelector('.fsd');
            const sliderWrappers: NodeListOf<Element> = target.querySelectorAll('.fsd__slider-wrapper');
            const prompts: NodeListOf<Element> = target.querySelectorAll('.fsd__prompt');
            const progressBar: HTMLElement = <HTMLElement>target.querySelector('.fsd__progress');
            expect(fsd.classList.contains('fsd-interval')).toBeTruthy();
            expect(sliderWrappers.length).toEqual(2);
            expect(sliderWrappers[0].classList.contains('fsd__start-wrapper')).toBeTruthy();
            expect(sliderWrappers[1].classList.contains('fsd__end-wrapper')).toBeTruthy();
            expect(prompts.length).toEqual(3);
            expect(prompts[2].classList.contains('fsd__prompt-general')).toBeTruthy();
            expect(progressBar).toBeTruthy();
        });
        test('prompt: false', () => {
            model = new Model({
                target,
                interval: true,
                prompt: false
            });
            view = new View(model);
            const prompts: NodeListOf<Element> = target.querySelectorAll('.fsd__prompt');
            expect(prompts.length).toEqual(0);
        });
        test('vertical: true', () => {
            model = new Model({
                target,
                vertical: true
            });
            view = new View(model);
            const fsd: HTMLElement = <HTMLElement>target.querySelector('.fsd');
            expect(fsd.classList.contains('fsd-vertical')).toBeTruthy();
        });
        test('scale of values: true', () => {
            model = new Model({
                target,
                scaleOfValues: true
            });
            view = new View(model);
            const spans: NodeListOf<HTMLSpanElement> = target.querySelectorAll('.fsd__scale > span');
            expect(spans.length > 2).toBeTruthy()
        });
        test('progress bar: false', () => {
            model = new Model({
                target,
                progressBar: false
            });
            view = new View(model);
            const progressBar: HTMLElement = <HTMLElement>target.querySelector('.fsd__progress');
            expect(progressBar).toBeFalsy();
        });
    });

});

//------------------- END VIEW ---------------------
//------------------- CONTROLLER ---------------------------

describe('Test controller', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target: any = document.createElement('div');
    target.classList.add('slider');
    target.model = new Model({
        target,
    });
    target.view = new View(target.model);
    target.controller = new Controller(target.model, target.view);
    target.controller.fsdProtection(target.model);

    describe('Getters', () => {
        test('model, view and controller must return falsy value', () => {
            expect(target.model).toBeFalsy()
            expect(target.view).toBeFalsy()
            expect(target.controller).toBeFalsy()
        });
        test('target must return falsy value', () => {
            expect(target.target).toBeFalsy();
        });
        test('min must return 1', () => {
            expect(target.min).toEqual(1);
        });
        test('max must return 10', () => {
            expect(target.max).toEqual(10);
        });
        test('current value must return 1', () => {
            expect(target.currentValue).toEqual(1);
        });
        test('if interval equal true, current value must return null', () => {
            target.interval = true;
            expect(target.currentValue).toBeNull();
        });
        test('vertical must return false', () => {
            target.interval = false;
            expect(target.vertical).toEqual(false);
        });
        test('interval must return false', () => {
            expect(target.interval).toEqual(false);
        });
        test('start value must return 1', () => {
            target.interval = true;
            expect(target.startValue).toEqual(1);
        });
        test('end value must return 10', () => {
            expect(target.endValue).toEqual(10);
        });
        test('if interval equal false, start and end value must return null', () => {
            target.interval = false;
            expect(target.startValue).toBeNull();
            expect(target.endValue).toBeNull();
        });
        test('step must return 1', () => {
            expect(target.step).toEqual(1);
        });
        test('prompt must return true', () => {
            expect(target.prompt).toEqual(true);
        });
        test('scale of values must return false', () => {
            expect(target.scaleOfValues).toEqual(false);
        });
        test('progress bar must return true', () => {
            expect(target.progressBar).toEqual(true);
        });
        test('checkMinMax must return falsy', () => {
            expect(target.checkMinMax).toBeFalsy();
        });
    });
    describe('Setters', () => {
        test('model must return error on console.log', () => {
            target.model = 23;
            expect(target.model).toBeFalsy()
        });
        test('view must return error on console.log', () => {
            target.view = 23;
            expect(target.view).toBeFalsy()
        });
        test('controller must return error on console.log', () => {
            target.controller = 23;
            expect(target.controller).toBeFalsy()
        });
        test('target will not change but the property will be written', () => {
            target.target = 23;
            expect(target.target).toEqual(23);
        });
        test('min must be 5', () => {
            target.min = 5;
            expect(target.min).toEqual(5);
        });
        test('max must be 15', () => {
            target.max = 15;
            expect(target.max).toEqual(15);
        });
        test('current value must be 7', () => {
            target.currentValue = 7;
            expect(target.currentValue).toEqual(7);
        });
        test('vertical must be true', () => {
            target.vertical = true;
            expect(target.vertical).toEqual(true);
        });
        test('interval must be true', () => {
            target.interval = true;
            expect(target.interval).toEqual(true);
        });
        test('start value must be 9', () => {
            target.startValue = 9;
            expect(target.startValue).toEqual(9);
        });
        test('end value must be 11', () => {
            target.endValue = 11;
            expect(target.endValue).toEqual(11);
        });
        test('step must be 2', () => {
            target.step = 2;
            expect(target.step).toEqual(2);
        });
        test('prompt must be false', () => {
            target.prompt = false;
            expect(target.prompt).toEqual(false);
        });
        test('scale of values must be true', () => {
            target.scaleOfValues = true;
            expect(target.scaleOfValues).toEqual(true);
        });
        test('progress bar must be false', () => {
            target.progressBar = false;
            expect(target.progressBar).toEqual(false);
        });
    });
});