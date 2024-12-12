const player = document.getElementById('player');
const tree = document.getElementById('tree');
const itemList = document.getElementById('itemList');

let inventory = {
    wood: 0,
    axe: false,
};

let isJumping = false;
let jumpHeight = 0;
let gravity = 2;
let isGrounded = true;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            movePlayer(-10);
            break;
        case 'ArrowRight':
            movePlayer(10);
            break;
        case 'ArrowUp':
            if (isGrounded) jump();
            break;
        case 'b':
            breakTree();
            break;
        case ' ':
            craftAxe();
            break;
    }
});

function movePlayer(direction) {
    const playerRect = player.getBoundingClientRect();
    if (playerRect.left + direction >= 0 && playerRect.right + direction <= 800) {
        player.style.left = `${playerRect.left + direction}px`;
    }
}

function jump() {
    isJumping = true;
    isGrounded = false;
    jumpHeight = 0;
    requestAnimationFrame(jumpAnimation);
}

function jumpAnimation() {
    if (isJumping) {
        jumpHeight += gravity;
        player.style.bottom = `${jumpHeight}px`;

        if (jumpHeight >= 100) {
            isJumping = false;
            requestAnimationFrame(fallAnimation);
        } else {
            requestAnimationFrame(jumpAnimation);
        }
    }
}

function fallAnimation() {
    if (!isGrounded) {
        jumpHeight -= gravity;
        if (jumpHeight <= 0) {
            jumpHeight = 0;
            isGrounded = true;
        }
        player.style.bottom = `${jumpHeight}px`;
        requestAnimationFrame(fallAnimation);
    }
}

function breakTree() {
    const playerRect = player.getBoundingClientRect();
    const treeRect = tree.getBoundingClientRect();

    if (playerRect.right > treeRect.left && playerRect.left < treeRect.right && inventory.axe) {
        inventory.wood += 2; // More wood if using an axe
        updateInventory('Wood', 2);
        tree.style.display = 'none'; // Hide tree after breaking
    } else if (playerRect.right > treeRect.left && playerRect.left < treeRect.right) {
        inventory.wood += 1; // Just breaking the tree without axe
        updateInventory('Wood', 1);
        tree.style.display = 'none'; // Hide tree after breaking
    }
}

function craftAxe() {
    if (inventory.wood >= 3) {
        inventory.axe = true;
        inventory.wood -= 3;
        updateInventory('Axe', 1);
        alert('Crafted an Axe!');
    } else {
        alert('Not enough wood to craft an axe.');
    }
}

function updateInventory(item, amount) {
    let listItem = document.createElement('li');
    listItem.textContent = `${item}: ${amount}`;
    itemList.appendChild(listItem);
}