import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 12,
        scaleOfValues: true,
        currentValue: 3
    });
    $('.main__slider').rangeFSD()
})
