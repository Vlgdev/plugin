import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 1000,
        vertical: true,
        currentValue: 10,
        scaleOfValues: true,
        interval: true
    });
    $('.main__slider').rangeFSD()
})
