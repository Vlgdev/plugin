import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 10,
        scaleOfValues: true,
        interval: true,
    });
    $('.main__slider').rangeFSD()
})
