// Navigation
function showPage(selector) {
    document.querySelectorAll(".page")
        .forEach(p => p.classList.add("hidden"));
    document.querySelector(selector).classList.remove("hidden");
}

// so navigation shows on reload
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
registerBar(".personal-bar");
registerBar(".about-you-bar");
registerBar(".files-bar");

function registerBar(barSelector) {   
    document.querySelectorAll(barSelector).forEach(el => {
        el.onchange = (e) => {
            let val = e.target.value;
            // 'marked' means input already contributed to progress
            // prevents progressing twice from same input
            if (val !== "" && !el.classList.contains("marked")) {
                fillBars(barSelector, 10);
                el.classList.add("marked");
            } 
            if (val == "" && el.classList.contains("marked")) {
                fillBars(barSelector, -10);
                el.classList.remove("marked");
            }   
        }    
    });    
}

function fillBars(selector, value) {
    let bars = document.querySelectorAll("rect"+selector);
    bars.forEach(bar => {
        // change width
        let current = bar.style.width === "" ? "" : parseInt(bar.style.width);
        bar.style.width = current+value;    
    });
}



// Input field validation
document.querySelectorAll("*[required]").forEach(inputEl => {
    // Writing underneath input showing when it's invalid
    let invalidWritingEl = document.querySelector(".invalid-writing[for="+inputEl.id+"]");
    let checkEmpty = () => {
        if (inputEl.value === "") {
            inputEl.classList.add("invalid");
            invalidWritingEl.classList.remove("invisible");
        } else {
            inputEl.classList.remove("invalid");
            invalidWritingEl.classList.add("invisible");
        }
    }

    inputEl.onfocus = checkEmpty;
    inputEl.oninput = checkEmpty;
});




// File upload
registerDragDrop("#cv-drop")
registerDragDrop("#cover-letter-drop")

/*
Expects:

div
    .uploadText  
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
