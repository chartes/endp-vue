export const popupError = function showError(obj) {
    console.log(obj);
    let {message, classElement} = obj;
    let element = document.createElement("div");
    console.log(element);
    element.innerHTML = message;
    element.style.cssText = "position: relative; top: 20%; left: 50%; transform: translate(-50%, -50%); background-color: #f8d7da; color: #721c24; padding: 1rem; border: 1px solid #f5c6cb; border-radius: 5px; z-index: 1000";
    document.querySelector(classElement).appendChild(element);
    setTimeout(() => {
        element.remove();

    }, 3000);
}