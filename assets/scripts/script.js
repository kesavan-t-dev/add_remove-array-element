
function common_validation(sentence, position, replacement, err_msg) {
    if (!sentence) {
        err_msg.innerText = "Please enter a sentence";
        return null;
    } else if (
        /[^a-zA-Z0-9.,\s+\-]/.test(sentence) ||
        /[^a-zA-Z0-9\s+\-.]/.test(position) ||
        /[^a-zA-Z0-9\s+\-.]/.test(replacement)
    ) {
        err_msg.innerText = "Special character(s) not allowed";
        return null;
    } else if (!position) {
        err_msg.innerText = "Please enter a position";
        return null;
    } else if (!replacement) {
        err_msg.innerText = "Please enter the replacement word";
        return null;
    }
    return { sentence, position, replacement };
}

function input_1(sentence, words, err_msg) {
    sentence = sentence.toString();
    {
        let out = '', prev = false;
        for (let i = 0, n = sentence.length; i < n; i++) {
            const ch = sentence[i], is_sep = (ch === ',') || ch === ' ';
            if (is_sep) { 
                if (!prev) { 
                    out += ','; 
                    prev = true; 
                } 
            }
            else { 
                out += ch; 
                prev = false; 
            }
        }
        sentence = out;
    }

    if (sentence.length === 0 || sentence === ',') {
        err_msg.innerText = 'Please enter a valid sentence'; return false;
    }

    words = sentence.split(',').filter(p => p.length > 0);

    if (words.length < 2 || sentence.length === 1) {
        err_msg.innerText = 'Please enter more than one word'; 
        return false;
    } else if (sentence[0] === ',' || sentence[sentence.length - 1] === ',') {
        err_msg.innerText = 'Special character(s) not allowed'; 
        return false;
    }

    let has_alpha = false, has_numeric = false;

    for (let idx = 0; idx < words.length; idx++) {
        const part = words[idx];
        let start = 0, dotCount = 0, hasL = false, hasD = false;

        if (part.length > 0 && (part[0] === '+' || part[0] === '-')) {
            start = 1;
            if (part.length === 1) { 
                err_msg.innerText = 'Special character(s) not allowed'; 
                return false; 
            }
        }
        for (let i = 1, n = part.length; i < n; i++) {
            const c = part[i];
            if (c === '+' || c === '-') { 
                err_msg.innerText = 'Special character(s) not allowed'; 
                return false; 
            }
        }

        for (let i = 0, n = part.length; i < n; i++) {
            const ch = part[i], code = ch.charCodeAt(0);
            const isL = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
            const isD = (code >= 48 && code <= 57);

            if (isL) { 
                hasL = true; 
                continue; 
            }
            if (isD) { 
                hasD = true; 
                continue; 
            }

            if (ch === '.') {
                dotCount++;
                if (dotCount > 1) { 
                    err_msg.innerText = 'Special character(s) not allowed'; 
                    return false; 
                }
                const b = i - 1, a = i + 1;
                if (b < start || a >= n) { 
                    err_msg.innerText = 'Special character(s) not allowed'; 
                    return false; 
                }
                const bc = part[b].charCodeAt(0), ac = part[a].charCodeAt(0);
                if (!(bc >= 48 && bc <= 57) || !(ac >= 48 && ac <= 57)) { 
                    err_msg.innerText = 'Special character(s) not allowed'; 
                    return false; 
                }
                hasD = true; continue;
            }

            err_msg.innerText = 'Special character(s) not allowed'; return false;
        }

        if (hasL && hasD) { 
            err_msg.innerText = 'Invalid input type'; 
            return false; 
        }
        if (hasL && (start === 1 || dotCount > 0)) { 
            err_msg.innerText = 'Special character(s) not allowed'; 
            return false; 
        }

        if (hasL && !hasD) has_alpha = true;
        if (!hasL && hasD) has_numeric = true;
    }

    if (has_alpha && has_numeric) { 
        err_msg.innerText = 'Invalid input type'; 
        return false; 
    }
    return { sentence, words };
}

