/// <reference path="../libs/easeljs/easeljs.d.ts" />
var demo;
(function (demo) {
    "use strict";
    // ページ読み込み後に実行
    window.addEventListener("DOMContentLoaded", function () {
        new Main();
    });
    /**
     * ランダムアルゴリズムの可視化デモのクラスです。
     */
    var Main = (function () {
        function Main() {
            this.isSorting = false;
            this.init();
        }
        Main.prototype.init = function () {
            var _this = this;
            this.selectBox = document.getElementById("selectBox");
            this.selectBox.addEventListener("change", function (event) {
                _this.onSelect(event);
            });
            var btnNext = document.getElementById("btnNext");
            btnNext.addEventListener("click", function () {
                if (_this.selectBox.selectedIndex >= _this.selectBox.length - 1) {
                    _this.selectBox.selectedIndex = 0;
                }
                else {
                    _this.selectBox.selectedIndex += 1;
                }
                _this.onSelect(null);
            });
            var btnPrev = document.getElementById("btnPrev");
            btnPrev.addEventListener("click", function () {
                _this.selectBox.selectedIndex -= 1;
                if (_this.selectBox.selectedIndex < 0) {
                    _this.selectBox.selectedIndex = _this.selectBox.length - 1;
                }
                _this.onSelect(null);
            });
            // Stageオブジェクトを作成します
            this.stage = new createjs.Stage("myCanvas");
            this.graphContainer = new createjs.Container();
            this.stage.addChild(this.graphContainer);
            this.datas = [];
            for (var i = 0; i < 400; i++) {
                this.datas[i] = i;
            }
            this.createMarkers();
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", function () {
                _this.handleTick();
            });
            this.onSelect(null);
        };
        Main.prototype.handleTick = function () {
            this.currentSortLoopFunc();
            this.updateMarkers();
            this.stage.update();
        };
        Main.prototype.onSelect = function (event) {
            this.shuffleArray(this.datas);
            this.shuffleArray(this.datas);
            this.shuffleArray(this.datas);
            switch (this.selectBox.selectedIndex) {
                case 0:
                    this.bubbleSort();
                    break;
                case 1:
                    this.mergeSort();
                    break;
                case 2:
                    this.insertionSort();
                    break;
                case 3:
                    //this.currentRandomFunc = this.calcSquareRandom;
                    break;
                case 4:
                    //this.currentRandomFunc = this.calcSqrtRandom;
                    break;
                case 5:
                    //this.currentRandomFunc = this.calcNormalRandom;
                    break;
                default:
                    break;
            }
            this.updateMarkers();
            this.isSorting = true;
        };
        //
        Main.prototype.bubbleSort = function () {
            // バブルソート
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function () {
                var length = this.datas.length - 1;
                if (this.currentSortStep < length) {
                    for (var j = length; j > this.currentSortStep; j--) {
                        if (this.datas[j - 1] > this.datas[j]) {
                            this.swapData(this.datas, j - 1, j);
                        }
                    }
                    this.currentSortStep++;
                }
            };
        };
        Main.prototype.mergeSort = function () {
            // マージソート
            var regions = [];
            var stack = [];
            stack.push([0, this.datas.length]);
            while (stack.length > 0) {
                var top = stack.pop();
                var first = top[0];
                var last = top[1];
                var middle = Math.floor((first + last) / 2);
                if (last - first <= 1) {
                    continue;
                }
                stack.push([first, middle]);
                stack.push([middle, last]);
                regions.push([first, last]);
            }
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function () {
                if (regions.length > 0) {
                    var top = regions.pop();
                    var first = top[0];
                    var last = top[1];
                    var middle = Math.floor((first + last) / 2);
                    var work = [];
                    for (var i = first; i < middle; ++i) {
                        work.push(this.datas[i]);
                    }
                    var i = first;
                    var j = 0;
                    var k = middle;
                    while (j < middle - first && k < last) {
                        if (work[j] <= this.datas[k]) {
                            this.datas[i++] = work[j++];
                        }
                        else {
                            this.datas[i++] = this.datas[k++];
                        }
                    }
                    while (j < middle - first) {
                        this.datas[i++] = work[j++];
                    }
                }
            };
        };
        Main.prototype.insertionSort = function () {
            // 挿入ソート
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function () {
                if (this.currentSortStep < this.datas.length) {
                    var j = this.currentSortStep;
                    while (j >= 1 && this.datas[j - 1] > this.datas[j]) {
                        this.swapData(this.datas, j, j - 1);
                        j--;
                    }
                    this.currentSortStep++;
                }
            };
        };
        Main.prototype.calcRandom = function () {
            // 通常の乱数
            var value = Math.random();
            return value;
        };
        Main.prototype.calcAddRandom = function () {
            // 加算の乱数
            var value = (Math.random() + Math.random()) / 2;
            return value;
        };
        Main.prototype.calcMultiplyRandom = function () {
            // 乗算の乱数
            var value = Math.random() * Math.random();
            return value;
        };
        Main.prototype.calcSquareRandom = function () {
            // 2乗の乱数
            var r = Math.random();
            var value = r * r;
            return value;
        };
        Main.prototype.calcSqrtRandom = function () {
            // 平方根の乱数
            var value = Math.sqrt(Math.random());
            return value;
        };
        Main.prototype.createMarkers = function () {
            this._markerList = [];
            for (var i = 0; i < this.datas.length; i++) {
                var marker = new createjs.Shape();
                marker.graphics
                    .beginFill(createjs.Graphics.getHSL(300 * i / Main.GRAPH_WIDTH, 100, 50 + 10 * i / Main.GRAPH_WIDTH))
                    .drawRect(-2, -2, 4, 4 /*i*/)
                    .endFill()
                    .beginFill(createjs.Graphics.getHSL(300 * i / Main.GRAPH_WIDTH, 100, 50, 0.2))
                    .drawRect(-6, -6, 12, 12)
                    .endFill();
                this._markerList.push(marker);
                this.graphContainer.addChild(marker);
                marker.x = this.datas[i];
                marker.y = Main.GRAPH_HEIGHT - i;
            }
        };
        Main.prototype.updateMarkers = function () {
            var length = this.datas.length;
            for (var i = 0; i < length; i++) {
                var marker = this._markerList[i];
                marker.x = this.datas[i];
            }
        };
        //
        Main.prototype.shuffleArray = function (array) {
            array.sort(function () { return Math.floor(Math.random() * 3) - 1; });
        };
        Main.prototype.swapData = function (array, i, j) {
            var tmp = this.datas[i];
            this.datas[i] = this.datas[j];
            this.datas[j] = tmp;
        };
        Main.GRAPH_WIDTH = 400;
        Main.GRAPH_HEIGHT = 400;
        return Main;
    })();
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map