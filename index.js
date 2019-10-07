// navigation
function showPage(selector) {
    document.querySelectorAll(".page")
        .forEach(p => p.classList.add("hidden"));
    document.querySelector(selector).classList.remove("hidden");
}

// so steps navigation shows on reload
showNavIfNeeded()

window.onhashchange = (e) => {
    showPage(window.location.hash);
    showNavIfNeeded();
}

function showNavIfNeeded() {
    // show steps navigation on these pages
    if (["#page2", "#page3", "#page4", "#page5"].includes(window.location.hash)) {
        document.querySelector(".nav-steps").classList.remove("nav-steps-hide");
    } else {
        document.querySelector(".nav-steps").classList.add("nav-steps-hide");
    };
}

if (window.location.hash !== "") {
    showPage(window.location.hash);
} else {
    showPage("#page1");
}


// Progress bars
registerBarTag(".personal-bar");
registerBarTag(".about-you-bar");
registerBarTag(".files-bar");
/**
 * Links tagged inputs with tagged svg rects.
 * e.g. input.some-bar, select.some-bar will fill rect.some-bar
 * @param {string} barSelector 
 */
function registerBarTag(barSelector) {   
    let inputElements = document.querySelectorAll(barSelector+"[required]"+":not(rect)");

    inputElements.forEach(inputEl => {
        let fillMyBarsIfNeeded = (e) => {
            let val = e.target.value;
            // 'marked' means input already contributed to progress
            // prevents progressing twice from same input
            if (val !== "" && !inputEl.classList.contains("marked")) {
                fillMyBars(barSelector, 1);
                inputEl.classList.add("marked");
            } 
            if (val == "" && inputEl.classList.contains("marked")) {
                fillMyBars(barSelector, -1);
                inputEl.classList.remove("marked");
            }   
        }

        inputEl.addEventListener("input", fillMyBarsIfNeeded);    
    }); 
    
    function fillMyBars(selector, m) {
        let bars = document.querySelectorAll("rect"+selector);
        // used to fill rect by correct amount
        let numReqInputs = document.querySelectorAll(selector+"[required]"+":not(rect)").length;
        bars.forEach(bar => {
            let current = bar.style.width === "" ? "" : parseInt(bar.style.width);
            // TODO: 165 is hardcoded as it's max width of the progress bar, set in CSS.
            // should be a better way of getting it
            let value = m*(165 / numReqInputs);
            bar.style.width = current+value;    
        });
    }
}

let showSubmitIfComplete = () => {
    let complete = true;
    // TODO: can this be calculated with just a query?
    document.querySelectorAll("*[required]").forEach(el => complete = (el.value !== ''));
    console.log(complete);
    if (complete) {
        document.querySelector(".submit-button").classList.remove("hidden");
    } else {
        document.querySelector(".submit-button").classList.add("hidden");
    }
}


// Input field validation
document.querySelectorAll("*[required]").forEach(inputEl => {
    // Writing underneath input showing when it's invalid
    let invalidWritingEl = document.querySelector(".invalid-writing[for="+inputEl.id+"]");    
    if (!invalidWritingEl) {
        console.warn(`#${inputEl.id} has no associated .invalid-writing element`);
    } 
    
    let checkEmpty = () => {
        if (inputEl.value === "") {
            inputEl.classList.add("invalid"); 
            // TODO: would be nice to use null property accessors here, see: 
            // https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining
            if (invalidWritingEl) invalidWritingEl.classList.remove("invisible");
        } else {
            inputEl.classList.remove("invalid");
            // TODO: same as ^
            if (invalidWritingEl) invalidWritingEl.classList.add("invisible");
        }
    }

    inputEl.addEventListener("focus", checkEmpty);
    inputEl.addEventListener("focus", showSubmitIfComplete);
    
    inputEl.addEventListener("input", checkEmpty);
    inputEl.addEventListener("input", showSubmitIfComplete);
});


// File upload
registerDragDrop("#cv-drop")
registerDragDrop("#cover-letter-drop")

/**
Expects:

div
    *.uploadText  
    input type=file 

Enables drag and drop over div, puts uploaded file name in .uploadText's inner text
*/
function registerDragDrop(dropDivSelector) {
    let dropDiv = document.querySelector(dropDivSelector);
    dropDiv.ondrop = (e) => {
        // TODO: array access, should handle potential error
        let fileName = e.dataTransfer.files[0].name;
        dropDiv.querySelector(".upload-text").innerText = fileName;    
        e.preventDefault();
    }
    dropDiv.ondragover = (e) => e.preventDefault();
    
    // Upload through input, where it says "here"
    let fileInput = dropDiv.querySelector("input[type='file']");
    fileInput.onchange = 
        (e) => dropDiv.querySelector(".upload-text").innerText = fileInput.files[0].name;
}

document.querySelector("#submit-button").onclick = (e) => {
    let payload = {};
    // gather inputs into payload
    document.querySelectorAll("input,select,textarea").forEach(inputEl => {
        // don't include if empty input
        // e.g. no last name
        if (!inputEl.value) return;
        
        // the 'name' attribute in the tag acts as payload key
        let key = inputEl.name;
        
        // handle bools and files
        if (key === "live_in_uk") {
            // TODO: hacky way of turning string to bool, not nice
            payload[key] = (inputEl.value === "true");
        } else if (key === "cv" || key === "cover_letter") {
            payload[key] = inputEl.files[0]
        } else {
            payload[key] = inputEl.value;
        }
    });
    
    let url = "https://recruitment-submissions.netsells.co.uk/api/vacancies/javascript-developer/submissions";
    fetch( url, {method: "POST", mode: "no-cors", body: JSON.stringify(payload)} )
        .then(res => {
            console.log(res);
        });
    console.log(payload);
}