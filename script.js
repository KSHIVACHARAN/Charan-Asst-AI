console.log("CHARAN AI SYSTEM STARTING...");


/* =========================================
   ELEMENTS
========================================= */

const sendButton =
    document.getElementById("sendButton");

const userInput =
    document.getElementById("userInput");

const conversation =
    document.getElementById("conversation");

const welcomeScreen =
    document.getElementById("welcomeScreen");

const typingIndicator =
    document.getElementById("typingIndicator");

const micButton =
    document.getElementById("micButton");

const newChatButton =
    document.getElementById("newChatButton");

const recentChats =
    document.getElementById("recentChats");


/* =========================================
   CHECK ELEMENTS
========================================= */

console.log("Send button:", sendButton);

console.log("Input:", userInput);

console.log("Conversation:", conversation);


/* =========================================
   BACKEND URL
========================================= */

const API_URL =
    "http://localhost:5000/api/chat";


/* =========================================
   CHAT HISTORY
========================================= */

let chatHistory = [];


/* =========================================
   SEND BUTTON
========================================= */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* =========================================
   ENTER KEY
========================================= */

userInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================================
   SEND MESSAGE
========================================= */

async function sendMessage() {

    const message =
        userInput.value.trim();


    if (!message) {

        return;

    }


    console.log(
        "📤 Sending:",
        message
    );


    /* Hide welcome */

    if (welcomeScreen) {

        welcomeScreen.style.display =
            "none";

    }


    /* Add user message */

    addMessage(
        message,
        "user"
    );


    /* Clear input */

    userInput.value = "";


    /* Disable button */

    sendButton.disabled = true;


    /* Show typing */

    typingIndicator.classList.remove(
        "hidden"
    );


    scrollToBottom();


    try {

        console.log(
            "📡 Connecting:",
            API_URL
        );


        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            message: message
                        })

                }
            );


        console.log(
            "Backend status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "🤖 AI response:",
            data
        );


        if (!data.reply) {

            throw new Error(
                "Backend did not return reply"
            );

        }


        /* Store history */

        chatHistory.push({
            role: "user",
            content: message
        });


        chatHistory.push({
            role: "assistant",
            content: data.reply
        });


        /* Add AI response */

        addMessage(
            data.reply,
            "ai"
        );


        /* Recent chat */

        addRecentChat(message);


    } catch (error) {

        console.error(
            "❌ ERROR:",
            error
        );


        addMessage(
            "Sorry, I couldn't connect to the AI backend. Make sure your Node.js server is running on port 5000.",
            "ai"
        );

    } finally {

        typingIndicator.classList.add(
            "hidden"
        );

        sendButton.disabled = false;

        userInput.focus();

        scrollToBottom();

    }

}


/* =========================================
   ADD MESSAGE
========================================= */

function addMessage(
    text,
    sender
) {

    const message =
        document.createElement("div");


    message.className =
        "message";


    const avatar =
        document.createElement("div");


    avatar.className =
        "avatar " +
        (
            sender === "user"
                ? "user-avatar"
                : "ai-avatar"
        );


    avatar.textContent =
        sender === "user"
            ? "C"
            : "✦";


    const content =
        document.createElement("div");


    content.className =
        "message-content";


    const name =
        document.createElement("span");


    name.className =
        "message-name";


    name.textContent =
        sender === "user"
            ? "You"
            : "Charan AI";


    const bubble =
        document.createElement("div");


    bubble.className =
        "message-bubble " +
        (
            sender === "user"
                ? "user-bubble"
                : "ai-bubble"
        );


    /* 
       textContent is intentional.
       It prevents AI output from becoming HTML.
    */

    bubble.textContent =
        text;


    content.appendChild(name);

    content.appendChild(bubble);


    message.appendChild(avatar);

    message.appendChild(content);


    conversation.appendChild(message);


    scrollToBottom();

}


/* =========================================
   SCROLL
========================================= */

function scrollToBottom() {

    setTimeout(
        function () {

            const chatArea =
                document.getElementById(
                    "chatArea"
                );


            chatArea.scrollTo({

                top:
                    chatArea.scrollHeight,

                behavior:
                    "smooth"

            });

        },
        50
    );

}


/* =========================================
   QUICK ACTIONS
========================================= */

document
    .querySelectorAll(".action-card")
    .forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const prompt =
                        card.dataset.prompt;


                    userInput.value =
                        prompt;


                    userInput.focus();

                }
            );

        }
    );


/* =========================================
   NEW CHAT
========================================= */

newChatButton.addEventListener(
    "click",
    function () {

        conversation.innerHTML = "";

        chatHistory = [];

        recentChats.innerHTML = "";

        welcomeScreen.style.display =
            "block";

        userInput.focus();

    }
);


/* =========================================
   RECENT CHAT
========================================= */

function addRecentChat(message) {

    const item =
        document.createElement("div");


    item.className =
        "recent-item";


    item.textContent =
        "◈ " +
        (
            message.length > 28
                ? message.substring(0, 28) + "..."
                : message
        );


    recentChats.prepend(item);

}


/* =========================================
   MICROPHONE
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    micButton.addEventListener(
        "click",
        function () {

            console.log(
                "🎙 Listening..."
            );


            micButton.classList.add(
                "recording"
            );


            recognition.start();

        }
    );


    recognition.onresult =
        function (event) {

            const transcript =
                event
                    .results[0][0]
                    .transcript;


            console.log(
                "🎙 Heard:",
                transcript
            );


            userInput.value =
                transcript;


            micButton.classList.remove(
                "recording"
            );


            sendMessage();

        };


    recognition.onerror =
        function (event) {

            console.error(
                "Microphone error:",
                event.error
            );


            micButton.classList.remove(
                "recording"
            );

        };


    recognition.onend =
        function () {

            micButton.classList.remove(
                "recording"
            );

        };

} else {

    console.warn(
        "Speech recognition not supported"
    );

    micButton.addEventListener(
        "click",
        function () {

            alert(
                "Voice input is not supported in this browser."
            );

        }
    );

}


/* =========================================
   STARTUP
========================================= */

console.log(
    "✅ CHARAN AI FRONTEND READY"
);