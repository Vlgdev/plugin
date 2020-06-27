import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 11,
        scaleOfValues: true,
        interval: true,
        startValue: 4,
        endValue: 6
    });
    $('.main__slider').rangeFSD()
})
