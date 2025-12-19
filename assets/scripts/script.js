function array() {
    const input = document.getElementById("user_input_one").value;
    const positionRaw = document.getElementById("user_input_two").value;
    const replacementRaw = document.getElementById("user_input_three").value;
    const errorMsg = document.getElementById("error_msg");

    errorMsg.classList.add("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");

    if (input.trim().length === 0) {
        showError("Please enter a sentence");
        return;
    }

    let sentence = input.trim();

    if (sentence.startsWith(",") || sentence.endsWith(",")) {
        showError("Special Character(s) not allowed");
        return;
    }

    if (hasSpecialChar(sentence)) {
        showError("Special Character(s) not allowed");
        return;
    }

    let normalized = "";
    let prevComma = false;

    for (let ch of sentence) {
        if (ch === "," || ch === " ") {
            if (!prevComma) {
                normalized += ",";
                prevComma = true;
            }
        } else {
            normalized += ch;
            prevComma = false;
        }
    }

    let words = normalized.split(",").filter(w => w !== "");

    if (words.length === 1) {
        showError("Enter more than one word");
        return;
    }

    let hasLetter = false;
    let hasNumber = false;

    for (let word of words) {
        for (let ch of word) {
            if (ch >= "0" && ch <= "9") hasNumber = true;
            if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) hasLetter = true;
        }
    }

    if ((hasLetter && hasNumber)) {
        showError("Invalid input");
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

    errorMsg.innerText = `Updated sentence: ${words.join(",")}`;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-danger", "alert-success");
}


function hasSpecialChar(text) {
    for (let ch of text) {
        const code = ch.charCodeAt(0);
        if (
            !(code >= 65 && code <= 90) &&   
            !(code >= 97 && code <= 122) &&  
            !(code >= 48 && code <= 57) &&   
            ch !== "," &&
            ch !== " "
        ) {
            return true;
        }
    }
    return false;
}

function showError(message) {
    const errorMsg = document.getElementById("error_msg");
    errorMsg.innerText = message;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");
}

function resetForm() {
    document.getElementById("user_input_one").value = "";
    document.getElementById("user_input_two").value = "";
    document.getElementById("user_input_three").value = "";
    document.getElementById("error_msg").classList.add("d-none");
}
