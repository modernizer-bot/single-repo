const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

let allChat = [];

const INTERVAL = 3000;

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  // @ts-ignore
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  // @ts-ignore
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  return fetch("/poll", {
    method: "post",
    body: JSON.stringify({ text, user }),
    headers: { "Content-Type": "application/json" },
  });
}

async function getNewMsgs() {
  let json;
  try {
    const res = await fetch("/poll");
    json = await res.json();
    if (res.status >= 400) {
      throw new Error("request did not succeed:" + res.status);
    }
    allChat = json.msg;
    render();
    failedTries = 0;
  } catch (e) {
    console.log(`polling error: ${e}`);
    failedTries++;
  }
}

function render() {
  const html = allChat.map(({ user, text, time, id }) =>
    // @ts-ignore
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

const BACKOFF = 5000;
let timeToMakeNextRequest = 0;
let failedTries = 0;
async function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL + (failedTries ** 2) * BACKOFF;
  }

  requestAnimationFrame(rafTimer);
}

requestAnimationFrame(rafTimer);
