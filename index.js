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

// clones and inserts steps navigation from page 3
document.querySelectorAll("#page4, #page5").forEach(page => {
    page.insertAdjacentElement("afterbegin", document.querySelector(".step-nav").cloneNode(true));
})

document.querySelector("#page3 .next-button").onclick = () => {
    let allValid = true;
    // check all required input fields on page
    document.querySelectorAll("#page3 *[required]").forEach(field => {
        let invalidWritingEl = document.querySelector(".invalid-writing[for="+field.id+"]");
        if (field.value === "") {
            allValid = false;
            invalidWritingEl.style.visibility = "visible";
        }
    });
    if (allValid) {
        window.location.hash = "#page4"
    }
}