/**
 * Created by Adekunle Adeyemi on 29/02/2016.
 */

(function (window, angular) {
    'use strict';
    var jq = jQuery;

    angular
        .module('MZApp.profile')
        .controller('ProfileCtrl', ['$state', '$rootScope', '$location', 'Authentication',
            function($state, $rootScope, $location, Authentication){
                var vm = this;
                vm.selectFile = function(){
                    console.log('file selected');
                };
                vm.editBasics = function(){
                    console.log('editting basics profile');
                    var form = jq('form#basic-form');
                    form.attr('disabled', false);
                    form.find('input, select').attr('disabled', false);
                    form.find('div.change-btn').slideDown(1000);
                    form.parent('div').find('span.header-icon').attr('disabled', true);
                };
                vm.editFin = function(){
                    console.log('editting finanacial');
                    var form = jq('form#fin-form');
                    form.attr('disabled', false);
                    form.find('input, select').attr('disabled', false);
                    form.find('div.change-btn').slideDown(1000);
                    form.parent('div').find('span.header-icon').attr('disabled', true);

                };
                vm.editEdu = function () {
                    console.log('editting educaton');
                    var form = jq('form#edu-form');
                    form.attr('disabled', false);
                    form.find('input, select').attr('disabled', false);
                    form.find('div.change-btn').slideDown(1000);
                    form.parent('div').find('span.header-icon').attr('disabled', true);
                };
                vm.discardChange = function(formId){
                    var parentForm = jq('#'+formId+'\'');
                    parentForm.attr('disabled', true);
                    parentForm.find('input, select').attr('disabled', true);
                    form.find('div.change-btn').slideUp(1000);
                    form.parent('div').find('span.header-icon').attr('disabled', false);
                };
                jq('.discard').on('click',function(e){
                    e.preventDefault();
                    console.log('discarding changes');
                    var parentForm= jq(this).parents('form');
                    console.log(parentForm);
                    parentForm.attr('disabled', true);
                    parentForm.find('input, select').attr('disabled', true);
                    parentForm.find('div.change-btn').slideUp(1000);
                    parentForm.parent('div').find('span.header-icon').attr('disabled', false);
                });
                vm.basic = {
                    fullName : "Adekunle Adeyemi",
                    email : "hardeyem111@gmail.com",
                    mobile : "08104730007",
                    date_of_birth : "29-01-1919",
                    address : "No 2 , Boluwaji, Lagos - Ibadan Express road ",
                    city : "Ibadan",
                    state : "Oyo state",
                    country : "Nigeria",
                    gender : "male"
                };
                vm.edu = {
                    education_level : "not educated",
                    field : "nill",
                    profession : "nill",
                    interest : "nill",
                    hobby : "nill"
                };
                vm.fin = {
                    job : "nill",
                    employer : "nill",
                    income : "below $100",
                    worth : "below $1,000"
                };
                vm.updateBasic = function(){
                    console.log(vm.basic);
                };
                vm.updateEdu = function(){
                    console.log(vm.basic);
                };
                vm.updateFin = function(){

                }
            }
        ]);
})(window, window.angular);