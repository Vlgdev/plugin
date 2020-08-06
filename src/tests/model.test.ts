import Model from '../components/Model';
import Controller from '../components/Controller';
import View from '../components/View';

describe('Test Model', () => {

    let target: HTMLElement = document.createElement('div');
    target.classList.add('slider');
    let model = new Model({
        target: target,
    })

    describe('Target', () => {

        test('HTMLElement should be here', () => {
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

})