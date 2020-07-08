import $ from 'jquery';

$(function() {
    $('.slider').rangeFSD({
        max: 1000,
        vertical: true,
        startValue: 500,
        currentValue: 10,
        scaleOfValues: true,
        interval: true
    });
    $('.main__slider').rangeFSD()
    let slider = document.querySelector('.slider')
    console.log(slider.prompt)
})
