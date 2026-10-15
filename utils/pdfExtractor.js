/**
 * Client-Side Resume Document Text Extractor
 * Supports PDF (via dynamically loaded Mozilla PDF.js), TXT, and Markdown files.
 * Extracts plain text directly in the browser with 100% privacy and zero latency.
 */

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function loadPdfJsScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("PDF parser must run in browser environment."));
      return;
    }

    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }

    const existingScript = document.querySelector(`script[src="${PDFJS_CDN}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.pdfjsLib));
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = PDFJS_CDN;
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib not defined after script load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"));
    document.head.appendChild(script);
  });
}

/**
 * Extract full text from a File object (.pdf, .txt, .md, .docx text)
 * @param {File} file 
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file) {
  if (!file) throw new Error("No file provided.");

  const fileName = file.name.toLowerCase();

  // Plain Text / Markdown
  if (fileName.endsWith(".txt") || fileName.endsWith(".md") || file.type.startsWith("text/")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || "");
      reader.onerror = (e) => reject(new Error("Failed to read text file."));
      reader.readAsText(file);
    });
  }

  // PDF Document
  if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
    try {
      const pdfjs = await loadPdfJsScript();
      const arrayBuffer = await file.arrayBuffer();

      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      let extractedText = "";

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY;
        let pageStr = "";

        for (const item of textContent.items) {
          if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
            pageStr += "\n";
          } else if (pageStr.length > 0 && !pageStr.endsWith(" ") && !pageStr.endsWith("\n")) {
            pageStr += " ";
          }
          pageStr += item.str;
          lastY = item.transform[5];
        }

        extractedText += pageStr.trim() + "\n\n";
      }

      if (!extractedText.trim()) {
        throw new Error("This PDF appears to be an image or scanned document. Please copy and paste your resume text directly.");
      }

      return extractedText.trim();
    } catch (pdfErr) {
      console.warn("PDF extraction error:", pdfErr);
      throw new Error(pdfErr?.message || "Could not parse text from this PDF. Try pasting the resume text instead.");
    }
  }

  // Fallback try reading as text
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || "");
    reader.onerror = () => reject(new Error("Unsupported file format. Please upload a PDF or TXT file."));
    reader.readAsText(file);
  });
}
