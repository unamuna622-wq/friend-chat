let currentUsername = "";
let savedUsername = localStorage.getItem("username");

if (savedUsername) {
    currentUsername = savedUsername;
}


function saveUsername() {
    let usernameInput = document.getElementById("username");

    let username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    currentUsername = username;
    localStorage.setItem("username", username);

    document.getElementById("username-area").style.display = "none";
}


async function sendMessage() {
    let input = document.getElementById("message");
    let message = input.value.trim();

    if (message === "") {
        return;
    }

    if (currentUsername === "") {
        alert("Please enter your name first");
        return;
    }

    await fetch("/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: currentUsername,
            message: message
        })
    });

    input.value = "";

    loadMessages();
}


async function loadMessages() {
    let response = await fetch("/messages");

    let messages = await response.json();

    let chat = document.getElementById("chat");

    chat.innerHTML = "";

    for (let message of messages) {

        let messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        if (message.username === currentUsername) {
            messageContainer.classList.add("my-message");
        } else {
            messageContainer.classList.add("friend-message");
        }

        let username = document.createElement("div");
        username.classList.add("username");
        username.textContent = message.username;

        let messageText = document.createElement("div");
        messageText.classList.add("message-text");
        messageText.textContent = message.message;

        let timestamp = document.createElement("div");
        timestamp.classList.add("timestamp");
        timestamp.textContent = message.timestamp;

        messageContainer.appendChild(username);
        messageContainer.appendChild(messageText);
        messageContainer.appendChild(timestamp);

        chat.appendChild(messageContainer);
    }

    chat.scrollTop = chat.scrollHeight;
}


loadMessages();

setInterval(loadMessages, 1000);