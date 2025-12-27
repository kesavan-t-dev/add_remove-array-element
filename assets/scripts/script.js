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

function input_1(sentence, words, err_msg){
    sentence = sentence.replace(/[,\s]+/g, ",");

    if (!sentence || sentence === ",") {
        err_msg.innerText = "Please enter a valid sentence";
        return false;
    }

    words = sentence.split(",").filter(w => w);

    if (words.length < 2) {
        err_msg.innerText = "Please enter more than one word";
        return false;
    }

    if (/^,|,$/.test(sentence)) {
        err_msg.innerText = "Special character(s) not allowed";
        return false;
    } 

    for (let part of words) {
        if (/^[+-]?\d+(?:\.\d+)?$/.test(part) || /^[A-Za-z]+$/.test(part)) {
            continue;
        } else if (sentence.length === 1) {
            err_msg.innerText = "Please enter more than one word";
            return false;
        } else if (
            /^(?:\.\d+|[+\-]\.\d+|[+\-]\.[+\-]\d+|[+\-]\.$|[+\-]{2,}|[+\-\.]+|.*\d[+\-\.]+$|\d+(?:[+\-\.]{2,}\d+|[+\-\.]{1,}\d+[+\-\.]{1,}\d+)|[+\-]\d+[+\-]+|.*\..*\..*|[A-Za-z][+\-\.][A-Za-z]|[+\-\.][A-Za-z][+\-\.]|[+\-\.]+[A-Za-z]+|[A-Za-z]+[+\-\.]+)$/.test(part)
        ) {
            err_msg.innerText = "Special character(s) not allowed";
            return false;
        } else if (/^(?=.*[A-Za-z])(?=.*\d).+$/.test(part)) {
            err_msg.innerText = "Invalid input type";
            return false;
        }
    }

    const hasAlpha = words.some(w => /^[A-Za-z]+$/.test(w));
    const hasNumeric = words.some(w => /^\d+$/.test(w));

    if (hasAlpha && hasNumeric) {
        err_msg.innerText = "Invalid input type";
        return false;
    }

    return { sentence, words };
}

function input_2(positionRaw, words, err_msg){

    if (!positionRaw.trim()) {
        err_msg.innerText = "Please enter a position";
        return null;
    }

    const posTrim = positionRaw.trim();
    if (/^[+\-]{2,}\d/.test(posTrim) || /\d[+\-\.]{1,}$/.test(posTrim) || /^\d+[+-]\d+$/.test(posTrim) ) {
        err_msg.innerText = "Special character(s) not allowed";
        return null;
    } else if (/-/.test(posTrim)) {
        err_msg.innerText = "Negative numbers not allowed";
        return null;
    } else if(/[a-zA-Z]/.test(posTrim) && /[0-9]/.test(posTrim) ){
        err_msg.innerText = "Invalid position";
        return null;
    } else if(/^\d+[+\-\.]{2,}\d+$/.test(posTrim) || /^\d+[+\-\.]{1,}\d+[+\-\.]{1,}\d+$/.test(posTrim)){
        err_msg.innerText = "Invalid position";
        return null;
    } else if(/[a-zA-Z]/.test(posTrim)){
        err_msg.innerText = "In position letter(s) not allowed";
        return null;
    }

    if (!/^\d+$/.test(posTrim)) {
        err_msg.innerText = "Invalid position";
        return null;
    }

    const position = parseInt(posTrim, 10);
    if (position === 0) {
        err_msg.innerText = "Please enter a valid position";
        return null;
    } else if (position > words.length) {
        err_msg.innerText = `Enter position between 1 to ${words.length}`;
        return null;
    }
    return {position};
}

function input_3(replacementRaw, sentence, err_msg){
    const replacement = replacementRaw.trim();
        
    const invalidNumeric = /^(?:\.\d+|\d+\.|.*\..*\..*|[+\-\.]+|.*\d[+\-\.]+$|\d+(?:[+\-\.]{2,}\d+|[+\-\.]{1,}\d+[+\-\.]{1,}\d+)|[+\-]\d+[+\-]+)$/;
    const invalidAlphaMix = /^(?:[+\-\.]+[A-Za-z]+|[A-Za-z]+[+\-\.]+|[A-Za-z][+\-\.][A-Za-z]|[+\-\.][A-Za-z][+\-\.])$/;

    if (invalidNumeric.test(replacement) || invalidAlphaMix.test(replacementRaw)) {
        err_msg.innerText = "Special character(s) not allowed";
        return null;
    } else if (
            ((/[A-Za-z]/.test(sentence)) && (/\d/.test(replacement))) ||
            ((/\d/.test(sentence)) && (/[A-Za-z]/.test(replacement)))
        ){
            err_msg.innerText = "Invalid replacement input";
            return null;
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
    if (!commonResult) {
        err_msg.classList.remove("d-none");
        return;
    }

    let sentence = inputRaw.trim();
    let words = sentence.split(",").filter(w => w);
    
    const input1Result = input_1(sentence, words, err_msg);
    if (!input1Result) {
        err_msg.classList.remove("d-none");
        return;
    }
    sentence = input1Result.sentence;
    words = input1Result.words;
    
    const positionResult = input_2(positionRaw, words, err_msg);
    if (!positionResult) {
        err_msg.classList.remove("d-none");
        return;
    }
    const { position } = positionResult;

    const replacement = input_3(replacementRaw, sentence, err_msg);
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
