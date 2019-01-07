if (BROWSER == "CHROME") {
  console.info("hello, world!(CHROME)");
}
if (BROWSER == "FIREFOX") {
  console.info("hello, world!(FIREFOX)");
}

//import atcursor from "../lib/atcursor";

// if (window !== window.parent) {
//   document.body.addEventListener("mousemove", ev => {
//     const textAtCursor = atcursor(ev.target, ev.clientX, ev.clientY, 8);

//     if (textAtCursor) {
//       chrome.runtime.sendMessage({ text: textAtCursor });
//     }
//   });
// }


if (window !== window.parent) {
  const extensionId = "konjoaojaikeomiamkphdchgfalibjhb";
  var port = chrome.runtime.connect(extensionId);

  document.body.addEventListener("mousemove", ev => {
  //  const textAtCursor = atcursor(ev.target, ev.clientX, ev.clientY, 8);
  const textAtCursor = "test";
  console.info(textAtCursor)
  if (textAtCursor) {
    port.postMessage(textAtCursor);
    }
  });
}
