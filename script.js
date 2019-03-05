"use strict";

angular.module("tictactoeApp", []);

angular.module("tictactoeApp").controller("tictactoeCtrl", [
    "$rootScope", "$scope", "$window", "$timeout", "tictactoeSvc",
    function(
            $rootScope, $scope, $window, $timeout, tictactoeSvc) {

        $scope.CELL_SIZE = 50;
        $scope.MIN_LENGTH = 5;

        $scope.field = [];
        $scope.winner = null;

        var i, j;

        for (i = 0; (i + 3) * $scope.CELL_SIZE < $window.innerHeight; i++) {
            $scope.field.push([]);
            for (j = 0; (j + 3) * $scope.CELL_SIZE < $window.innerWidth; j++) {
                $scope.field[i].push(null);
            }
        }

        while ($scope.field.length < $scope.MIN_LENGTH) {
            $scope.field.push([]);
        }
        for (i = 0; i < $scope.field.length; i++) {
            while ($scope.field[i].length < $scope.MIN_LENGTH) {
                $scope.field[i].push(null);
            }
        }

        $scope.processMove = function(row, column) {
            if ($scope.winner !== null) {
                return;
            }

            $scope.field[row][column] = tictactoeSvc.PLAYER_CHAR;
            tictactoeSvc.move($scope.field);

            $scope.winner = tictactoeSvc.check($scope.field);
            if ($scope.winner !== null) {
                $timeout(function() {
                    $window.alert("'" + $scope.winner + "' wins.");
                }, 0);
            }
        }

    }
]);

angular.module("tictactoeApp").service("tictactoeSvc", [
    function() {
        return {
            PLAYER_CHAR: "X",
            AI_CHARS: ["O"],

            WINNING_LENGTH: 5,

            move: function(field) {
                var i, row, column;

                for (i = 0; i < this.AI_CHARS.length; i++) {
                    do {
                        row = Math.floor(Math.random() * (field.length - 1));
                        column = Math.floor(Math.random() * (field[row].length - 1))
                    } while (field[row][column] !== null);

                    field[row][column] = this.AI_CHARS[i];
                }
            },
            check: function(field) {
                var row, column, i, j, win;

                for (row = 0; row < field.length; row++) {
                    var str = "str";
                    for (column = 0; column < field[row].length; column++) {
                        if (field[row][column] === null) {
                            continue;
                        }

                        // Проверяем вертикаль.
                        if (row <= field.length - this.WINNING_LENGTH + 1) {
                            win = true;

                            for (i = row; i < row + this.WINNING_LENGTH; i++) {
                                if (field[i][column] !== field[row][column]) {
                                    win = false;
                                    break;
                                }
                            }

                            if (win) {
                                return field[row][column];
                            }
                        }

                        // Проверяем горизонталь.
                        if (column <= field[row].length - this.WINNING_LENGTH + 1) {
                            win = true;

                            for (j = column; j < column + this.WINNING_LENGTH; j++) {
                                if (field[row][j] !== field[row][column]) {
                                    win = false;
                                    break;
                                }
                            }

                            if (win) {
                                return field[row][column];
                            }
                        }

                        // Проверяем диагональ направо-вниз.
                        if ((row <= field.length - this.WINNING_LENGTH + 1) && (column <= field[row].length - this.WINNING_LENGTH + 1)) {
                            win = true;

                            for (i = row, j = column; (i < row + this.WINNING_LENGTH) && (j < column + this.WINNING_LENGTH); i++, j++) {
                                if (field[i][j] !== field[row][column]) {
                                    win = false;
                                    break;
                                }
                            }

                            if (win) {
                                return field[row][column];
                            }
                        }

                        // Проверяем диагональ направо-вверх.
                        if ((row >= this.WINNING_LENGTH - 1) && (column <= field[row].length - this.WINNING_LENGTH + 1)) {
                            win = true;

                            for (i = row, j = column; (i > row - this.WINNING_LENGTH) && (j < column + this.WINNING_LENGTH); i--, j++) {
                                if (field[i][j] !== field[row][column]) {
                                    win = false;
                                    break;
                                }
                            }

                            if (win) {
                                return field[row][column];
                            }
                        }
                    }
                }

                return null;
            }
        }
    }
]);
