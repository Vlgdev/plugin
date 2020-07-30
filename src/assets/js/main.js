import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 1000,
        min: 0,
        scaleOfValues: true,
        interval: true,
        step: 1,
    });
    $('.main-slider').rangeFSD({
        currentValue: 6
    })

    document.addEventListener('change', () => {
        if (!event.target.closest('.config')) return;

        let target = event.target;
        let config = target.closest('.config');
        let slider = document.querySelector('.' + config.dataset.target);
        console.log(config.dataset.target)
        switch (target.name){
            case 'currentVal':
                slider.currentValue = target.value;
                break;
            case 'startValue':
                slider.startValue = target.value;
                break;
            case 'endValue':
                slider.endValue = target.value;
                break;
            case 'min':
                slider.min = target.value;
                break;
            case 'max':
                slider.max = target.value;
                break;
            case 'step':
                slider.step = target.value;
                break;
            case 'vertical':
                slider.vertical = target.checked;
                break;
            case 'prompt':
                slider.prompt = target.checked;
                break;
            case 'interval':
                slider.interval = target.checked;
                break;
            case 'scale':
                slider.scaleOfValues = target.checked;
                break;
            case 'progressBar':
                slider.progressBar = target.checked;
                break;
        }
    });

})
