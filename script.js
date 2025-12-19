function processArray() {
    const sentenceRaw = document.getElementById("user-input-one").value;
    const positionRaw = document.getElementById("user-input-two").value;
    const replacementRaw = document.getElementById("user-input-three").value;
    const errorMsg = document.getElementById("error-msg");

    errorMsg.classList.add("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");

    if (sentenceRaw.trim().length === 0) {
        showError("Please enter a sentence");
        return;
    }

    const sentence = sentenceRaw.trim();

    if (sentence.endsWith(",")) {
        showError("Invalid input");
        return;
    }
    if (hasSpecialChar(sentence)) {
        showError("Special Character(s) not allowed");
        return;
    }

    const words = sentence.split(" ").filter(w => w !== "");

    if (words.length === 1) {
        showError("Enter more than one word");
        return;
    }

    if (positionRaw.trim().length === 0) {
        showError("Please enter the position");
        return;
    }

    for (let ch of positionRaw.trim()) {
        if (ch < "0" || ch > "9") {
            showError("positive number only allowed");
            return;
        }
    }

    const position = Number(positionRaw);

    if (position < 0) {
        showError("positive number only allowed");
        return;
    }

    if (position === 0) {
        showError("please enter valid position");
        return;
    }

    if (position > words.length) {
        showError(`Enter position between 1 to ${words.length}`);
        return;
    }

    if (replacementRaw.trim().length === 0) {
        showError("Please enter the replacement word");
        return;
    }

    const replacement = replacementRaw.trim();

    if (hasSpecialChar(replacement)) {
        showError("Special Character(s) not allowed");
        return;
    }

    words.splice(position - 1, 1, replacement);

    errorMsg.innerText = `Updated sentence: ${words.join(" ")}`;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-danger", "alert-success");
}

function hasSpecialChar(text) {
    for (let ch of text) {
        const code = ch.charCodeAt(0);

        // allow A-Z, a-z and space
        if (
            !((code >= 65 && code <= 90) ||
              (code >= 97 && code <= 122) ||
              ch === " ")
        ) {
            return true;
        }
    }
    return false;
}

function showError(message) {
    const errorMsg = document.getElementById("error-msg");
    errorMsg.innerText = message;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");
}

function resetForm() {
    document.getElementById("user-input-one").value = "";
    document.getElementById("user-input-two").value = "";
    document.getElementById("user-input-three").value = "";
    document.getElementById("error-msg").classList.add("d-none");
}
