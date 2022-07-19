function displayLoader(ele) {
    if (ele.classList.contains("d-none")) {
        ele.classList.remove("d-none");
    }
    ele.classList.add("d-block");
}

function hideLoader(ele) {
    if (ele.classList.contains("d-block")) {
        ele.classList.remove("d-block");
    }
    ele.classList.add("d-none");
}

export { displayLoader, hideLoader };