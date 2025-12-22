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

    if ((hasLetter(sentence) && hasNumber(sentence))) {
        showError("Invalid input");
        return;
    }

    
    if (hasInvalidSignUsage(sentence)) {
         showError("Invalid input");
    return;
    }
   

    if (positionRaw.trim().length === 0) {
    showError("Please enter the position");
    return;
    }

    if (hasLetter(positionRaw)) {
        showError("In position Positive only allowed");
        return;
    }
    if (!/[0-9]+$/.test(positionRaw)) {
        showError("Special characters not allowed");
        return;
    }
    

    const position = parseInt(positionRaw, 10);

    

    if (position < 0) {
        showError("In position Negative numbers not allowed");
        return;
    }

    if (!isValidNumber(position)) {
            showError("Special characters not allowed");
            return;
        }
    

    if (position === 0) {
        showError("Please enter a valid position");
        return;
    }

    // if(isValidPosition){
    //     showError("Special characters not allowed");
    //     return;
    // }

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

    
    
    if ((hasLetter(sentence) && hasNumber(replacement)) || hasLetter(replacement) && hasNumber(sentence) ) {
        showError("Invalid replacement input");
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
            ch !== "." &&
            ch !== "-" &&
            ch !== "+" &&
            ch !== " "
        ) {
            return true;
        }
    }
    return false;
}


function hasNumber(text) {
    for (let ch of text) {
        const code = ch.charCodeAt(0);
        if ((ch >= "0" && ch <= "9")
        ) {
            return true;
        }
    }
    return false;
}

function hasLetter(text) {
    for (let ch of text) {
        const code = ch.charCodeAt(0);
        if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")
        ) {
            return true;
        }
    }
    return false;
}

function isValidNumber(value) { 
   return /^[-+]?\d+(\.\d+)?$/.test(value); 
}

// function isValidPosition(value) {
//     if (value.length === 0) return false;

//     for (let i = 0; i < value.length; i++) {
//         const ch = value[i];

        
//         if (ch < "0" || ch > "9") {
//             return false;
//         }
//     }

   
//     const num = parseInt(value, 10);

//     return num > 0;
// }


function hasInvalidSignUsage(sentence) {
    let parts = sentence.split(",");
    
    for (let part of parts) {
        part = part.trim();
        
        let plusCount = 0;
        let minusCount = 0;
        
        for (let i = 0; i < part.length; i++) {
            let ch = part[i];
            
            if (ch === "+") {
                plusCount++;
                if (i !== 0 || plusCount > 1) return true;
            }
            
            if (ch === "-") {
                minusCount++;
                if (i !== 0 || minusCount > 1) return true;
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
    document.getElementById("error_msg").classList.add("d-none");
}
