// socket code in js.

const socket = io.connect('http://localhost:3000');
const username = prompt('Enter your name');
// emit the username to the server
socket.emit("join", username);

// get the elements
const messageInput = document.getElementById("message-input");
const messageList = document.getElementById("message-list");
const sendButton = document.getElementById("send-message");

sendButton.addEventListener('click', function () {
    // read the message from input and send to server.
    const message = messageInput.value;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    if (message) {
        socket.emit('new_message', {message, time}); // Emitting the message to the server

        // Clear the input field
        messageInput.value = '';

        // add message to the list 
        const messageCont = document.createElement('div');
        messageCont.id = "mC";

        const nIcon = document.createElement('div');
        nIcon.id = 'ic';
        
        // Create a span for the username
    const usernameElement = document.createElement('span');
    usernameElement.className = 'username';
    usernameElement.innerText = username;
    usernameElement.id = 'userE';

    // Create a span for the time
    const timeElement = document.createElement('span');
    timeElement.className = 'time';
    timeElement.innerText = time;
    timeElement.id = 'tim';

    // Append username and time to nIcon
    nIcon.appendChild(usernameElement);
    nIcon.appendChild(timeElement);

        const messageElement = document.createElement("div");
        messageElement.id = 'me';
        messageElement.innerText =  message;

        messageCont.appendChild(nIcon);
        messageCont.appendChild(messageElement);

        const contAI = document.createElement('div');
        contAI.appendChild(img);
        contAI.appendChild(messageCont);

        messageList.appendChild(ContAI);

        // Reset the value of textbox to empty
        messageInput.value = '';
    }
});

// Display messages on the UI.
socket.on('load_messages', (messages) => {
    messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.innerText = new Date(message.timestamp).toDateString() + "-" + message.username + ":" + message.message;
        messageList.appendChild(messageElement);
    });
});

socket.on('broadcast_message', (userMessage) => {
    // Create a wrapper for the message
    const messageWrapper = document.createElement('div');
    messageWrapper.style.display = 'flex';
    messageWrapper.style.flexDirection = 'row'; // Align icon and message content side by side
    messageWrapper.style.marginBottom = '8px';
    messageWrapper.style.marginTop = '2px';

    // Add the user's icon
    const iconElement = document.createElement('img');
    iconElement.src = userMessage.icon;
    iconElement.alt = 'User Icon';
    iconElement.style.width = '30px';
    iconElement.style.height = '30px';
    iconElement.style.borderRadius = '50%';
    iconElement.style.marginRight = '10px';

    // Create a container for the message content
    const messageContent = document.createElement('div');
    messageContent.style.flex = '1';
    messageContent.style.backgroundColor = '#ececec';
    messageContent.style.borderRadius = '10px';
    messageContent.style.padding = '5px';
    messageContent.style.width = '80%';
    messageContent.style.height = '40px';

    // Create a header for username and time
    const messageHeader = document.createElement('div');
    messageHeader.style.display = 'flex';
    messageHeader.style.justifyContent = 'space-between'; // Push username and time to opposite ends

    const usernameElement = document.createElement('span');
    usernameElement.style.fontWeight = 'bold';
    usernameElement.style.color = '#333';
    usernameElement.innerText = userMessage.username;

    const timeElement = document.createElement('span');
    timeElement.style.fontSize = '0.8rem';
    timeElement.style.color = '#666';
    timeElement.innerText = userMessage.time;

    // Add the header (username and time)
    messageHeader.appendChild(usernameElement);
    messageHeader.appendChild(timeElement);

    // Add the message text
    const messageText = document.createElement('p');
    messageText.style.marginTop = '5px';
    messageText.innerText = userMessage.message;

    // Append header and message to the message content container
    messageContent.appendChild(messageHeader);
    messageContent.appendChild(messageText);

    // Add the icon and message content to the wrapper
    messageWrapper.appendChild(iconElement);
    messageWrapper.appendChild(messageContent);

    // Add the wrapper to the message list
    messageList.appendChild(messageWrapper);
});



socket.on("all_users", (data) => {
    const container = document.getElementById("two");

    // Clear the container to prevent duplicates
    container.innerHTML = '<div class="perm"><p>Connected Users:</p></div>';

    // Add each user to the container
    data.users.forEach(username => {
        const userElement = document.createElement("div");
        userElement.classList.add("rest");
        userElement.setAttribute("data-username", username);
        userElement.innerText = username;

        container.appendChild(userElement);
    });
});

// Code for displaying/catching name of new user
socket.on("user_joined", (data) => {
    const w = document.createElement("div");
    const g = document.createElement("div");
    g.classList.add('green-dot');
    w.id = 'wel';
    w.innerText = `${data.username} has joined the chat`;
    document.getElementById("top").appendChild(g);
    document.getElementById("top").appendChild(w);

    const topElement = document.getElementById("top");

    // Remove the elements after 5 seconds
    setTimeout(() => {
        topElement.removeChild(g);
        topElement.removeChild(w);
    }, 5000);

    const userElement = document.createElement("div");
    userElement.classList.add("rest");
    userElement.setAttribute("data-username", data.username); // Add a unique attribute for identification
    userElement.innerText = data.username;

    // Append the new user element
    document.getElementById("two").appendChild(userElement);
});

// Remove the user element when they disconnect
socket.on("user_left", (data) => {
    const userElement = document.querySelector(`.rest[data-username="${data.username}"]`);
    if (userElement) {
        userElement.remove();
    }
});



socket.on('update_user_count', (data) => {
    const permElement = document.querySelector('.perm');
    if (permElement) {
        permElement.innerHTML = `<p>Connected Users: ${data.count}</p>`;
    } else {
        console.error("Could not find the '.perm' element.");
    }
    console.log('count  Veer= ' + data.count);
});


socket.on("batman_image", (data) => {

    const img = document.createElement('img');
    img.src = data.url; // Use the absolute URL received from the server
    img.alt = "Batman";
    img.style.width = "30px"; // Resize
    img.style.height = "30px";

    const middleElement = document.getElementById('middle');
    if (middleElement) {
        //middleElement.appendChild(img); // Add image to DOM
    } else {
        console.error("Middle element not found in DOM.");
    }
});

const typingTimeout = 1000; // Time in milliseconds before stopping "is typing"
let typingTimer; // Timer to track typing events

messageInput.addEventListener('input', () => {
    // Emit typing event
    socket.emit('typing', { username });

    // Clear existing timer
    clearTimeout(typingTimer);

    // Set a timer to emit stop_typing event
    typingTimer = setTimeout(() => {
        socket.emit('stop_typing');
    }, typingTimeout);
});

// Listen for typing events from others
socket.on('show_typing', (data) => {
    const topElement = document.getElementById("top");
    let typingIndicator = document.getElementById('typing-indicator');

    if (!typingIndicator) {
        // Create typing indicator if it doesn't exist
        typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.style.color = '#888';
        typingIndicator.style.marginLeft = '10px';
        typingIndicator.innerText = `${data.username} is writing...`;
        topElement.appendChild(typingIndicator);
    }
});

// Listen for stop typing events
socket.on('hide_typing', (data) => {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove(); // Remove typing indicator
    }
});





