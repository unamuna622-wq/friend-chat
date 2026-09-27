async function sendMessage() {
    let input = document.getElementById("message");
    let message = input.value.trim();

    if (message === "") {
        return;
    }

    await fetch("/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
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
        let newMessage = document.createElement("p");

        newMessage.textContent = message;

        chat.appendChild(newMessage);
    }
}


loadMessages();