function input_2(positionRaw, words, err_msg) {
    if (positionRaw == null) { 
        err_msg.innerText = "Please enter a position"; 
        return null; 
    }
    let posTrim = positionRaw.toString().trim();
    if (posTrim.length === 0) { 
        err_msg.innerText = "Please enter a position"; 
        return null; 
    }

    let startIndex = 0; const first = posTrim[0];

    if (first === '+') {
        startIndex = 1;
        if (posTrim.length === 1) { 
            err_msg.innerText = "Please enter a valid position"; 
            return null; 
        }
        if (posTrim.length > 1 && (posTrim[1] === '+' || posTrim[1] === '-' || posTrim[1] === '.')) {
            err_msg.innerText = "Special character(s) not allowed"; return null;
        }
    } else if (first === '-') {
        if (posTrim.length === 1) { 
            err_msg.innerText = "Negative numbers not allowed"; 
            return null; 
        }
        let restAllDigits = true;
        for (let i = 1, n = posTrim.length; i < n; i++) {
            const code = posTrim[i].charCodeAt(0);
            if (!(code >= 48 && code <= 57)) { 
                restAllDigits = false; 
                break; 
            }
        }
        err_msg.innerText = restAllDigits ? "Negative numbers not allowed" : "Special character(s) not allowed";
        return null;
    } else {
        const code = first.charCodeAt(0);
        const isDigit = (code >= 48 && code <= 57);
        const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        if (isLetter) { 
            err_msg.innerText = "In position letter(s) not allowed"; 
            return null; 
        }
        if (!isDigit) { 
            err_msg.innerText = first === '.' ? "Special character(s) not allowed" : "Invalid position"; 
            return null; 
        }
    }

    for (let i = startIndex, n = posTrim.length; i < n; i++) {
        const ch = posTrim[i], code = ch.charCodeAt(0);
        if (code >= 48 && code <= 57) continue;
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) { err_msg.innerText = "In position letter(s) not allowed"; return null; }
        if (ch === '.' || ch === '+' || ch === '-' || ch === ',') { err_msg.innerText = "Special character(s) not allowed"; return null; }
        err_msg.innerText = "Invalid position"; return null;
    }

    const position = parseInt(posTrim, 10);
    if (position === 0) { err_msg.innerText = "Please enter a valid position"; return null; }
    if (position < 1 || position > words.length) { err_msg.innerText = `Enter position between 1 to ${words.length}`; return null; }
    return { position };
}

function input_3(replacementRaw, sentence, err_msg) {
    const replacement = replacementRaw.trim();
    if (replacement.length === 0) { err_msg.innerText = "Please enter a replacement"; return null; }

    let startIndex = 0, dotCount = 0;
    const first = replacement[0];
    if (first === '+' || first === '-') {
        startIndex = 1;
        if (replacement.length === 1) { err_msg.innerText = "Please enter a valid replacement"; return null; }
    }

    for (let i = 0, n = replacement.length; i < n; i++) {
        const ch = replacement[i], code = ch.charCodeAt(0);
        const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        const isDigit  = (code >= 48 && code <= 57);

        if (ch === ',') { err_msg.innerText = "Special character(s) not allowed"; return null; }
        if (ch === '.') { dotCount++; if (dotCount > 1) { err_msg.innerText = "Special character(s) not allowed"; return null; } continue; }
        if (i > 0 && (ch === '+' || ch === '-')) { err_msg.innerText = "Special character(s) not allowed"; return null; }
        if (!isLetter && !isDigit && ch !== '+' && ch !== '-') { err_msg.innerText = "Special character(s) not allowed"; return null; }
    }

    let sentence_has_letter = false, sentence_has_digit = false;
    for (let i = 0, n = sentence.length; i < n; i++) {
        const code = sentence[i].charCodeAt(0);
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) sentence_has_letter = true;
        else if (code >= 48 && code <= 57) sentence_has_digit = true;
    }

    let replacement_has_letter = false, replacement_has_digit = false;
    for (let i = startIndex, n = replacement.length; i < n; i++) {
        const ch = replacement[i], code = ch.charCodeAt(0);
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) replacement_has_letter = true;
        else if ((code >= 48 && code <= 57) || ch === '.') replacement_has_digit = true;
    }

    if ((sentence_has_letter && replacement_has_digit) || (sentence_has_digit && replacement_has_letter)) {
        err_msg.innerText = "Invalid replacement input"; return null;
    }
    return replacement;
}

function array() {
    const inputRaw = document.getElementById("user_input_one").value.trim();
    const positionRaw = document.getElementById("user_input_two").value.trim();
    const replacementRaw = document.getElementById("user_input_three").value.trim();
    const err_msg = document.getElementById("error_msg");

    err_msg.classList.add("d-none");
    err_msg.classList.replace("alert-success", "alert-danger");

    const commonResult = common_validation(inputRaw, positionRaw, replacementRaw, err_msg);
    if (!commonResult) { err_msg.classList.remove("d-none"); return; }

    let sentence = inputRaw.trim();
    let words = sentence.split(",").filter(w => w);

    const input1Result = input_1(sentence, words, err_msg);
    if (!input1Result) { err_msg.classList.remove("d-none"); return; }
    sentence = input1Result.sentence;
    words = input1Result.words;

    const positionResult = input_2(positionRaw, words, err_msg);
    if (!positionResult) { err_msg.classList.remove("d-none"); return; }
    const { position } = positionResult;

    const replacement = input_3(replacementRaw, sentence, err_msg);
    if (replacement === null) { err_msg.classList.remove("d-none"); return; }

    words.splice(position - 1, 1, replacement);
    err_msg.innerText = `Updated sentence: ${words.join(",")}`;
    err_msg.classList.remove("d-none");
    err_msg.classList.replace("alert-danger", "alert-success");
}

function resetForm() {
    document.getElementById("user_input_one").value = "";
    document.getElementById("user_input_two").value = "";
    document.getElementById("user_input_three").value = "";
    const err_msg = document.getElementById("error_msg");
    err_msg.classList.add("d-none");
    err_msg.classList.replace("alert-success", "alert-danger");
    err_msg.innerText = "";
}
