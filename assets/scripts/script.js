function array() {
    const input = document.getElementById("user_input_one").value;
    const positionRaw = document.getElementById("user_input_two").value;
    const replacementRaw = document.getElementById("user_input_three").value;
    const errorMsg = document.getElementById("error_msg");

    errorMsg.classList.add("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");

    let sentence = input.trim();
    const normalized = has_commas(sentence);
    
    const after_trim = positionRaw.trim();

    let words = normalized.split(",").filter(w => w !== "");
    
    const position = parseInt(after_trim, 10); 
    
    const replacement = replacementRaw.trim();

    if (input.trim().length === 0) {
        showError("Please enter a sentence");
        return;
    } else if (sentence.startsWith(","|| "-") || sentence.endsWith("," || "-") || has_special_char(sentence) || invalid_sign(sentence) || invalid_sign(words) || !/^\+?\d+$/.test(after_trim) || has_special_char(replacement) || invalid_sign(replacement)) {
        showError("Special Character(s) not allowed");
        return;
    } else if (words.length === 1) {
        showError("Enter more than one word");
        return;
    } else if ((has_letter(sentence) && has_number(sentence)) || position_sign(words)) {
        showError("Invalid input");
        return;
    } else if (after_trim.length === 0) {
        showError("Please enter the position");
        return;
    } else if (/^-/.test(after_trim)) {
        showError("In position Negative numbers not allowed");
        return;
    } else if (position === 0) {
        showError("Please enter a valid position");
        return;
    } else if (position > words.length) {
        showError(`Enter position between 1 to ${words.length}`);
        return;
    } else if (replacementRaw.trim().length === 0) {
        showError("Please enter the replacement word");
        return;
    } else if ((has_letter(sentence) && has_number(replacement)) || (has_letter(replacement) && has_number(sentence)) || position_sign(replacement)) {
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
    .replace(/[,\s]+/g, ",");
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

function invalid_sign(words) {
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

function position_sign(words) {
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