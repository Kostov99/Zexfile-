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


/* ==========================================
   ZEXFILE IMAGE RESIZER
========================================== */

let resizeSourceFile = null;
let resizeSourceImage = null;
let resizeSourceURL = null;
let resizeOutputURL = null;


/* ==========================================
   SELECT IMAGE
========================================== */

$("resizeImageInput").addEventListener("change", async function () {

    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast("Please select an image.");
        return;
    }

    if (file.size > 25 * 1024 * 1024) {
        showToast("Image must be smaller than 25 MB.");
        this.value = "";
        return;
    }

    try {

        if (resizeSourceURL) {
            URL.revokeObjectURL(resizeSourceURL);
        }

        resizeSourceFile = file;
        resizeSourceURL = URL.createObjectURL(file);

        resizeSourceImage = await loadImage(resizeSourceURL);

        $("resizeImagePreview").src = resizeSourceURL;

        $("resizeOriginalName").textContent = file.name;

        $("resizeOriginalDimensions").textContent =
            `${resizeSourceImage.naturalWidth} × ${resizeSourceImage.naturalHeight} px`;

        $("resizeOriginalSize").textContent =
            formatBytes(file.size);

        $("resizeWidth").value =
            resizeSourceImage.naturalWidth;

        $("resizeHeight").value =
            resizeSourceImage.naturalHeight;

        $("resizePrintWidth").value =
            (
                resizeSourceImage.naturalWidth /
                Number($("resizeDPI").value) *
                2.54
            ).toFixed(2);

        $("resizePrintHeight").value =
            (
                resizeSourceImage.naturalHeight /
                Number($("resizeDPI").value) *
                2.54
            ).toFixed(2);

        $("resizeImageInfo").classList.remove("hidden");

        $("resizeResult").classList.add("hidden");

        showToast("Photo loaded successfully.");

    } catch (error) {

        showToast("Could not open this image.");

    }

});


/* ==========================================
   FORMAT FILE SIZE
========================================== */

function formatBytes(bytes) {

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}


/* ==========================================
   ASPECT RATIO
========================================== */

$("resizeWidth").addEventListener("input", function () {

    if (
        !$("resizeKeepRatio").checked ||
        !resizeSourceImage
    ) return;

    const width = Number(this.value);

    if (width > 0) {

        $("resizeHeight").value = Math.max(
            1,
            Math.round(
                width *
                resizeSourceImage.naturalHeight /
                resizeSourceImage.naturalWidth
            )
        );

    }

});


$("resizeHeight").addEventListener("input", function () {

    if (
        !$("resizeKeepRatio").checked ||
        !resizeSourceImage
    ) return;

    const height = Number(this.value);

    if (height > 0) {

        $("resizeWidth").value = Math.max(
            1,
            Math.round(
                height *
                resizeSourceImage.naturalWidth /
                resizeSourceImage.naturalHeight
            )
        );

    }

});


/* ==========================================
   DPI AND PHYSICAL SIZE
========================================== */

$("resizeDPI").addEventListener("change", function () {

    if (!resizeSourceImage) return;

    const dpi = Number(this.value);

    const unit = $("resizeUnit").value;

    const conversion = unit === "cm" ? 2.54 : 1;

    $("resizePrintWidth").value = (
        resizeSourceImage.naturalWidth /
        dpi *
        conversion
    ).toFixed(2);

    $("resizePrintHeight").value = (
        resizeSourceImage.naturalHeight /
        dpi *
        conversion
    ).toFixed(2);

});


$("resizeUnit").addEventListener("change", function () {

    if (!resizeSourceImage) return;

    const width = Number($("resizePrintWidth").value);
    const height = Number($("resizePrintHeight").value);

    if (this.value === "inch") {

        $("resizePrintWidth").value =
            (width / 2.54).toFixed(2);

        $("resizePrintHeight").value =
            (height / 2.54).toFixed(2);

    } else {

        $("resizePrintWidth").value =
            (width * 2.54).toFixed(2);

        $("resizePrintHeight").value =
            (height * 2.54).toFixed(2);

    }

});


/* ==========================================
   PRESET DIMENSIONS
========================================== */

$("resizePreset").addEventListener("change", function () {

    const preset = this.value;

    const dpi = Number($("resizeDPI").value);

    const unit = $("resizeUnit").value;

    let widthMM;
    let heightMM;

    switch (preset) {

        case "passport":
            widthMM = 35;
            heightMM = 45;
            break;

        case "stamp":
            widthMM = 25;
            heightMM = 35;
            break;

        case "a4":
            widthMM = 210;
            heightMM = 297;
            break;

        case "a5":
            widthMM = 148;
            heightMM = 210;
            break;

        case "a3":
            widthMM = 297;
            heightMM = 420;
            break;

        case "letter":
            widthMM = 215.9;
            heightMM = 279.4;
            break;

        case "legal":
            widthMM = 215.9;
            heightMM = 355.6;
            break;

        default:
            return;

    }

    const widthInches = widthMM / 25.4;
    const heightInches = heightMM / 25.4;

    $("resizeWidth").value =
        Math.round(widthInches * dpi);

    $("resizeHeight").value =
        Math.round(heightInches * dpi);

    $("resizeKeepRatio").checked = false;

    const factor = unit === "cm" ? 10 : 25.4;

    $("resizePrintWidth").value =
        (widthMM / factor).toFixed(2);

    $("resizePrintHeight").value =
        (heightMM / factor).toFixed(2);

    showToast("Preset applied.");

});


