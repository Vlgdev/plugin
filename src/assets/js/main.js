import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 500,
        min: 0,
        scaleOfValues: true,
        interval: true,
        step: 1,
    });
    $('.main-slider').rangeFSD({
        currentValue: 6
    })
})
