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
/*******

function common_validation(sentence, words, errorMsg) {
    sentence = sentence.replace(/[,\s]+/g, ",").replace(/\.{2,}/g, ".");
    words = sentence.split(",").filter(w => w);

    if (!sentence) {
        errorMsg.innerText = "Please enter a sentence";
        return false;
    } else if (/[^a-zA-Z0-9.,\s+-]/.test(sentence)) {
        errorMsg.innerText = "Special character(s) not allowed";
        return false;
    } else if (/[a-zA-Z]/.test(sentence) && /\d/.test(sentence)) {
        errorMsg.innerText = "Invalid input";
        return false;
    }
    for (let part of words) {
        if (/.*[+-].*[+-]/.test(part)) {
            errorMsg.innerText = "Invalid input";
            return false;
        } else if (/\.\..*/.test(part)) {
            errorMsg.innerText = "Invalid input";
            return false;
        }
    }
    return { sentence, words };
}

function validate_input1(sentence, words, errorMsg) {
    sentence = sentence.replace(/[,\s]+/g, ",").replace(/\.{2,}/g, ".");
    words = sentence.split(",").filter(w => w);

    if (/^,|,$/.test(sentence)) {
        errorMsg.innerText = "Special character(s) not allowed";
        return false;
    }
    for (let part of words) {
        if (/^\d+(\.\d+)?$/.test(part) || /^[+-]\d+(\.\d+)?$/.test(part) || /^[a-zA-Z]+$/.test(part)) {
            continue;
        } else if (/^[+-]$/.test(part) || /^[+-][^0-9]/.test(part)) {
            errorMsg.innerText = "Invalid input";
            return false;
        } else if (/^\d+[+-]$/.test(part)) {
            errorMsg.innerText = "Invalid input";
            return false;
        } else if (/^\d+[+-]\d+$/.test(part)) {
            errorMsg.innerText = "Invalid input";
            return false;
        } else if (/\.\..*/.test(part)) {
            errorMsg.innerText = "Invalid input";
            return false;
        }
        errorMsg.innerText = "Invalid input";
        return false;
    }
    return true;
}

function validate_input2(positionRaw, words, errorMsg) {
    const posTrim = positionRaw.trim().replace(/[,\s]+/g, ",").replace(/\.{2,}/g, ".");
    if (!posTrim) {
        errorMsg.innerText = "Please enter the position";
        return null;
    } else if (/^-/.test(posTrim)) {
        errorMsg.innerText = "Negative numbers not allowed";
        return null;
    } else if (!/^\+?\d+$/.test(posTrim)) {
        errorMsg.innerText = "In position numbers only allowed";
        return null;
    }
    const position = parseInt(posTrim, 10);
    if (position === 0) {
        errorMsg.innerText = "Please enter a valid position";
        return null;
    } else if (position > words.length) {
        errorMsg.innerText = `Enter position between 1 to ${words.length}`;
        return null;
    }
    return position;
}

function validate_input3(replacementRaw, sentence, errorMsg) {
    const replacement = replacementRaw.trim().replace(/[,\s]+/g, ",").replace(/\.{2,}/g, ".");
    const sentenceHasLetters = /[a-zA-Z]/.test(sentence);
    const sentenceHasNumbers = /\d/.test(sentence);
    const replacementHasLetters = /[a-zA-Z]/.test(replacement);
    const replacementHasNumbers = /\d/.test(replacement);
    
    if (!replacement) {
        errorMsg.innerText = "Please enter the replacement word";
        return null;
    } else if (/[^a-zA-Z0-9\s+-.]/.test(replacement)) {
        errorMsg.innerText = "Special character(s) not allowed";
        return null;
    } else if (/.*[+-].*[+-]/.test(replacement)) {
        errorMsg.innerText = "Invalid replacement input";
        return null;
    } else if (/\.\..*/.test(replacement)) {
        errorMsg.innerText = "Invalid replacement input";
        return null;
    } else if ((sentenceHasLetters && replacementHasNumbers) ||
        (sentenceHasNumbers && replacementHasLetters)) {
        errorMsg.innerText = "Invalid replacement input";
        return null;
    }

    return replacement;
}

function array() {
    const inputRaw = document.getElementById("user_input_one").value;
    const positionRaw = document.getElementById("user_input_two").value;
    const replacementRaw = document.getElementById("user_input_three").value;
    const errorMsg = document.getElementById("error_msg");

    errorMsg.classList.add("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");

    let sentence = inputRaw.trim();
    let words = sentence.split(",").filter(w => w);

    const commonResult = common_validation(sentence, words, errorMsg);
    if (!commonResult) { errorMsg.classList.remove("d-none"); return; }
    sentence = commonResult.sentence;
    words = commonResult.words;

    if (!validate_input1(sentence, words, errorMsg)) { errorMsg.classList.remove("d-none"); return; }

    const position = validate_input2(positionRaw, words, errorMsg);
    if (!position) { errorMsg.classList.remove("d-none"); return; }

    const replacement = validate_input3(replacementRaw, sentence, errorMsg);
    if (!replacement) { errorMsg.classList.remove("d-none"); return; }

    words.splice(position - 1, 1, replacement);
    errorMsg.innerText = `Updated sentence: ${words.join(",")}`;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-danger", "alert-success");
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
*********/
