// Navigation
function showPage(selector) {
    document.querySelectorAll(".page")
        .forEach(p => p.classList.add("hidden"));
    document.querySelector(selector).classList.remove("hidden");
}

window.onhashchange = (e) => {
    showPage(window.location.hash);
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

// Clones and inserts steps navigation from page 3 into page4 and page5
document.querySelectorAll("#page4, #page5").forEach(page => {
    page.insertAdjacentElement("afterbegin", document.querySelector(".nav-steps").cloneNode(true));
})

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

document.querySelectorAll("input[type='file']").forEach(fileInput => {
    fileInput.onchange = (e) => 
        document.querySelector("#upload-text").innerText = fileInput.files[0].name;
})

function dropHandler(e) {
    let fileName = e.dataTransfer.files[0].name;
    document.querySelector("#upload-text").innerText = fileName;    
    e.preventDefault();
}

function dragOverHandler(e) {
    console.log("dragover");
  
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
}