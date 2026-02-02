window.onload = () => {
  const cAndDBtn = document.getElementById("cAndDBtn");
  const pdfInput = document.getElementById("pdfInput");
  cAndDBtn.addEventListener("click", combineAndDownload);
  pdfInput.addEventListener("change", handlePdfInput);

  function enableButton(enable) {
    cAndDBtn.classList.remove(enable ? "btn-secondary" : "btn-success");
    cAndDBtn.classList.add(!enable ? "btn-secondary" : "btn-success");
    cAndDBtn.disabled = !enable;
  }

  function handlePdfInput() {
    if (pdfInput.files.length >= 1) {
      enableButton(true);
    } else {
      enableButton(false);
      alert("Please provide at least 2 pdf files");
    }
  }

  async function combineAndDownload() {
    const pdfLib = await PDFLib.PDFDocument.create();
    for (const file of pdfInput.files) {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const [page] = await pdfLib.copyPages(pdf, [i]);
        pdfLib.addPage(page);
      }
    }
    const pdfDataUri = await pdfLib.saveAsBase64({ dataUri: true });
    saveAs(pdfDataUri, "result", { type: "application/pdf" });
  }
};

