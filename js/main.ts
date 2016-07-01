/// <reference path="../libs/easeljs/easeljs.d.ts" />

namespace demo {
    "use strict";

    // ページ読み込み後に実行します。
    window.addEventListener("DOMContentLoaded", () => {
        new Main();
    });

    /**
     * ソートアルゴリズムの可視化デモのクラスです。
     */
    class Main {

        static DATA_NUM:number = 400;
        static GRAPH_WIDTH:number = 400;
        static GRAPH_HEIGHT:number = 400;

        private stage:createjs.Stage;
        private graphContainer:createjs.Container;
        private selectBox:HTMLSelectElement;
        private currentSortLoopFunc:Function;

        private datas:number[];
        private _markerList:createjs.Shape[];
        private currentSortStep:number;
        private isSorting:boolean = false;

        constructor() {
            this.init();
        }

        private init():void {
            this.selectBox = <HTMLSelectElement>document.getElementById("selectBox");
            this.selectBox.addEventListener("change", (event) => {
                this.onSelect(event);
            });

            const btnNext = <HTMLElement>document.getElementById("btnNext");
            btnNext.addEventListener("click", ()=> {
                if (this.selectBox.selectedIndex >= this.selectBox.length - 1) {
                    this.selectBox.selectedIndex = 0;
                } else {
                    this.selectBox.selectedIndex += 1;
                }
                this.onSelect(null);
            });
            const btnPrev = <HTMLElement>document.getElementById("btnPrev");
            btnPrev.addEventListener("click", ()=> {
                this.selectBox.selectedIndex -= 1;
                if (this.selectBox.selectedIndex < 0) {
                    this.selectBox.selectedIndex = this.selectBox.length - 1;
                }
                this.onSelect(null);
            });

            // Stageオブジェクトを作成します
            this.stage = new createjs.Stage("myCanvas");

            this.graphContainer = new createjs.Container();
            this.stage.addChild(this.graphContainer);

            this.datas = [];
            for (let i:number = 0; i < Main.DATA_NUM; i++) {
                this.datas[i] = i;
            }
            this.createMarkers();

            //createjs.Ticker.setFPS(10);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", () => {
                this.handleTick();
            });

