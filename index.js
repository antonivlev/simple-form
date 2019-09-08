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

document.querySelectorAll(".personal-bar").forEach(
    el => {
        el.onchange = (e) => {
            // console.log(e.target.value);
            fillBar(".personal-bar", e.target.value)
        }    
    }
)

function fillBar(selector, value) {
    console.log(value);
    let bars = document.querySelectorAll("rect"+selector);
    if (value !== "") {
        bars.forEach(bar => changeWidth(bar, 10));
    } else {
        bars.forEach(bar => changeWidth(bar, -10));
    }
}

function changeWidth(el, amount) {
    console.log(el);
    let current = el.style.width;
    if (current !== "") {
        current = parseInt(el.style.width);
    }
    el.style.width = current+amount;
    console.log(current, amount, current+amount);
}