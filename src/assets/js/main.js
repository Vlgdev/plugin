/* eslint-disable no-case-declarations */
/* eslint-disable fsd/no-function-declaration-in-event-listener */
/* eslint-disable fsd/jq-use-js-prefix-in-selector */
import $ from 'jquery';

$(function () {
    $('.slider').rangeFSD({
        max: 1000,
        min: 0,
        scaleOfValues: true,
        interval: true,
        step: 1,
        init: function (target) {
            setConfig(target);
        },
        onMove: function(slider, target){
            onMove(slider, target);
        }
    });
    $('.main-slider').rangeFSD({
        currentValue: 6,
        init: function (target) {
            setConfig(target);
        },
        onMove: function(slider, target){
            onMove(slider, target);
        }
    });

    $('.third-slider').rangeFSD({
        interval: true,
        vertical: true,
        min: 500,
        max: 5500,
        step: 500,
        startValue: 1500,
        endValue: 4500,
        progressBar: false,
        init: function(target) {
            setConfig(target);
        },
        onMove: function(slider, target) {
            onMove(slider, target);
        }
    });

    $('.uncommon-slider').rangeFSD({
        min: 32,
        max: 398,
        step: 33,
        currentValue: 231,
        prompt: false,
        scaleOfValues: true,
        init: function(target) {
            setConfig(target);
        },
        onMove: function(slider, target) {
            onMove(slider, target);
        }
    })

    function onMove(slider, target){
        if (slider.classList.contains('fsd__start-wrapper')){
            let startField = document.getElementById(target.className + '__start');
            startField.value = target.startValue;
        } else if (slider.classList.contains('fsd__end-wrapper')){
            let endField = document.getElementById(target.className + '__end');
            endField.value = target.endValue;
        } else {
            let currentField = document.getElementById(target.className + '__currentVal');
            currentField.value = target.currentValue;
        }
    }

    function setConfig(slider) {
        let className = slider.className;
        let currentField = document.getElementById(className + '__currentVal');
        let progressField = document.getElementById(className + '__progressBar');
        let intervalField = document.getElementById(className + '__interval');
        let startField = document.getElementById(className + '__start');
        let endField = document.getElementById(className + '__end');
        let minField = document.getElementById(className + '__min');
        let maxField = document.getElementById(className + '__max');
        let stepField = document.getElementById(className + '__step');
        let scaleOfValues = document.getElementById(className + '__scale');
        let promptField = document.getElementById(className + '__prompt');
        let verticalField = document.getElementById(className + '__vertical');

        currentField.value = slider.currentValue;
        progressField.checked = slider.progressBar;
        intervalField.checked = slider.interval;
        startField.value = slider.startValue;
        endField.value = slider.endValue;
        minField.value = slider.min;
        maxField.value = slider.max;
        stepField.value = slider.step;
        scaleOfValues.checked = slider.scaleOfValues;
        promptField.checked = slider.prompt;
        verticalField.checked = slider.vertical;
    }

    document.addEventListener('change', () => {
        if (!event.target.closest('.config')) return;

        const target = event.target;
        let config = target.closest('.config');
        let slider = document.querySelector('.' + config.dataset.target);
        switch (target.name) {
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
                const startField = document.getElementById(slider.className + '__start');
                const endField = document.getElementById(slider.className + '__end');
                const currentField = document.getElementById(slider.className + '__currentVal');
                startField.value = slider.startValue;
                endField.value = slider.endValue;
                currentField.value = slider.currentValue;
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
