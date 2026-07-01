import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, Loader2 } from "lucide-react";

function LessonPDFExporter({ lesson }) {
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!lesson || !printRef.current) return;

    try {
      setExporting(true);

      const element = printRef.current;

      // 💡 Use an ultra-high performance canvas snapshot configuration
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; 
      const pageHeight = 297;  
      
      // Safeguard against division by zero errors
      const canvasWidth = canvas.width > 0 ? canvas.width : 1;
      const canvasHeight = canvas.height > 0 ? canvas.height : 1;
      
      const imgHeight = Math.floor((canvasHeight * imgWidth) / canvasWidth);
      let heightLeft = imgHeight;
      let position = 0;

      // Print Page 1
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Print subsequent pages cleanly
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const filename = `${lesson.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_lesson.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error("PDF engine failure:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownloadPDF}
        disabled={exporting}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-50"
      >
        {exporting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
            Compiling document stream...
          </>
        ) : (
          <>
            <Download size={14} />
            Export Lesson PDF
          </>
        )}
      </button>

      {/* 💡 THE FIX: Render completely off-screen instead of display: none */}
      <div style={{ position: "absolute", left: "-9999px", top: "0", zIndex: "-100" }}>
        <div
          ref={printRef}
          style={{
            width: "800px",
            padding: "40px",
            color: "#1e293b",
            fontFamily: "system-ui, -apple-system, sans-serif",
            backgroundColor: "#ffffff",
          }}
          className="space-y-8"
        >
          {/* Header */}
          <div style={{ borderBottom: "2px solid #e2e8f0", paddingBottom: "12px" }}>
            <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", tracking: "wider", fontWeight: "600" }}>
              Structured Learning Pipeline
            </span>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginTop: "4px" }}>
              {lesson.title}
            </h1>
          </div>

          {/* Content Loop */}
          {lesson.content?.map((block, idx) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2 key={idx} style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", paddingTop: "10px", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
                    {block.text}
                  </h2>
                );
              case "paragraph":
                return (
                  <p key={idx} style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
                    {block.text}
                  </p>
                );
              case "code":
                return (
                  <div key={idx} style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", fontFamily: "monospace", fontSize: "12px" }}>
                    <div style={{ color: "#64748b", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "8px" }}>
                      Source Execution Block ({block.language})
                    </div>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{block.content}</pre>
                  </div>
                );
              case "mcq":
                return (
                  <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", backgroundColor: "#f8fafc" }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>Q: {block.question}</p>
                    <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop: "8px" }}>
                      {block.options?.map((opt, oIdx) => (
                        <li key={oIdx} style={{ fontSize: "13px", padding: "4px 0", color: opt === block.correct_answer ? "#16a34a" : "#475569", fontWeight: opt === block.correct_answer ? "600" : "400" }}>
                          {opt === block.correct_answer ? "✓ " : "• "} {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
}

export default LessonPDFExporter;