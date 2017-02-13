;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('HouseDetailCtrl', ['home', 'carouselData', 'schoolData', '$scope', '$rootScope', '$window', '$uibModalInstance', '_', 'UserMeta', 'Authentication', 'SimpleRETS', 'NearbyPlaces', 'McOptions', 'ContactUsService', 'ModalOptions', '$uibModal', HouseDetailCtrl]);

    function HouseDetailCtrl(home, carouselData, schoolData, $scope, $rootScope, $window, $uibModalInstance, _, UserMeta, Authentication, SimpleRETS, NearbyPlaces, McOptions, ContactUsService, ModalOptions, $uibModal) {

        //Controller
        var $ctrl = this;


        //No houses flag
        $scope.noHouses = false;
        if (home.length == 0) {
            $scope.noHouses = true;
        }

        //Cleaning null values
        $ctrl.home = pruneEmpty(home, "");

        //Cleaning null values for agent
        $ctrl.homeAgent = pruneEmpty(home, "No disponible");


        //Initializing number of tiles in carousel
        $scope.numberOfTiles = $window.innerWidth > 769 ? 3 : 1;

        //Initializing carouselData
        $scope.carouselData = carouselData;

        /**
         * Open House Detail modal in carousel on click
         * @param {Integer} id - house's mlsId
         */

        $ctrl.openHouseDetail = function (id) {
            SimpleRETS.getHouse(id).then(function (res) {
                $uibModalInstance.close();
                var modalOptions = ModalOptions.getHouseDetailOptions(res);
                var modalInstance = $uibModal.open(modalOptions);
            }).catch(function () {
                Materialize.toast('Esta casa ya no existe', 4000);
            });
        }

        //Initializing schoolData
        if (schoolData == null || schoolData == '' || schoolData == 'Bad-Request') {
            $scope.schoolData = null;
        } else {
            $scope.schoolData = schoolData.schools.school;
        }

        /**
         * Removes 'bad' values from object and replace them
         * with No Disponible
         * @param {Object} obj
         * 
         */

        function pruneEmpty(obj, string_replacement) {
            return function prune(current) {
                _.forOwn(current, function (value, key) {
                    if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                        (_.isString(value) && _.isEmpty(value)) ||
                        (_.isObject(value) && _.isEmpty(prune(value)))) {

                        current[key] = string_replacement
                    }
                });
                // remove any leftover undefined values from the delete 
                // operation on an array
                if (_.isArray(current)) _.pull(current, undefined);

                return current;

            }(_.cloneDeep(obj)); // Do not modify the original object, create a clone instead
        }

        /**
         * House detail map instance
         * for points of interest
         * 
         */

        $uibModalInstance.rendered.then(function () {
            //Creating map instance with GoogleMaps API
            var map_html = document.getElementById('HouseDetailMap');
            var house_map = new google.maps.Map(map_html, {
                center: {
                    lat: home.geo.lat,
                    lng: home.geo.lng,
                },
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.HYBRID,
                mapTypeControl: false,
            });

            new google.maps.Marker({
                map: house_map,
                position: new google.maps.LatLng($ctrl.home.geo.lat, $ctrl.home.geo.lng),
                icon: 'assets/images/icon.png'
            });

            //Going through nearby places
            NearbyPlaces.forEach(function (place) {
                place.types.forEach(function (type) {
                    if (type == "bank" || type == "finance" || type == "atm") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-bank.png'
                        });
                    }
                    if (type == "bus_station" || type == "subway_station" || type == "taxi_stand" || type == "train_station" || type == "transit_station") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-bus-station.png'
                        });
                    }
                    if (type == "church") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-religious.png'
                        });
                    }
                    if (type == "hospital" || type == "doctor") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-hospital.png'
                        });
                    }
                    if (type == "pharmacy" || type == "health") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-pharmacy.png'
                        });
                    }
                    if (type == "police") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-police.png'
                        });
                    }
                    if (type == "restaurant" || type == "food") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-restaurant.png'
                        });
                    }
                    if (type == "shopping_mall" || type == "home_goods_store" || type == "clothing_store" || type == "department_store" || type == "electronics_store" || type == "hardware_store" || type == "jewelry_store") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-shopping.png'
                        });
                    }
                    if (type == "convenience_store" || type == 'grocery_or_supermarket' || type == "bakery") {
                        new google.maps.Marker({
                            map: house_map,
                            position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
                            icon: 'assets/images/map-icon-grocery-store.png'
                        });
                    }
                }, this);
            }, this);
        });

        /**
         * 
         * Closes Modal
         * 
         */

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

        /**
         * Saves house to the database
         * @param {Object} house
         * 
         */

        $ctrl.saveHouse = function (house) {
            var house_obj = {
                mlsId: house.mlsId,
                addressFull: house.address.full,
                bedrooms: house.property.bedrooms,
                listPrice: house.listPrice,
                photo: house.photos[0],
                bathrooms: house.property.bathsFull,
                sqft: house.property.area
            }

            UserMeta.postSavedHouse(house_obj)
                .then(function (res) {
                    Materialize.toast('La casa ha sido guardada con éxito', 4000);
                    $scope.houseIsSaved = true;
                })
                .catch(function (error) {
                    Materialize.toast('Ha habido un problema guardando la casa', 4000)
                });
        }

        /**
         * Contact Us
         * 
         */

        $scope.contactMessage = {
            name: '',
            email: '',
            message: 'Estuve viendo la propiedad [' + home.mlsId + '] en ' + home.address.full + ', quisiera más información.',
            mlsId: home.mlsId
        }

        /**
         * Sends contactMessage object to external API
         * 
         */

        $ctrl.contactUsSend = function () {

            ContactUsService.contactUs($scope.contactMessage)
                .then(messageSent)
                .catch(messageError);

            function messageSent(response) {
                Materialize.toast('Mensaje enviado.', 4000);
                $scope.messageSent = true;
            }

            function messageError(err) {
                Materialize.toast('Ha habido un problema enviando su mensaje, intente más tarde.', 4000);
            }
        }

        /**
         * Fetch users save houses to check if house
         * is already saved
         * 
         */

        if (Authentication.isAuthenticated()) {
            UserMeta.getSavedHouses()
                .then(function (res) {
                    res.saved_houses.forEach(function (element) {
                        if (home.mlsId == parseInt(element.mlsId)) {
                            $scope.houseIsSaved = true;
                        }
                    }, this);
                })
                .catch(function () {
                    Materialize.toast('Ha habido un error, intente más tarde', 4000)
                });
        }

        $scope.startSlideShow = function () {
            $scope.homePhotos = $ctrl.home.photos;
            $scope.startSlide = true;
        }
        $scope.slickConfig = {
            method: {},
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoPlay: false,
            adaptiveHeight: false,
            event: {
                beforeChange: function () {},
                afterChange: function () {}
            }
        }
        $scope.closeCarousel = function () {
            $scope.slickConfig.enabled = !$scope.slickConfig.enabled
            $scope.startSlide = false;
        }
    }

})();