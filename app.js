
    var myApp = angular.module('coviams', []);
    
    
    myApp.controller('coviamsController', ['$scope', '$timeout', function($scope, $timeout) {
        
        var vm = $scope;
        vm.matrix = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ];
        vm.tempArr = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        vm.tileStatus = [
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]
        ];
        vm.disableClick = false;
        vm.match = {};
        vm.gameStarted = false;
        var count = 0;
        var preIndex, preTile, stopTimer=false;
        var _randomIndex, _randomJIndex, tempArr = [];

        vm.seconds = 0;
        vm.minutes = 0;
        vm.score = 0;
        vm.showDialog = false;

        function shuffleArray(arr) {
            var index = arr.length - 1;
            while(index > 0) {
                var jIndex = arr[index].length - 1;
                while(jIndex > 0) {
                    generateRandomIndex(arr, index, jIndex);
                    var _val = arr[index][jIndex];
                    arr[index][jIndex] = arr[_randomIndex][_randomJIndex];
                    arr[_randomIndex][_randomJIndex] = _val;
                    jIndex--;
                }
                index--;
            }
        }

        function generateRandomIndex(arr, i, j) {
            _randomIndex = Math.floor(Math.random() * i);
            _randomJIndex = Math.floor(Math.random() * j);
            checkForUniqueNumbers(arr, i, j);
        }

        function checkForUniqueNumbers(arr, i, j) {
            if(arr[i][j] === arr[_randomIndex][_randomJIndex]) {
                generateRandomIndex(arr, i, j);
            } else {
                return true;
            }
        }

        vm.timer = function() {
            if(!stopTimer) {
                $timeout(function(){
                    vm.seconds++;
                    vm.seconds = timerString(vm.seconds);
                    if(vm.seconds === 60) {
                        vm.minutes++;
                        vm.seconds = 0;
                    }
                    vm.minutes = timerString(vm.minutes);                
                    vm.timer();
                }, 1000);
            }
        }

        function timerString(val) {
            var valString = val.toString();
            if(valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        }

        function initialiseTimer() {
            vm.seconds = 0;
            vm.minutes = 0;
        }

        vm.closeDialog = function() {
            vm.showDialog = false;            
        }

        vm.startGame = function() {
            console.log(angular.copy(vm.matrix));
            shuffleArray(vm.matrix);
            console.log(vm.matrix);
            vm.gameStarted = true;
            stopTimer = false;            
            initialiseTimer();
            vm.timer();
        }

        vm.resetGame = function() {
            vm.tileStatus = [
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false]
            ];
            stopTimer = true;
            vm.match = {};
            vm.gameStarted = false;
            initialiseTimer();            
        }

        vm.disableMatchedTiles = function(index, tile) {
            return (vm.match[index + tile.toString()] === tile);
        }

        vm.tileClick = function(index, tile) {
            vm.tileStatus[index][tile] = !vm.tileStatus[index][tile];
            if(vm.tileStatus[index][tile]) {
                count++;
                if(count === 1) {
                    preIndex = index;
                    preTile = tile;
                }
                if(count === 2) {
                    count = 0;
                    matchTile(index, tile);
                }
            } else {
                count = 0;
            }
        }

        function matchTile(index, tile) {
            if((vm.matrix[preIndex][preTile] === vm.matrix[index][tile] + 8) || (vm.matrix[preIndex][preTile] + 8 === vm.matrix[index][tile])){
                vm.tileStatus[index][tile] = true;
                vm.tileStatus[preIndex][preTile] = true;
                $timeout(function() {
                    vm.match[index + tile.toString()] = tile;
                    vm.match[preIndex + preTile.toString()] = preTile;
                    vm.disableClick = false;
                    vm.score += 20;
                    $timeout(function() {
                        gameComplete();
                    }, 100)                   
                }, 500);
            } else {
                $timeout(function() {
                    setTileStatus();
                }, 600);
                vm.disableClick = true;
            }
        }

        function gameComplete() {
            if(Object.keys(vm.match).length === (vm.matrix.length * vm.matrix.length)) {
                stopTime();
                vm.showDialog = true;
            }
        }

        function stopTime() {
            stopTimer = true;
        }

        function setTileStatus() {
            for(var i=0; i<vm.matrix.length; i++) {
                for(var j=0; j<vm.matrix[i].length; j++) {
                    if(vm.match[i + j.toString()] !== j) {
                        vm.tileStatus[i][j] = false;
                    }
                }
            }
            vm.disableClick = false;
        }

    }])



    

