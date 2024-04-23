// Oyun tahtasını temsil eden bir iki boyutlu dizi
let board = [];

// Oyun tahtasının satır ve sütun sayısı
let rows = 8;
let columns = 8;

// Oyun alanındaki mayın sayısı ve konumları
let minesCount = 10;
let minesLocation = [];

// Kullanıcının tıkladığı karelerin sayısı
let tilesClicked = 0;

// Bayrak modunun etkin olup olmadığını belirleyen bayrak
let flagEnabled = false;

// Oyunun bitip bitmediğini kontrol eden bayrak
let gameOver = false;

// Sayfa yüklendiğinde oyunu başlatan fonksiyon
window.onload = function() {
    startGame();
}

// Mayınların konumunu belirleyen fonksiyon
function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

// Oyunu başlatan fonksiyon
function startGame() {
    // Mayın sayısını gösteren alanı günceller
    document.getElementById("mines-count").innerText = minesCount;
    // Bayrak modunu etkinleştiren düğmeye tıklama olayını dinler
    document.getElementById("flag-button").addEventListener("click", setFlag);
    // Mayınları yerleştirir
    setMines();

    // Oyun tahtasını oluşturur
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

// Bayrak modunu etkinleştiren veya devre dışı bırakan fonksiyon
function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

// Kareye tıklandığında tetiklenen fonksiyon
function clickTile() {
    // Oyun bittiyse veya kare zaten tıklanmışsa işlem yapma
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    // Bayrak modu etkinleştirilmişse işlemleri gerçekleştir
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        } else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    // Tıklanan karenin mayın olup olmadığını kontrol et
    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    // Tıklanan karenin konumunu al
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    // Mayın kontrolü yap
    checkMine(r, c);
}

// Mayınları gösteren fonksiyon
function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

// Verilen konumda mayın olup olmadığını kontrol eden fonksiyon
function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    // Kareye tıklandığını işaretle
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // Komşu karelerdeki mayınları kontrol et
    minesFound += checkTile(r - 1, c - 1);
    minesFound += checkTile(r - 1, c);
    minesFound += checkTile(r - 1, c + 1);

    minesFound += checkTile(r, c - 1);
    minesFound += checkTile(r, c + 1);

    minesFound += checkTile(r + 1, c - 1);
    minesFound += checkTile(r + 1, c);
    minesFound += checkTile(r + 1, c + 1);

    // Etraftaki mayın sayısını kareye yaz
    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        board[r][c].innerText = "";

        // Etraftaki boş kareleri kontrol et
        checkMine(r - 1, c - 1);
        checkMine(r - 1, c);
        checkMine(r - 1, c + 1);

        checkMine(r, c - 1);
        checkMine(r, c + 1);

        checkMine(r + 1, c - 1);
        checkMine(r + 1, c);
        checkMine(r + 1, c + 1);
    }

    // Tüm kareler tıklandıysa oyunu kazan
    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

// Verilen konumda mayın olup olmadığını kontrol eden fonksiyon
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
