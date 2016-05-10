/**
 * Created by TK on 13/02/2016.
 */
(function(window, angular) {
    'use strict';

    //var jQuery = $.noConflict();
    var jq$ = jQuery;
    angular
        .module('MainDirective')
        .controller('NavbarCtrl', ['$rootScope','$scope', '$state' ,'$compile','Authentication','$element',  function ($rootScope, $scope, $state, $compile, Authentication, $element) {
            $scope.item = "nav bar item";
            var vm = this;

            vm.showMenu = function(e){
                //window.alert('about to show menu');
                console.log(jQuery(this));
            };

            jQuery('.popup-menu').on('click', function(e){
                e.preventDefault();
                //var dropCon = jq$(this).find('div.arrow-menu');
                var popMenuSibling =jq$(this).siblings('nav.popup-menu');
                if(popMenuSibling.hasClass('active-menu'))
                    popMenuSibling.removeClass('active-menu');

                jq$(this).toggleClass('active-menu');
               //console.log(dropCon);

                e.stopPropagation();
            });
            /*jQuery('a.profile-link').on('click', function(e){
                e.preventDefault();
                if(!jq$(this).hasClass('active')){
                    window.location = '/profile';
                }
            });*/

            jQuery('a.logout').on('click', function(e){
                e.preventDefault();
                //window.alert("logging out");
                Authentication.logout().then(function(done){
                    //make sure logout successful
                    if(done) {
                        if (!Authentication.isLoggedIn()) {
                            //$state.go('access.auth', {})
                            $rootScope.logOut();
                        }
                    }
                });

                e.stopPropagation();
            });

            vm.activeDrawer = '';
            $scope.activateDrawer = function(drawerType){

                console.log('left nav iteem clicked');
                if(vm.activeDrawer == drawerType){
                    console.log('is active ');
                    clearDrawer();
                    vm.activeDrawer = '';
                    return false;
                }

                vm.activeDrawer = drawerType;
                var tempEl, tag;
                if (drawerType === "notifications") {
                    tempEl = "<qp-notifications></qp-notifications>";
                    tag = "qp-notifications";
                } else if (drawerType === "messages") {
                    tempEl = "<qp-messages></qp-messages>";
                    tag = "qp-messages";
                } else if (drawerType === "live") {
                    tempEl = "<qp-live-show></qp-live-show>";
                    tag = "qp-live-show";
                } else if (drawerType === "testimony") {
                    tempEl = "<div> Testimony goes here</div>";
                    tag = "";
                } else if (drawerType === "footer") {
                    tempEl = "<qp-footer></qp-footer>";
                    tag = "qp-footer";
                }

                var el = compileTemp($compile, tempEl, $scope);
                showDrawer(el);

            };

            handleNavbarActive();
            handleNavbarRoute();
            
        }]);

    /** show drawer and *********/
    function showDrawer(templateEl){
        var drawerWrapperEl = jQuery('.drawer-wrapper');
        drawerWrapperEl.data('item', 'notify');
        console.log(drawerWrapperEl);
        drawerWrapperEl.empty();
        drawerWrapperEl.append(templateEl);


    }

    function clearDrawer($scope){
        var drawerWrapperEl = jQuery('.drawer-wrapper');
        drawerWrapperEl.empty();
        //$scope.$apply();
    }
    /*** Compile template html at runtime ***/
    function compileTemp($compile, tempUrl, $scope){
        var el = $compile(tempUrl)($scope);
        return el;
    }


    /*** handle top navbar active state ***********/
    function handleNavbarActive(){
        var navElements = jQuery('.menu-left a');
        var currentLocation = window.location.pathname;

        jQuery.each(navElements, function(index, element){
            //console.log(element);
            var elementPath = jQuery(element).attr('href');
            //console.log(elementPath);
            if(elementPath == currentLocation ){

                jQuery(element).addClass('active');
                jQuery(element).siblings('a').removeClass('active');

            }
        })
    }
    function handleNavbarRoute(){

        jQuery('.menu-left a').on('click', function(e){
            e.preventDefault();
            var element = jQuery(this);
            var link = element.attr('href');

            if(element.hasClass('active')){
                //window.alert('is active');

            }else {

                //element.addClass("active");
                window.location = link;
                //element.sibilings().removeClass('active');

            }

        })
    }
})(window, window.angular);
