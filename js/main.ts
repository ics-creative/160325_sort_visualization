/// <reference path="../libs/easeljs/easeljs.d.ts" />

namespace demo {
	"use strict";

	// ページ読み込み後に実行
	window.addEventListener("DOMContentLoaded", () => {
		new Main()
	});

	/**
	 * ランダムアルゴリズムの可視化デモのクラスです。
	 */
	class Main {

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
                }else
                {
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
			for (let i:number = 0; i < 400; i++) {
				this.datas[i] = i;
			}
			this.createMarkers();

			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.addEventListener("tick", () => {
				this.handleTick();
			});

			this.onSelect(null);
		}

		private handleTick():void {
			this.currentSortLoopFunc();
			this.updateMarkers();
			this.stage.update();
		}

		private onSelect(event:any):void {
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
		}

		//

		private bubbleSort():void {
			// バブルソート
			this.currentSortStep = 0;
			this.currentSortLoopFunc = function():void {
				const length = this.datas.length - 1;
				if (this.currentSortStep < length) {
					for (var j = length; j > this.currentSortStep; j--) {
						if (this.datas[j - 1] > this.datas[j]) {
							this.swapData(this.datas, j - 1, j);
						}
					}
					this.currentSortStep++;
				}
			};
		}

		private mergeSort() {
			// マージソート
			var regions:number[][] = [];
			var stack:number[][] = [];
			stack.push([0, this.datas.length]);
			while (stack.length > 0) {
				var top:number[] = stack.pop();
				var first:number = top[0];
				var last:number = top[1];
				var middle:number = Math.floor((first + last) / 2);
				if (last - first <= 1) {
					continue;
				}
				stack.push([first, middle]);
				stack.push([middle, last]);
				regions.push([first, last]);
			}

			this.currentSortStep = 0;
			this.currentSortLoopFunc = function():void {
				if (regions.length > 0) {
					var top:number[] = regions.pop();
					var first:number = top[0];
					var last:number = top[1];
					var middle:number = Math.floor((first + last) / 2);

					var work:number[] = [];
					for (var i = first; i < middle; ++i) {
						work.push(this.datas[i]);
					}

					var i:number = first;
					var j:number = 0;
					var k:number = middle;
					while (j < middle - first && k < last) {
						if (work[j] <= this.datas[k]) {
							this.datas[i++] = work[j++];
						} else {
							this.datas[i++] = this.datas[k++];
						}
					}
					while (j < middle - first) {
						this.datas[i++] = work[j++];
					}
				}
			};
		}

		private insertionSort():void {
			// 挿入ソート
			this.currentSortStep = 0;
			this.currentSortLoopFunc = function():void {
				if (this.currentSortStep < this.datas.length) {
					var j = this.currentSortStep;
					while (j >= 1 && this.datas[j - 1] > this.datas[j]) {
						this.swapData(this.datas, j, j - 1);
						j--;
					}
					this.currentSortStep++;
				}
			};
		}

		private calcRandom():number {
			// 通常の乱数
			const value = Math.random();
			return value;
		}

		private calcAddRandom():number {
			// 加算の乱数
			const value = (Math.random() + Math.random()) / 2;

			return value;
		}

		private calcMultiplyRandom():number {
			// 乗算の乱数
			const value = Math.random() * Math.random();
			return value;
		}

		private calcSquareRandom():number {
			// 2乗の乱数
			const r:number = Math.random();
			const value = r * r;

			return value;
		}

		private calcSqrtRandom():number {
			// 平方根の乱数
			const value = Math.sqrt(Math.random());

			return value;
		}

		private createMarkers():void {
			this._markerList = [];
			for (let i:number = 0; i < this.datas.length; i++) {
				const marker:createjs.Shape = new createjs.Shape();
				marker.graphics
					.beginFill(createjs.Graphics.getHSL(300 * i / Main.GRAPH_WIDTH, 100, 50 + 10 * i / Main.GRAPH_WIDTH))
					.drawRect(-2, -2, 4, 4/*i*/)
					.endFill()
					.beginFill(createjs.Graphics.getHSL(300 * i / Main.GRAPH_WIDTH, 100, 50, 0.2))
					.drawRect(-6, -6, 12, 12)
					.endFill()
				this._markerList.push(marker);
				this.graphContainer.addChild(marker);
				marker.x = this.datas[i];
				marker.y = Main.GRAPH_HEIGHT - i;
			}
		}

		private updateMarkers():void {
			const length:number = this.datas.length;
			for (let i:number = 0; i < length; i++) {
				var marker:createjs.Shape = this._markerList[i]
				marker.x = this.datas[i];
			}
		}

		//
		private shuffleArray(array:number[]):void {
			array.sort(function():number{return Math.floor(Math.random()*3)-1});
		}

		private swapData(array:number[], i:number, j:number):void {
			var tmp:number = this.datas[i];
			this.datas[i] = this.datas[j];
			this.datas[j] = tmp;
		}
	}
}





