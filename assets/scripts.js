function common_validation(sentence, position, replacement, err_msg) {
    if (!sentence) {
        err_msg.innerText = "Please enter a sentence";
        return null;
    } else if (!position) {
        err_msg.innerText = "Please enter a valid position";
        return false;
    } else if (!replacement){
        err_msg.innerText = "Please enter the replacement word";
        return false;
    } else if (/[^a-zA-Z0-9.,\s+-]/.test(sentence) || /[^a-zA-Z0-9\s+-.]/.test(position) || /[^a-zA-Z0-9\s+-.]/.test(replacement)) {
        err_msg.innerText = "Special character(s) not allowed";
        return false;
    }
    return { sentence, position, replacement };
}

function input_1(sentence, words, err_msg){
    sentence = sentence.replace(/[,\s]+/g, ",").replace(/\.{2,}/g, ".");
    words = sentence.split(",").filter(w => w);

    if (/^,|,$/.test(sentence)) {
        err_msg.innerText = "Special character(s) not allowed";
        return false;
    }
    for (let part of words) {
        if (/^\d+(\.\d+)?$/.test(part) || /^[+-]\d+(\.\d+)?$/.test(part) || /^[a-zA-Z]+$/.test(part)) {
            continue;
        } else if (/^[+-]$/.test(part) || /^[+-][^0-9]/.test(part) || /^\d+[+-]$/.test(part) || /^\d+[+-]\d+$/.test(part) || /\.\..*/.test(part)) {
            err_msg.innerText = "Invalid input";
            return false;
        } 
    }
    return true;

}

function input_2(positionRaw, words, err_msg){
    const posTrim = positionRaw.trim();
     if (/^-/.test(posTrim)) {
        err_msg.innerText = "Negative numbers not allowed";
        return null;
    } else if (!/^\+?\d+$/.test(posTrim)) {
        err_msg.innerText = "In position numbers only allowed";
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
    return position;
}

function input_3(replacementRaw, sentence, err_msg){
    const replacement = replacementRaw.trim().replace(/[,\s]+/g, ",").replace(/\.{2,}/g, ".");
    
    if (!replacement) {
        err_msg.innerText = "Please enter the replacement word";
        return null;
    } else if (/.*[+-].*[+-]/.test(replacement)) {
        err_msg.innerText = "Invalid replacement input";
        return null;
    } else if (/\.\..*/.test(replacement)) {
        err_msg.innerText = "Invalid replacement input";
        return null;
    } else if ((/[a-zA-Z]/.test(sentence) && /\d/.test(replacement)) ||
        (/\d/.test(sentence) && /[a-zA-Z]/.test(replacement))) {
        err_msg.innerText = "Invalid replacement input";
        return null;
    }

    return replacement;

}


function array() {
    const inputRaw = document.getElementById("user_input_one").value;
    const positionRaw = document.getElementById("user_input_two").value;
    const replacementRaw = document.getElementById("user_input_three").value;
    const err_msg = document.getElementById("error_msg");

    err_msg.classList.add("d-none");
    err_msg.classList.replace("alert-success", "alert-danger");

    let sentence = inputRaw.trim();
    let words = sentence.split(",").filter(w => w);

    const commonResult = common_validation(sentence, words, err_msg);
    sentence = commonResult.sentence;
    words = commonResult.words;
    if (!input_1(sentence, words, err_msg)) { 
        err_msg.classList.remove("d-none"); 
        return; 
    }
    const position = input_2(positionRaw, words, err_msg);
    const replacement = input_3(replacementRaw, sentence, err_msg);
    if (!commonResult) { 
        err_msg.classList.remove("d-none"); 
        return; 
    } else if (!replacement) { 
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