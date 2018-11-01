function checking(a, symbol) {
	return recursionChecking(a, symbol, false);
}

function recursionChecking(a, symbol, bool) {
	let willReturnedValue;
	let finished = false, copyOfSymbol;

	if(symbol == "X") {
		copyOfSymbol = "O"
	} else {
		copyOfSymbol = "X"
	}

	a.map((e, i) => {
		if(e.title == "" && !finished) {
			let array = a.slice();
			array[i] = {
				id: e.id,
				title: symbol
			}

			if(checkObject(array) == symbol) {
				willReturnedValue = e.id;
				finished = true;
			}
		}
	})

	if(!finished && !bool) {
		willReturnedValue = recursionChecking(a, copyOfSymbol, true);
		if(willReturnedValue == null) {
			let emptyCells = [], notEmptyCellsBot = [];

			a.forEach((index) => {
				if(index.title == "") {
					emptyCells.push(index.id)
				}
				if(index.title == symbol) {
					notEmptyCellsBot.push(index.id)
				}
			})

			if(a.filter((e) => e.title == "X").length == 1 || !notEmptyCellsBot.length) {
				let random;

				while(true) {
					random = Math.floor(Math.random() * 9) + 1;
					if(emptyCells.indexOf(random) != -1) {
						break;
					}
				}
				return random;
			}

			function findBetterMove() {
				notEmptyCellsBot.forEach((index) => {
					if(index == 1) {
						if(emptyCells.indexOf(index + 1) != -1) {
							willReturnedValue = index + 1;
						} else if(emptyCells.indexOf(index + 3) != -1) {
							willReturnedValue = index + 3;
						} else if(emptyCells.indexOf(index + 4) != -1) {
							willReturnedValue = index + 4;
						}
					} else if (index == 2) {
						if(emptyCells.indexOf(index - 1) != -1) {
							willReturnedValue = index - 1;
						} else if(emptyCells.indexOf(index + 3) != -1) {
							willReturnedValue = index + 3;
						} else if(emptyCells.indexOf(index + 1) != -1) {
							willReturnedValue = index + 1;
						}
					} else if (index == 3) {
						if(emptyCells.indexOf(index - 1) != -1) {
							willReturnedValue = index - 1;
						} else if(emptyCells.indexOf(index + 3) != -1) {
							willReturnedValue = index + 3;
						} else if(emptyCells.indexOf(index + 2) != -1) {
							willReturnedValue = index + 2;
						}
					} else if (index == 4) {
						if(emptyCells.indexOf(index - 3) != -1) {
							willReturnedValue = index - 3;
						} else if(emptyCells.indexOf(index + 3) != -1) {
							willReturnedValue = index + 3;
						} else if(emptyCells.indexOf(index + 1) != -1) {
							willReturnedValue = index + 1;
						}
					} else if (index == 5) {
						if(emptyCells.indexOf(index - 1) != -1) {
							willReturnedValue = index - 1;
						} else if(emptyCells.indexOf(index + 3) != -1) {
							willReturnedValue = index + 3;
						} else if(emptyCells.indexOf(index + 2) != -1) {
							willReturnedValue = index + 2;
						}  else if(emptyCells.indexOf(index - 3) != -1) {
							willReturnedValue = index - 3;
						} else if(emptyCells.indexOf(index + 1) != -1) {
							willReturnedValue = index + 1;
						} else if(emptyCells.indexOf(index - 2) != -1) {
							willReturnedValue = index - 2;
						} else if(emptyCells.indexOf(index + 4) != -1) {
							willReturnedValue = index + 4;
						} else if(emptyCells.indexOf(index -4) != -1) {
							willReturnedValue = index -4;
						} 
					} else if(index == 6) {
						if(emptyCells.indexOf(index - 3) != -1) {
							willReturnedValue = index - 3;
						} else if(emptyCells.indexOf(index + 3) != -1) {
							willReturnedValue = index + 3;
						} else if(emptyCells.indexOf(index - 1) != -1) {
							willReturnedValue = index - 1;
						}
					} else if (index == 7) {
						if(emptyCells.indexOf(index + 1) != -1) {
							willReturnedValue = index + 1;
						} else if(emptyCells.indexOf(index - 3) != -1) {
							willReturnedValue = index - 3;
						} else if(emptyCells.indexOf(index - 2) != -1) {
							willReturnedValue = index - 2;
						}
					} else if (index == 8) {
						if(emptyCells.indexOf(index - 1) != -1) {
							willReturnedValue = index - 1;
						} else if(emptyCells.indexOf(index - 3) != -1) {
							willReturnedValue = index - 3;
						} else if(emptyCells.indexOf(index + 1) != -1) {
							willReturnedValue = index + 1;
						}
					} else if (index == 9) {
						if(emptyCells.indexOf(index - 3) != -1) {
							willReturnedValue = index - 3;
						} else if(emptyCells.indexOf(index - 1) != -1) {
							willReturnedValue = index - 1;
						} else if(emptyCells.indexOf(index - 4) != -1) {
							willReturnedValue = index - 4;
						}
					}
				})
			}

			findBetterMove();
		}
	}

	if(!willReturnedValue) {
		willReturnedValue = null;
	}

	return willReturnedValue;
}

function checkObject(a) {
	if(a[0].title == "X" && a[1].title == "X" && a[2].title == "X") {
		return "X";
	} else if(a[0].title == "X" && a[3].title == "X" && a[6].title == "X") {  
		return "X";
	} else if(a[1].title == "X" && a[4].title == "X" && a[7].title == "X") {
		return "X";
	} else if(a[2].title == "X" && a[5].title == "X" && a[8].title == "X") {
		return "X";
	} else if(a[3].title == "X" && a[4].title == "X" && a[5].title == "X") {
		return "X";
	} else if(a[6].title == "X" && a[7].title == "X" && a[8].title == "X") {
		return "X";
	} else if(a[0].title == "X" && a[4].title == "X" && a[8].title == "X") {
		return "X";
	} else if(a[6].title == "X" && a[4].title == "X" && a[2].title == "X") {
		return "X";
	}

	if(a[0].title == "O" && a[1].title == "O" && a[2].title == "O") {
		return "O";
	} else if(a[0].title == "O" && a[3].title == "O" && a[6].title == "O") {
		return "O";
	} else if(a[1].title == "O" && a[4].title == "O" && a[7].title == "O") {
		return "O";
	} else if(a[2].title == "O" && a[5].title == "O" && a[8].title == "O") {
		return "O";
	} else if(a[3].title == "O" && a[4].title == "O" && a[5].title == "O") {
		return "O";
	} else if(a[6].title == "O" && a[7].title == "O" && a[8].title == "O") {
		return "O";
	} else if(a[0].title == "O" && a[4].title == "O" && a[8].title == "O") {
		return "O";
	} else if(a[6].title == "O" && a[4].title == "O" && a[2].title == "O") {
		return "O";
	}

	return "Z";
}

export default checking;