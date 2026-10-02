/* =====================================================
   ZEXFILE
   Main JavaScript
   ===================================================== */


/* =========================
   GLOBAL VARIABLES
========================= */

let selectedImages = [];

const $ = (id) => document.getElementById(id);


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================
   THEME
========================= */

const themeBtn = $("themeBtn");

const savedTheme = localStorage.getItem("zexfile-theme");

if (savedTheme === "light") {

    document.body.classList.add("light");

    themeBtn.textContent = "☾";

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        "zexfile-theme",
        isLight ? "light" : "dark"
    );

    themeBtn.textContent =
        isLight ? "☾" : "☀";

});


/* =========================
   TAB SYSTEM
========================= */

const tabs = document.querySelectorAll(".tab");

const toolSections =
    document.querySelectorAll(".tool-section");


tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const target = tab.dataset.target;


        tabs.forEach(t => {
            t.classList.remove("active");
        });

        tab.classList.add("active");


        toolSections.forEach(section => {

            section.classList.remove("active");

        });


        $(target).classList.add("active");

    });

});


/* =========================
   TEXT FILE CREATOR
========================= */

const fileContent = $("fileContent");

const characterCount = $("characterCount");

const lineCount = $("lineCount");


function updateTextStats() {

    const text = fileContent.value;

    characterCount.textContent =
        `${text.length} characters`;


    const lines =
        text.length === 0
            ? 0
            : text.split("\n").length;

    lineCount.textContent =
        `${lines} lines`;

}


fileContent.addEventListener(
    "input",
    updateTextStats
);


$("downloadFileBtn").addEventListener(
    "click",
    () => {

        const content =
            fileContent.value;

        const fileName =
            $("fileName").value.trim() ||
            "zexfile";

        const fileType =
            $("fileType").value;


        if (!content.trim()) {

            showToast(
                "Please enter some content first."
            );

            fileContent.focus();

            return;
        }


        let finalContent = content;


        /* JSON VALIDATION */

        if (fileType === "json") {

            try {

                const json =
                    JSON.parse(content);

                finalContent =
                    JSON.stringify(
                        json,
                        null,
                        2
                    );

            } catch (error) {

                showToast(
                    "Invalid JSON format."
                );

                return;
            }

        }


        const mimeType =
            fileType === "json"
                ? "application/json"
                : "text/plain";


        const blob =
            new Blob(
                [finalContent],
                { type: mimeType }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `${fileName}.${fileType}`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);


        showToast(
            `${fileType.toUpperCase()} file downloaded.`
        );

    }
);


/* =========================
   QR CODE GENERATOR
========================= */

$("generateQRBtn").addEventListener(
    "click",
    generateQRCode
);


function generateQRCode() {

    const url =
        $("urlInput").value.trim();

    const qrContainer =
        $("qrcode");

    const qrStatus =
        $("qrStatus");

    const downloadButton =
        $("downloadQRBtn");


    if (!url) {

        showToast(
            "Please enter a URL."
        );

        return;
    }


    try {

        new URL(url);

    } catch {

        showToast(
            "Please enter a valid URL."
        );

        return;
    }


    qrContainer.innerHTML = "";


    new QRCode(qrContainer, {

        text: url,

        width: 190,

        height: 190,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel:
            QRCode.CorrectLevel.H

    });


    qrStatus.textContent =
        "QR code generated successfully.";

    downloadButton.classList.remove(
        "hidden"
    );


    showToast(
        "QR code generated."
    );

}


/* =========================
   DOWNLOAD QR
========================= */

$("downloadQRBtn").addEventListener(
    "click",
    downloadQRCode
);


function downloadQRCode() {

    const qrContainer =
        $("qrcode");

    const canvas =
        qrContainer.querySelector("canvas");


    if (canvas) {

        const link =
            document.createElement("a");

        link.download =
            "zexfile-qr.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

        showToast(
            "QR code downloaded."
        );

        return;
    }


    const image =
        qrContainer.querySelector("img");


    if (image) {

        const link =
            document.createElement("a");

        link.download =
            "zexfile-qr.png";

        link.href =
            image.src;

        link.click();

        showToast(
            "QR code downloaded."
        );

    }

}


/* =========================
   IMAGE SELECT
========================= */

$("imageInput").addEventListener(
    "change",
    function () {

        const files =
            Array.from(this.files);


        if (!files.length) {
            return;
        }


        const validFiles =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );


        selectedImages.push(
            ...validFiles
        );


        renderImages();


        this.value = "";

    }
);


/* =========================
   RENDER IMAGE GRID
========================= */