            this.onSelect(null);
        }

        private handleTick():void {
            if (this.isSorting) {
                if (this.currentSortLoopFunc) {
                    this.currentSortLoopFunc();
                }
                this.updateMarkers();
            }
            this.stage.update();
        }

        private onSelect(event:any):void {
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
        }

        /**
         * バブルソートです。
         */
        private bubbleSort():void {
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function ():void {
                const length = this.datas.length - 1;
                if (this.currentSortStep < length) {
                    for (let i = length; i > this.currentSortStep; i--) {
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
        }

        /**
         * 挿入ソートです。
         */
        private insertionSort():void {
            this.currentSortStep = 1;
            this.currentSortLoopFunc = function ():void {
                const length = this.datas.length;
                if (this.currentSortStep < length) {
                    let i = this.currentSortStep;
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
        }

        /**
         * 選択ソートです。
         */
        private selectionSort():void {
            this.currentSortStep = 0;
            this.currentSortLoopFunc = function ():void {
                if (this.currentSortStep < this.datas.length - 1) {
                    let smallIndex:number = this.currentSortStep;
                    const length = this.datas.length;
                    for (let i = this.currentSortStep + 1; i < length; i++) {
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
        }

        /**
         * ヒープソートです。
         */
        private heapSort() {
            for (let i = 0; i < this.datas.length; ++i) {
                if (this.datas[i] == 0) {
                    this.swapData(this.datas, 0, i);
                }
            }

            let n:number = this.datas.length - 1;
            let i:number = Math.floor(n / 2);
            let loop1:Function = function ():void {
                if (i >= 1) {
                    this.downHeap(this.datas, n, i);
                    i--;
                    this.currentSortLoopFunc = loop1;
                } else {
                    this.currentSortLoopFunc = loop2;
                }
            }

            let loop2:Function = function ():void {
                if (n > 1) {
                    this.swapData(this.datas, n, 1);
                    n--;
                    this.downHeap(this.datas, n, 1);
                    this.currentSortLoopFunc = loop2;
                }
                else {
                    this.isSorting = false;
                }
            }

            this.currentSortLoopFunc = loop1;
        }

        /**
         * シェルソートです。
         */
        private shellSort() {
            let h:number;
            const length:number = Math.floor(this.datas.length / 9);
            for (let i = 1; i < length; i = i * 3 + 1) {
                h = i;
            }

            let loop1:Function = function ():void {
                if (h > 0) {
                    let i:number = h;
                    let loop2:Function = function ():void {
                        if (i < this.datas.length) {
                            let j:number = i;
                            while (j >= h && this.datas[j - h] > this.datas[j]) {
                                this.swapData(this.datas, j, j - h);
                                j -= h;
                            }
                            i++;
                            this.currentSortLoopFunc = loop2;
                        } else {
                            h = Math.floor(h / 3);
                            this.currentSortLoopFunc = loop1;
                        }
                    }
                    this.currentSortLoopFunc = loop2;
                }
                else {
                    this.isSorting = false;
                }
            }
            this.currentSortLoopFunc = loop1;
        }

        /**
         * マージソートです。
         */
        private mergeSort() {
            let regions:number[][] = [];
            let stack:number[][] = [];
            stack.push([0, this.datas.length]);
            while (stack.length > 0) {
                let top:number[] = stack.pop();
                let firstIndex:number = top[0];
                let lastIndex:number = top[1];
                let middleIndex:number = Math.floor((firstIndex + lastIndex) / 2);
                if (lastIndex - firstIndex <= 1) {
                    continue;
                }
                stack.push([firstIndex, middleIndex]);
                stack.push([middleIndex, lastIndex]);
                regions.push([firstIndex, lastIndex]);
            }

            this.currentSortStep = 0;
            this.currentSortLoopFunc = function ():void {
                if (regions.length > 0) {
                    let top:number[] = regions.pop();
                    let firstIndex:number = top[0];
                    let lastIndex:number = top[1];
                    let middleIndex:number = Math.floor((firstIndex + lastIndex) / 2);

                    let work:number[] = [];
                    for (let i = firstIndex; i < middleIndex; ++i) {
                        work.push(this.datas[i]);
                    }

                    let i:number = firstIndex;
                    let j:number = 0;
                    let k:number = middleIndex;
                    while (j < middleIndex - firstIndex && k < lastIndex) {
                        if (work[j] <= this.datas[k]) {
                            this.datas[i++] = work[j++];
                        } else {
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
        }

        /**
         * クイックソートです。
         */
        private quickSort() {
            this.currentSortLoopFunc = null;
            this.quickSortCPS(0, this.datas.length, () => {
                this.isSorting = false;
            });
        }

        /**
         * クイックソートの実装です。
         */
        private quickSortCPS(beginIndex:number, endIndex:number, contFunc:Function):Function {
            if (beginIndex >= endIndex) {
                return contFunc();
            }

            let pivotIndex:number = beginIndex;
            let pivot:number = this.datas[pivotIndex];

            for (let i = beginIndex + 1; i < endIndex; i++) {
                if (this.datas[i] < pivot) {
                    let temp = this.datas[i];
                    this.datas[i] = this.datas[pivotIndex + 1];
                    this.datas[pivotIndex + 1] = this.datas[pivotIndex];
                    this.datas[pivotIndex] = temp;
                    pivotIndex++;
                }
            }

            return this.quickSortCPS(beginIndex, pivotIndex, () => {
                    this.currentSortLoopFunc = ()=> {
                        this.quickSortCPS(pivotIndex + 1, endIndex,
                            function ():void {
                                return contFunc();
                            });
                    }
                }
            );
        }

        /**
         * マーカーを作成します。
         */
        private createMarkers():void {
            this._markerList = [];
            for (let i:number = 0; i < this.datas.length; i++) {
                const marker:createjs.Shape = new createjs.Shape();
                marker.graphics
                    .beginFill(createjs.Graphics.getHSL(300 * i / Main.DATA_NUM, 60, 60))
                    .drawRect(0, 0, Main.GRAPH_WIDTH / Main.DATA_NUM, i * Main.GRAPH_HEIGHT / Main.DATA_NUM)
                    .endFill()
                this._markerList.push(marker);
                this.graphContainer.addChild(marker);
                marker.x = this.datas[i] * Main.GRAPH_WIDTH / Main.DATA_NUM;
                marker.y = Main.GRAPH_HEIGHT - i * Main.GRAPH_HEIGHT / Main.DATA_NUM;
            }
        }

        /**
         * マーカーを更新します。
         */
        private updateMarkers():void {
            const length:number = this.datas.length;
            for (let i:number = 0; i < length; i++) {
                let marker:createjs.Shape = this._markerList[this.datas[i]];
                marker.x = i * Main.GRAPH_WIDTH / Main.DATA_NUM;
            }
        }

        /**
         * データ列をシャッフルします。
         */
        private shuffleArray(array:number[]):void {
            array.sort(function ():number {
                return Math.floor(Math.random() * 3) - 1
            });
        }

        /**
         * データを交換します。
         */
        private swapData(array:number[], i:number, j:number):void {
            let tmp:number = this.datas[i];
            this.datas[i] = this.datas[j];
            this.datas[j] = tmp;
        }

        /**
         * データ列をヒープします。
         */
        private downHeap(array:number[], n:number, i:number) {
            let j:number;
            let x:number = array[i];
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
        }
    }
}