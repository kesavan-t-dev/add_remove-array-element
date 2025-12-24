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

    if (has_special_char(sentence)) {
    showError("Special characters not allowed");
    return;
    }

    const normalized = has_commas(sentence);
    let words = normalized.split(",").filter(w => w !== "");

    if (words.length === 1) {
    showError("Enter more than one word");
    return;
    }

    if (has_letter(sentence) && has_number(sentence)) {
    showError("Invalid input");
    return;
    }

    if (hasInvalidSignAsSpecial(words)) {
    showError("Special characters not allowed");
    return;
    }

    if (sign_invalid(words)) {
    showError("Invalid input");
    return;
    }

    const posTrim = positionRaw.trim();

    if (posTrim.length === 0) {
    showError("Please enter the position");
    return;
    }

    if (/^-/.test(posTrim)) {
    showError("In position Negative numbers not allowed");
    return;
    }

    if (!/^\+?\d+$/.test(posTrim)) {
    showError("Special characters not allowed");
    return;
    }
    const position = parseInt(posTrim, 10); 

    if (position === 0) {
    showError("Please enter a valid position");
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

    if (has_special_char(replacement)) {
    showError("Special characters not allowed");
    return;
    }

    if (hasInvalidSignAsSpecial([replacement])) {
    showError("Special characters not allowed");
    return;
    }

    if (sign_invalid([replacement])) {
    showError("Invalid replacement input");
    return;
    }

    if ((has_letter(sentence) && has_number(replacement)) || (has_letter(replacement) && has_number(sentence))) {
    showError("Invalid replacement input");
    return;
    }

    words.splice(position - 1, 1, replacement);

    errorMsg.innerText = `Updated sentence: ${words.join(",")}`;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-danger", "alert-success");
}

function has_commas(text) {
    return text
    .replace(/[,\s]+/g, ",") 
    .replace(/^,|,$/g, "");  
}

function has_special_char(text) {
    for (let ch of text) {
    const isLetter = (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z");
    const isDigit = (ch >= "0" && ch <= "9");
    const special_char = ch === "," || ch === " " || ch === "+" || ch === "-";
    if (!isLetter && !isDigit && !special_char) return true;
    }
    return false;
}

function has_number(text) {
    for (let ch of text) {
    if (ch >= "0" && ch <= "9") return true;
    }
    return false;
}

function has_letter(text) {
    for (let ch of text) {
    if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) return true;
    }
    return false;
}

function hasInvalidSignAsSpecial(words) {
    for (let part of words) {
    let plusCount = 0, minusCount = 0;
    for (let i = 0; i < part.length; i++) {
        const ch = part[i];
        if (ch === "+") plusCount++;
        else if (ch === "-") minusCount++;
    }
    if (plusCount > 1 || minusCount > 1) return true;
    if (plusCount >= 1 && minusCount >= 1) return true;
    }
    return false;
}

function sign_invalid(words) {
    for (let part of words) {
    for (let i = 0; i < part.length; i++) {
        const ch = part[i];
        if ((ch === "+" || ch === "-") && i !== 0) {
        return true; 
        }
    }
    if (part.length > 1 && (part[0] === "+" || part[0] === "-")) {
        const rest = part.slice(1);
        for (let ch of rest) {
        if (!(ch >= "0" && ch <= "9")) return true; 
        }
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
    const errorMsg = document.getElementById("error_msg");
    errorMsg.classList.add("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");
    errorMsg.innerText = "";
}