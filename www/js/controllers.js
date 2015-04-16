angular.module('starter.controllers', ['chart.js'])

/*.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.message = '';

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})*/

.controller('signupCtrl', function ($scope, $http, $location, $ionicPopup) {
     $scope.submitForm = function (create) {
            // Submission Stuffs Go Here
            $http.post('/addUser', create).
            success(function (data, status, headers, config) {
                if (status == 200) {
                    
                    $scope.user = data.user[0];
                    $scope.token = data.token;
                    $scope.expires = data.expires;
                }
                if (data.message)
                    var alertPopup = $ionicPopup.alert({
                    title: 'Account Successfully Created',
                    template: 'Welcome, to Ease'
                });
                alertPopup.then(function (res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            }).
            error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                if (data.message)
                    $scope.message = data.message;
            });
        }
})
.controller('loginCtrl', function ($scope, $http, $location) {
    $scope.loginForm = function (login) {
        $http.post('/authenticate', login).
        success(function (data, status, headers, config) {
            if (status == 200) {
                $scope.user = data.user[0];
                $scope.message = data.message;
                $location.path('#/app/profile');
            }
        }).
            error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                if (data.message)
                    $scope.message = data.message;
            });
    }
})
.controller('profileCtrl', function ($scope) {
    // CHART DATA
  $scope.labels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", ];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
    [65, 59, 80, 81, 56],
    [28, 48, 40, 19, 86]
  ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    
})
.controller('clientCtrl', function ($scope) {
    $scope.listCanSwipe = true
})
.controller('archiveCtrl', function ($scope) {
});

