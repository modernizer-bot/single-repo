const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");
let allChat = [];

// listen for events on the form
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const msg = JSON.stringify({ user, text, time: Date.now() });
  ws.send(msg);
}
const ws = new WebSocket("ws://localhost:8080/", ["json"]);

ws.addEventListener("open", () => {
  console.log("connected ws");
  presence.innerHTML = "🟢";
});

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  allChat = data.msg;
  presence.innerHTML = "🟢";
  render();
});

ws.addEventListener("error", (e) => {
  console.log("error ws");
  presence.innerHTML = "🔴";
});

ws.addEventListener("close", () => {
  console.log("close ws");
  presence.innerHTML = "🔴";
});

function render() {
  const html = allChat.map(({ user, text }) => template(user, text));
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;
