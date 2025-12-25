function commonValidation(sentence, words) {
    if (sentence.startsWith(",") || sentence.endsWith(",")) {
        showError("Special Character(s) not allowed");
        return false;
    }

    for (let ch of sentence) {
        const isLetter = (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z");
        const isDigit = (ch >= "0" && ch <= "9");
        const allowed = ch === "," || ch === " " || ch === "+" || ch === "-";
        if (!isLetter && !isDigit && !allowed) {
            showError("Special characters not allowed");
            return false;
        }
    }

    if (words.length === 1) {
        showError("Enter more than one word");
        return false;
    }

    const hasLetter = /[a-zA-Z]/.test(sentence);
    const hasNumber = /[0-9]/.test(sentence);
    if (hasLetter && hasNumber) {
        showError("Invalid input");
        return false;
    }

    for (let part of words) {
        let plusCount = 0, minusCount = 0;
        for (let i = 0; i < part.length; i++) {
            const ch = part[i];
            if (ch === "+") plusCount++;
            else if (ch === "-") minusCount++;
            if ((ch === "+" || ch === "-") && i !== 0) {
                showError("Invalid input");
                return false;
            }
        }
        if (plusCount > 1 || minusCount > 1 || (plusCount >= 1 && minusCount >= 1)) {
            showError("Special characters not allowed");
            return false;
        }
        if (part.length > 1 && (part[0] === "+" || part[0] === "-")) {
            const rest = part.slice(1);
            if (!/^\d+$/.test(rest)) {
                showError("Invalid input");
                return false;
            }
        }
    }

    return true;
}

function validateInput1(inputRaw) {
    if (inputRaw.trim().length === 0) {
        showError("Please enter a sentence");
        return null;
    }

    const sentence = inputRaw.trim();
    const normalized = sentence.replace(/[,\s]+/g, ",");
    const words = normalized.split(",").filter(w => w !== "");

    if (!commonValidation(sentence, words)) return null;

    return { sentence, words };
}

function validateInput2(positionRaw, words) {
    const posTrim = positionRaw.trim();

    if (posTrim.length === 0) {
        showError("Please enter the position");
        return null;
    }
    if (/^-/.test(posTrim)) {
        showError("In position Negative numbers not allowed");
        return null;
    }
    if (!/^\+?\d+$/.test(posTrim)) {
        showError("Special characters not allowed");
        return null;
    }

    const position = parseInt(posTrim, 10);
    if (position === 0) {
        showError("Please enter a valid position");
        return null;
    }
    if (position > words.length) {
        showError(`Enter position between 1 to ${words.length}`);
        return null;
    }

    return position;
}

function validateInput3(replacementRaw, sentence) {
    if (replacementRaw.trim().length === 0) {
        showError("Please enter the replacement word");
        return null;
    }

    const replacement = replacementRaw.trim();

    for (let ch of replacement) {
        const isLetter = (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z");
        const isDigit = (ch >= "0" && ch <= "9");
        const allowed = ch === "," || ch === " " || ch === "+" || ch === "-";
        if (!isLetter && !isDigit && !allowed) {
            showError("Special characters not allowed");
            return null;
        }
    }

    let plusCount = [...replacement].filter(ch => ch === "+").length;
    let minusCount = [...replacement].filter(ch => ch === "-").length;
    if (plusCount > 1 || minusCount > 1 || (plusCount >= 1 && minusCount >= 1)) {
        showError("Special characters not allowed");
        return null;
    }
    if ((/[a-zA-Z]/.test(sentence) && /[0-9]/.test(replacement)) ||
        (/[a-zA-Z]/.test(replacement) && /[0-9]/.test(sentence))) {
        showError("Invalid replacement input");
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

    const input1 = validateInput1(inputRaw);
    if (!input1) return;

    const position = validateInput2(positionRaw, input1.words);
    if (!position) return;

    const replacement = validateInput3(replacementRaw, input1.sentence);
    if (!replacement) return;

    input1.words.splice(position - 1, 1, replacement);

    errorMsg.innerText = `Updated sentence: ${input1.words.join(",")}`;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-danger", "alert-success");
}

function showError(message) {
    const errorMsg = document.getElementById("error_msg");
    errorMsg.innerText = message;
    errorMsg.classList.remove("d-none");
    errorMsg.classList.replace("alert-success", "alert-danger");
}
