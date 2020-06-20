import $ from 'jquery';
import Model, {dataModel} from './components/Model';
import View from './components/View';
import Controller from './components/Controller';
import '@data/styles'; 
import '@data/images';
import '@js/main';

(function ($: any) {
    $.fn.rangeFSD = function(params: dataModel) {
        console.log(this)
                params.target = this;
                this.model = new Model(params);
                this.view = new View(this.model);
    }
})($)

interface rangeItem extends HTMLElement{
    model: Model,
    view: View,
    Controller: Controller,
}