function renderImages() {

    const grid =
        $("imageGrid");

    const toolbar =
        $("imageToolbar");

    const settings =
        $("pdfSettings");

    const createButton =
        $("createPDFBtn");

    const count =
        $("imageCount");


    grid.innerHTML = "";


    if (!selectedImages.length) {

        toolbar.classList.add(
            "hidden"
        );

        settings.classList.add(
            "hidden"
        );

        createButton.classList.add(
            "hidden"
        );

        return;
    }


    toolbar.classList.remove(
        "hidden"
    );

    settings.classList.remove(
        "hidden"
    );

    createButton.classList.remove(
        "hidden"
    );


    count.textContent =
        `${selectedImages.length} ${
            selectedImages.length === 1
                ? "image"
                : "images"
        }`;


    selectedImages.forEach(
        (file, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "image-card";


            const img =
                document.createElement(
                    "img"
                );


            const remove =
                document.createElement(
                    "button"
                );

            remove.className =
                "remove-image";

            remove.textContent =
                "×";


            remove.addEventListener(
                "click",
                () => {

                    selectedImages.splice(
                        index,
                        1
                    );

                    renderImages();

                }
            );


            const number =
                document.createElement(
                    "div"
                );

            number.className =
                "image-number";

            number.textContent =
                index + 1;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    img.src =
                        event.target.result;

                };


            reader.readAsDataURL(file);


            card.appendChild(img);

            card.appendChild(number);

            card.appendChild(remove);

            grid.appendChild(card);

        }
    );

}


/* =========================
   CLEAR IMAGES
========================= */

$("clearImagesBtn").addEventListener(
    "click",
    () => {

        selectedImages = [];

        renderImages();

        showToast(
            "All images removed."
        );

    }
);


/* =========================
   IMAGE TO PDF
========================= */

$("createPDFBtn").addEventListener(
    "click",
    createPDF
);


async function createPDF() {

    if (!selectedImages.length) {

        showToast(
            "Please add at least one image."
        );

        return;
    }


    const {
        jsPDF
    } = window.jspdf;


    const pageSize =
        $("pageSize").value;


    let pdf;


    if (pageSize === "letter") {

        pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter"
        });

    }

    else if (pageSize === "a5") {

        pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a5"
        });

    }

    else {

        pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

    }


    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();


    const margin = 8;

    const maxWidth =
        pageWidth - margin * 2;

    const maxHeight =
        pageHeight - margin * 2;


    for (
        let i = 0;
        i < selectedImages.length;
        i++
    ) {

        if (i > 0) {
            pdf.addPage();
        }


        const file =
            selectedImages[i];


        const data =
            await fileToDataURL(file);


        const image =
            await loadImage(data);


        let width =
            image.naturalWidth;

        let height =
            image.naturalHeight;


        const ratio =
            Math.min(
                maxWidth / width,
                maxHeight / height
            );


        width *= ratio;

        height *= ratio;


        const x =
            (pageWidth - width) / 2;

        const y =
            (pageHeight - height) / 2;


        let format =
            "JPEG";


        if (
            file.type ===
            "image/png"
        ) {
            format = "PNG";
        }


        pdf.addImage(
            data,
            format,
            x,
            y,
            width,
            height
        );

    }


    let pdfName =
        $("pdfName").value.trim();


    if (!pdfName) {
        pdfName = "zexfile-document";
    }


    if (
        pdfName
            .toLowerCase()
            .endsWith(".pdf")
    ) {

        pdfName =
            pdfName.slice(
                0,
                -4
            );

    }


    pdf.save(
        `${pdfName}.pdf`
    );


    showToast(
        "PDF created successfully."
    );


    createPreview();

}


/* =========================
   FILE → DATA URL
========================= */

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => resolve(
                    reader.result
                );


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================
   LOAD IMAGE
========================= */

function loadImage(src) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();


            img.onload =
                () => resolve(img);


            img.onerror =
                reject;


            img.src = src;

        }
    );

}


/* =========================
   PDF PREVIEW
========================= */

async function createPreview() {

    const preview =
        $("pdfPreview");

    const pages =
        $("previewPages");


    pages.innerHTML = "";


    for (
        let i = 0;
        i < selectedImages.length;
        i++
    ) {

        const file =
            selectedImages[i];


        const data =
            await fileToDataURL(file);


        const page =
            document.createElement(
                "div"
            );

        page.className =
            "preview-page";


        const img =
            document.createElement(
                "img"
            );

        img.src = data;


        page.appendChild(img);

        pages.appendChild(page);

    }


    preview.classList.remove(
        "hidden"
    );

}


/* =========================
   CLOSE PREVIEW
========================= */

$("closePreviewBtn").addEventListener(
    "click",
    () => {

        $("pdfPreview")
            .classList.add(
                "hidden"
            );

    }
);


/* =========================
   DRAG & DROP
========================= */

const uploadArea =
    document.querySelector(
        ".upload-area"
    );


uploadArea.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        uploadArea.style.borderColor =
            "var(--accent)";

    }
);


uploadArea.addEventListener(
    "dragleave",
    () => {

        uploadArea.style.borderColor =
            "";

    }
);


uploadArea.addEventListener(
    "drop",
    event => {

        event.preventDefault();


        uploadArea.style.borderColor =
            "";


        const files =
            Array.from(
                event.dataTransfer.files
            );


        const images =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );


        if (!images.length) {

            showToast(
                "Please drop image files."
            );

            return;
        }


        selectedImages.push(
            ...images
        );


        renderImages();

    }
);


/* =========================
   ENTER KEY FOR QR
========================= */

$("urlInput").addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            generateQRCode();

        }

    }
);


/* =========================
   INITIALIZE
========================= */

updateTextStats();

renderImages();
