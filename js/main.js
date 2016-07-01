/// <reference path="../libs/easeljs/easeljs.d.ts" />
var demo;
(function (demo) {
    "use strict";
    // ページ読み込み後に実行します。
    window.addEventListener("DOMContentLoaded", function () {
        new Main();
    });
    /**
     * ソートアルゴリズムの可視化デモのクラスです。
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
            for (var i = 0; i < Main.DATA_NUM; i++) {
                this.datas[i] = i;
            }
            this.createMarkers();
            //createjs.Ticker.setFPS(10);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", function () {
                _this.handleTick();
            });
            this.onSelect(null);
        };
        Main.prototype.handleTick = function () {
            if (this.isSorting) {
                if (this.currentSortLoopFunc) {
                    this.currentSortLoopFunc();
                }
                this.updateMarkers();
            }
            this.stage.update();
        };
        Main.prototype.onSelect = function (event) {
            this.shuffleArray(this.datas);
            this.shuffleArray(this.datas);
            this.shuffleArray(this.datas);
            this.updateMarkers();
            this.currentSortLoopFunc = null;
            switch (this.selectBox.selectedIndex) {
                case 0:
                    this.bubbleSort();
                    break;
                case 1:
                    this.insertionSort();
                    break;
                case 2:
                    this.selectionSort();
                    break;
                case 3:
                    this.heapSort();
                    break;
                case 4:
                    this.shellSort();
                    break;
                case 5:
                    this.mergeSort();
                    break;
                case 6:
                    this.quickSort();
                    break;
                default:
                    break;
            }
            this.isSorting = true;
        };
        /**
         * バブルソートです。
         */
        Main.prototype.bubbleSort = function () {
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function () {
                var length = this.datas.length - 1;
                if (this.currentSortStep < length) {
                    for (var i = length; i > this.currentSortStep; i--) {
                        if (this.datas[i - 1] > this.datas[i]) {
                            this.swapData(this.datas, i - 1, i);
                        }
                    }
                    this.currentSortStep++;
                }
                else {
                    this.isSorting = false;
                }
            };
        };
        /**
         * 挿入ソートです。
         */
        Main.prototype.insertionSort = function () {
            this.currentSortStep = 1;
            this.currentSortLoopFunc = function () {
                var length = this.datas.length;
                if (this.currentSortStep < length) {
                    var i = this.currentSortStep;
                    while (this.datas[i - 1] > this.datas[i]) {
                        this.swapData(this.datas, i, i - 1);
                        i--;
                    }
                    this.currentSortStep++;
                }
                else {
                    this.isSorting = false;
                }
            };
        };
        /**
         * 選択ソートです。
         */
        Main.prototype.selectionSort = function () {
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function () {
                if (this.currentSortStep < this.datas.length - 1) {
                    var smallIndex = this.currentSortStep;
                    var length_1 = this.datas.length;
                    for (var i = this.currentSortStep + 1; i < length_1; i++) {
                        if (this.datas[i] < this.datas[smallIndex]) {
                            smallIndex = i;
                        }
                    }
                    this.swapData(this.datas, this.currentSortStep, smallIndex);
                    this.currentSortStep++;
                }
                else {
                    this.isSorting = false;
                }
            };
        };
        /**
         * ヒープソートです。
         */
        Main.prototype.heapSort = function () {
            for (var i_1 = 0; i_1 < this.datas.length; ++i_1) {
                if (this.datas[i_1] == 0) {
                    this.swapData(this.datas, 0, i_1);
                }
            }
            var n = this.datas.length - 1;
            var i = Math.floor(n / 2);
            var loop1 = function () {
                if (i >= 1) {
                    this.downHeap(this.datas, n, i);
                    i--;
                    this.currentSortLoopFunc = loop1;
                }
                else {
                    this.currentSortLoopFunc = loop2;
                }
            };
            var loop2 = function () {
                if (n > 1) {
                    this.swapData(this.datas, n, 1);
                    n--;
                    this.downHeap(this.datas, n, 1);
                    this.currentSortLoopFunc = loop2;
                }
                else {
                    this.isSorting = false;
                }
            };
            this.currentSortLoopFunc = loop1;
        };
        /**
         * シェルソートです。
         */
        Main.prototype.shellSort = function () {
            var h;
            var length = Math.floor(this.datas.length / 9);
            for (var i = 1; i < length; i = i * 3 + 1) {
                h = i;
            }
            var loop1 = function () {
                if (h > 0) {
                    var i = h;
                    var loop2 = function () {
                        if (i < this.datas.length) {
                            var j = i;
                            while (j >= h && this.datas[j - h] > this.datas[j]) {
                                this.swapData(this.datas, j, j - h);
                                j -= h;
                            }
                            i++;
                            this.currentSortLoopFunc = loop2;
                        }
                        else {
                            h = Math.floor(h / 3);
                            this.currentSortLoopFunc = loop1;
                        }
                    };
                    this.currentSortLoopFunc = loop2;
                }
                else {
                    this.isSorting = false;
                }
            };
            this.currentSortLoopFunc = loop1;
        };
        /**
         * マージソートです。
         */
        Main.prototype.mergeSort = function () {
            var regions = [];
            var stack = [];
            stack.push([0, this.datas.length]);
            while (stack.length > 0) {
                var top_1 = stack.pop();
                var firstIndex = top_1[0];
                var lastIndex = top_1[1];
                var middleIndex = Math.floor((firstIndex + lastIndex) / 2);
                if (lastIndex - firstIndex <= 1) {
                    continue;
                }
                stack.push([firstIndex, middleIndex]);
                stack.push([middleIndex, lastIndex]);
                regions.push([firstIndex, lastIndex]);
            }
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function () {
                if (regions.length > 0) {
                    var top_2 = regions.pop();
                    var firstIndex = top_2[0];
                    var lastIndex = top_2[1];
                    var middleIndex = Math.floor((firstIndex + lastIndex) / 2);
                    var work = [];
                    for (var i_2 = firstIndex; i_2 < middleIndex; ++i_2) {
                        work.push(this.datas[i_2]);
                    }
                    var i = firstIndex;
                    var j = 0;
                    var k = middleIndex;
                    while (j < middleIndex - firstIndex && k < lastIndex) {
                        if (work[j] <= this.datas[k]) {
                            this.datas[i++] = work[j++];
                        }
                        else {
                            this.datas[i++] = this.datas[k++];
                        }
                    }
                    while (j < middleIndex - firstIndex) {
                        this.datas[i++] = work[j++];
                    }
                }
                else {
                    this.isSorting = false;
                }
            };
        };
        /**
         * クイックソートです。
         */
        Main.prototype.quickSort = function () {
            var _this = this;
            this.currentSortLoopFunc = null;
            this.quickSortCPS(0, this.datas.length, function () {
                _this.isSorting = false;
            });
        };
        /**
         * クイックソートの実装です。
         */
        Main.prototype.quickSortCPS = function (beginIndex, endIndex, contFunc) {
            var _this = this;
            if (beginIndex >= endIndex) {
                return contFunc();
            }
            var pivotIndex = beginIndex;
            var pivot = this.datas[pivotIndex];
            for (var i = beginIndex + 1; i < endIndex; i++) {
                if (this.datas[i] < pivot) {
                    var temp = this.datas[i];
                    this.datas[i] = this.datas[pivotIndex + 1];
                    this.datas[pivotIndex + 1] = this.datas[pivotIndex];
                    this.datas[pivotIndex] = temp;
                    pivotIndex++;
                }
            }
            return this.quickSortCPS(beginIndex, pivotIndex, function () {
                _this.currentSortLoopFunc = function () {
                    _this.quickSortCPS(pivotIndex + 1, endIndex, function () {
                        return contFunc();
                    });
                };
            });
        };
        /**
         * マーカーを作成します。
         */
        Main.prototype.createMarkers = function () {
            this._markerList = [];
            for (var i = 0; i < this.datas.length; i++) {
                var marker = new createjs.Shape();
                marker.graphics
                    .beginFill(createjs.Graphics.getHSL(300 * i / Main.DATA_NUM, 60, 60))
                    .drawRect(0, 0, Main.GRAPH_WIDTH / Main.DATA_NUM, i * Main.GRAPH_HEIGHT / Main.DATA_NUM)
                    .endFill();
                this._markerList.push(marker);
                this.graphContainer.addChild(marker);
                marker.x = this.datas[i] * Main.GRAPH_WIDTH / Main.DATA_NUM;
                marker.y = Main.GRAPH_HEIGHT - i * Main.GRAPH_HEIGHT / Main.DATA_NUM;
            }
        };
        /**
         * マーカーを更新します。
         */
        Main.prototype.updateMarkers = function () {
            var length = this.datas.length;
            for (var i = 0; i < length; i++) {
                var marker = this._markerList[this.datas[i]];
                marker.x = i * Main.GRAPH_WIDTH / Main.DATA_NUM;
            }
        };
        /**
         * データ列をシャッフルします。
         */
        Main.prototype.shuffleArray = function (array) {
            array.sort(function () {
                return Math.floor(Math.random() * 3) - 1;
            });
        };
        /**
         * データを交換します。
         */
        Main.prototype.swapData = function (array, i, j) {
            var tmp = this.datas[i];
            this.datas[i] = this.datas[j];
            this.datas[j] = tmp;
        };
        /**
         * データ列をヒープします。
         */
        Main.prototype.downHeap = function (array, n, i) {
            var j;
            var x = array[i];
            while ((j = i * 2) <= n) {
                if (j + 1 <= n && array[j] < array[j + 1]) {
                    j++;
                }
                if (array[j] <= x) {
                    break;
                }
                array[i] = array[j];
                i = j;
            }
            array[i] = x;
        };
        Main.DATA_NUM = 400;
        Main.GRAPH_WIDTH = 400;
        Main.GRAPH_HEIGHT = 400;
        return Main;
    })();
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map