/* ==========================================
   APPLY PRINT SIZE
========================================== */

$("applyPrintSize").addEventListener("click", function () {

    const width = Number($("resizePrintWidth").value);
    const height = Number($("resizePrintHeight").value);

    const dpi = Number($("resizeDPI").value);

    const unit = $("resizeUnit").value;

    if (
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        width <= 0 ||
        height <= 0
    ) {

        showToast("Enter valid print dimensions.");

        return;

    }

    const multiplier =
        unit === "cm" ? dpi / 2.54 : dpi;

    const pixelWidth =
        Math.round(width * multiplier);

    const pixelHeight =
        Math.round(height * multiplier);

    if (
        pixelWidth > 12000 ||
        pixelHeight > 12000
    ) {

        showToast("Dimensions are too large.");

        return;

    }

    $("resizeWidth").value = pixelWidth;

    $("resizeHeight").value = pixelHeight;

    $("resizeKeepRatio").checked = false;

    showToast("Print dimensions applied.");

});


/* ==========================================
   CANVAS TO BLOB
========================================== */

function canvasToBlob(canvas, format, quality) {

    return new Promise((resolve, reject) => {

        canvas.toBlob(blob => {

            if (blob) {
                resolve(blob);
            } else {
                reject(new Error("Image conversion failed."));
            }

        }, format, quality);

    });

}


/* ==========================================
   RESIZE AND COMPRESS
========================================== */

$("resizeImageBtn").addEventListener("click", async function () {

    if (!resizeSourceImage || !resizeSourceFile) {

        showToast("Please select a photo first.");

        return;

    }

    const width = Number($("resizeWidth").value);

    const height = Number($("resizeHeight").value);

    const format = $("resizeFormat").value;

    const targetKB = Number($("resizeTargetKB").value);

    if (
        !Number.isInteger(width) ||
        !Number.isInteger(height) ||
        width < 1 ||
        height < 1 ||
        width > 12000 ||
        height > 12000
    ) {

        showToast("Enter valid dimensions up to 12000 px.");

        return;

    }

    if (
        $("resizeTargetKB").value.trim() !== "" &&
        (!Number.isFinite(targetKB) || targetKB <= 0)
    ) {

        showToast("Enter a valid target file size.");

        return;

    }

    if (width * height > 40000000) {

        showToast("Image is too large to process safely.");

        return;

    }

    const button = $("resizeImageBtn");

    button.disabled = true;

    button.textContent = "Processing Image...";

    try {

        const canvas = document.createElement("canvas");

        canvas.width = width;

        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (format === "image/jpeg") {

            ctx.fillStyle = "#ffffff";

            ctx.fillRect(0, 0, width, height);

        }

        ctx.drawImage(
            resizeSourceImage,
            0,
            0,
            width,
            height
        );

        let blob;

        if (format === "image/png") {

            blob = await canvasToBlob(
                canvas,
                format
            );

        } else {

            const hasTarget =
                $("resizeTargetKB").value.trim() !== "";

            if (!hasTarget) {

                blob = await canvasToBlob(
                    canvas,
                    format,
                    0.92
                );

            } else {

                const targetBytes = targetKB * 1024;

                let low = 0.05;

                let high = 1;

                let bestBlob = null;

                // Try to get as close as possible
                // without exceeding the requested size.

                for (let i = 0; i < 8; i++) {

                    const quality = (low + high) / 2;

                    const candidate = await canvasToBlob(
                        canvas,
                        format,
                        quality
                    );

                    if (candidate.size <= targetBytes) {

                        bestBlob = candidate;

                        low = quality;

                    } else {

                        high = quality;

                    }

                }

                const finalBlob = await canvasToBlob(
                    canvas,
                    format,
                    low
                );

                if (finalBlob.size <= targetBytes) {

                    bestBlob = finalBlob;

                }

                blob = bestBlob || finalBlob;

            }

        }

        if (resizeOutputURL) {

            URL.revokeObjectURL(resizeOutputURL);

        }

        resizeOutputURL = URL.createObjectURL(blob);

        const extension = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp"
        }[format];

        const downloadLink = $("downloadResizedImage");

        downloadLink.href = resizeOutputURL;

        downloadLink.download =
            `zexfile-resized.${extension}`;

        $("resizeResultPreview").src = resizeOutputURL;

        $("resultDimensions").textContent =
            `${width} × ${height} px`;

        $("resultFileSize").textContent =
            formatBytes(blob.size);

        const unit = $("resizeUnit").value;

        $("resultPrintSize").textContent =
            `${$("resizePrintWidth").value} × ` +
            `${$("resizePrintHeight").value} ${unit}`;

        $("resizeResult").classList.remove("hidden");

        let message = "Image resized successfully.";

        if (
            $("resizeTargetKB").value.trim() !== "" &&
            format !== "image/png" &&
            blob.size > targetKB * 1024
        ) {

            message =
                "Target size could not be reached. Try smaller dimensions.";

        } else if (format === "image/png" && targetKB > 0) {

            message =
                "PNG saved. Its size may exceed your target.";

        }

        showToast(message);

    } catch (error) {

        console.error(error);

        showToast("Could not resize this image.");

    } finally {

        button.disabled = false;

        button.innerHTML =
            "<span>📐</span> Resize & Download Image";

    }

});


/* =========================
   INITIALIZE
========================= */

updateTextStats();

renderImages();
