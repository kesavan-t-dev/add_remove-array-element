function common_validation(sentence, position, replacement, err_msg) {
    if (!sentence) {
        err_msg.innerText = "Please enter a sentence";
        return null;
    } else if (/[^a-zA-Z0-9.,\s+-]/.test(sentence) || /[^a-zA-Z0-9\s+-.]/.test(position) || /[^a-zA-Z0-9\s+-.]/.test(replacement)) {
        err_msg.innerText = "Special character(s) not allowed";
        return null;
    } else if (!position) {
        err_msg.innerText = "Please enter a position";
        return null;
    } else if (!replacement){
        err_msg.innerText = "Please enter the replacement word";
        return null;
    }
    return { sentence, position, replacement };
}

function input_1(sentence, words, err_msg) {
    sentence = sentence.toString();

    {
        let out = '';
        let prev = false;
        for (let i = 0, n = sentence.length; i < n; i++) {
            const ch = sentence[i];
            const is_sep = (ch === ',') || ch === ' ';
            if (is_sep) {
                if (!prev) {
                    out += ',';
                    prev = true;
                }
            } else {
                out += ch;
                prev = false;
            }
        }
        sentence = out;
    }

    if (sentence.length === 0 || sentence === ',') {
        err_msg.innerText = 'Please enter a valid sentence';
        return false;
    }

    words = sentence.split(',').filter(part => part.length > 0);

    if (words.length < 2 || sentence.length === 1) {
        err_msg.innerText = 'Please enter more than one word';
        return false;
    } else if (sentence[0] === ',' || sentence[sentence.length - 1] === ',') {
        err_msg.innerText = 'Special character(s) not allowed';
        return false;
    }

    for (let idx = 0; idx < words.length; idx++) {
        const part = words[idx];

        for (let i = 0, n = part.length; i < n; i++) {
            if (part[i] === '.') {
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

        {
            let start = 0;
            if (part.length > 0 && (part[0] === '+' || part[0] === '-')) start = 1;

            for (let i = start, n = part.length; i < n; i++) {
                const ch = part[i];
                const code = ch.charCodeAt(0);
                const is_letter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
                const is_digit  = (code >= 48 && code <= 57);
                if (!is_letter && !is_digit) {
                    err_msg.innerText = 'Special character(s) not allowed';
                    return false;
                }
            }
        }

        {
            let hasL = false;
            let hasD = false;
            let start = 0;
            if (part.length > 0 && (part[0] === '+' || part[0] === '-')) start = 1;
            for (let i = start, n = part.length; i < n; i++) {
                const code = part[i].charCodeAt(0);
                const is_letter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
                const is_digit  = (code >= 48 && code <= 57);
                if (is_letter) hasL = true;
                else if (is_digit) hasD = true;
            }
            if (hasL && hasD) {
                err_msg.innerText = 'Invalid input type';
                return false;
            }
        }
    }

    let has_alpha = false;
    let has_numeric = false;

    for (let w = 0; w < words.length; w++) {
        const part = words[w];
        {
            let all_letters = part.length > 0;
            for (let i = 0, n = part.length; i < n; i++) {
                const code = part[i].charCodeAt(0);
                const is_letter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
                if (!is_letter) { all_letters = false; break; }
            }
            if (all_letters) has_alpha = true;
        }
        {
            let is_signed_int = part.length > 0;
            let start = 0;
            if (is_signed_int && (part[0] === '+' || part[0] === '-')) {
                if (part.length === 1) is_signed_int = false;
                else start = 1;
            }
            if (is_signed_int) {
                for (let i = start, n = part.length; i < n; i++) {
                    const code = part[i].charCodeAt(0);
                    const is_digit = (code >= 48 && code <= 57);
                    if (!is_digit) { is_signed_int = false; break; }
                }
            }
            if (is_signed_int) has_numeric = true;
        }
    }

    if (has_alpha && has_numeric) {
        err_msg.innerText = 'Invalid input type';
        return false;
    }

    return { sentence, words };
}

function input_2(position_raw, words, err_msg) {
    
    if (position_raw == null) {
        err_msg.innerText = "Please enter a position";
        return null;
    }
    let pos_trim = position_raw.toString().trim();
    if (pos_trim.length === 0) {
        err_msg.innerText = "Please enter a position";
        return null;
    }

    let start_index = 0;
    const first = pos_trim[0];

    if (first === '+') {
        start_index = 1;
        if (pos_trim.length === 1) {
            err_msg.innerText = "Please enter a valid position";
            return null;
        } else if (pos_trim.length > 1 && (pos_trim[1] === '+' || pos_trim[1] === '-' || pos_trim[1] === '.')) {
            err_msg.innerText = "Special character(s) not allowed";
            return null;
        }
    } else if (first === '-') {
        if (pos_trim.length === 1) {
            err_msg.innerText = "Negative numbers not allowed";
            return null;
        }
        let reset_all_digits = true;
        for (let i = 1, n = pos_trim.length; i < n; i++) {
            const code = pos_trim[i].charCodeAt(0);
            const is_digit = (code >= 48 && code <= 57);
            if (!is_digit) { reset_all_digits = false; break; }
        }
        if (reset_all_digits) {
            err_msg.innerText = "Negative numbers not allowed";
            return null;
        } else {
            err_msg.innerText = "Special character(s) not allowed";
            return null;
        }
    } else {
        const code = first.charCodeAt(0);
        const is_digit = (code >= 48 && code <= 57);
        const is_letter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        if (is_letter) {
            err_msg.innerText = "In position letter(s) not allowed";
            return null;
        }else if (!is_digit) {
            if (first === '.') {
                err_msg.innerText = "Special character(s) not allowed";
            } else {
                err_msg.innerText = "Invalid position";
            }
            return null;
        }
    }

    for (let i = start_index, n = pos_trim.length; i < n; i++) {
        const ch = pos_trim[i];
        const code = ch.charCodeAt(0);
        const is_digit = (code >= 48 && code <= 57);
        const is_letter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        if (is_digit) continue;
        if (is_letter) {
            err_msg.innerText = "In position letter(s) not allowed";
            return null;
        } else if (ch === '.' || ch === '+' || ch === '-' || ch === ',') {
            err_msg.innerText = "Special character(s) not allowed";
            return null;
        }
        err_msg.innerText = "Invalid position";
        return null;
    }

    const position = parseInt(pos_trim, 10);
    if (position === 0) {
        err_msg.innerText = "Please enter a valid position";
        return null;
    } else if (position < 1 || position > words.length) {
        err_msg.innerText = `Enter position between 1 to ${words.length}`;
        return null;
    }
    return { position };
}

function input_3(replacement_raw, sentence, err_msg) {
    const replacement = replacement_raw.trim();
    if (replacement.length === 0) {
        err_msg.innerText = "Please enter a replacement";
        return null;
    }

    let start_index = 0;
    let dotCount = 0;

    const first = replacement[0];
    if (first === '+' || first === '-') {
        start_index = 1;
        if (replacement.length === 1) {
            err_msg.innerText = "Please enter a valid replacement";
            return null;
        }
    }

    for (let i = 0, n = replacement.length; i < n; i++) {
        const ch = replacement[i];
        const code = ch.charCodeAt(0);
        const is_letter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        const is_digit  = (code >= 48 && code <= 57);

        if (ch === ',') {
            err_msg.innerText = "Special character(s) not allowed";
            return null;
        } else if (ch === '.') {
            dotCount++;
            if (dotCount > 1) {
                err_msg.innerText = "Special character(s) not allowed";
                return null;
            }
            continue;
        } else if (i > 0 && (ch === '+' || ch === '-')) {
            err_msg.innerText = "Special character(s) not allowed";
            return null;
        } else if (!is_letter && !is_digit && ch !== '+' && ch !== '-' && ch !== '.') {
            err_msg.innerText = "Special character(s) not allowed";
            return null;
        }
    }

    let sentence_has_letter = false, sentence_has_digit = false;
    for (let i = 0, n = sentence.length; i < n; i++) {
        const code = sentence[i].charCodeAt(0);
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) sentence_has_letter = true;
        else if (code >= 48 && code <= 57) sentence_has_digit = true;
    }

    let replacement_has_letter = false, replacement_has_digit = false;
    for (let i = start_index, n = replacement.length; i < n; i++) {
        const ch = replacement[i];
        const code = ch.charCodeAt(0);
        const is_letter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        const is_digit  = (code >= 48 && code <= 57);
        if (is_letter) replacement_has_letter = true;
        else if (is_digit || ch === '.') replacement_has_digit = true;
    }

    if ((sentence_has_letter && replacement_has_digit) || (sentence_has_digit && replacement_has_letter)) {
        err_msg.innerText = "Invalid replacement input";
        return null;
    }

    return replacement;
}

function array() {
    const input_raw = document.getElementById("user_input_one").value.trim();
    const position_raw = document.getElementById("user_input_two").value.trim();
    const replacement_raw = document.getElementById("user_input_three").value.trim();
    const err_msg = document.getElementById("error_msg");

    err_msg.classList.add("d-none");
    err_msg.classList.replace("alert-success", "alert-danger");

    const commonResult = common_validation(input_raw, position_raw, replacement_raw, err_msg);
    if (!commonResult) {
        err_msg.classList.remove("d-none");
        return;
    }

    let sentence = input_raw.trim();
    let words = sentence.split(",").filter(w => w);

    const input1Result = input_1(sentence, words, err_msg);
    if (!input1Result) {
        err_msg.classList.remove("d-none");
        return;
    }
    sentence = input1Result.sentence;
    words = input1Result.words;

    const positionResult = input_2(position_raw, words, err_msg);
    if (!positionResult) {
        err_msg.classList.remove("d-none");
        return;
    }
    const { position } = positionResult;

    const replacement = input_3(replacement_raw, sentence, err_msg);
    if (replacement === null) {
        err_msg.classList.remove("d-none");
        return;
    }

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
