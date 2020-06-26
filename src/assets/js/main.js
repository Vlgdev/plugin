import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 11,
        scaleOfValues: true,
        currentValue: 10
    });
    $('.main__slider').rangeFSD()
})
