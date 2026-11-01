import React, { useState } from "react";
import ClassicTemplate from "../assets/templates/ClassicTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const ResumePreview = ({ data, template, accentColor = "#4F46E5", classes = "" }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full min-w-0 flex flex-col items-center">
      <div className="w-full flex items-center justify-between pb-3 px-2 text-xs text-slate-500 print:hidden">
        <span className="font-medium text-slate-600">
          Preview Scale: {Math.round(zoomLevel * 100)}%
        </span>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.6, Number((z - 0.1).toFixed(1))))}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
            title="Reset zoom"
          >
            <RotateCcw className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Keep the A4 sheet anchored to the left when it is wider than its panel.
          Centering an overflowing flex child can place its left edge outside the scroller. */}
      <div className="w-full min-w-0 overflow-x-auto p-4 sm:p-6 bg-slate-200/70 rounded-2xl border border-slate-200">
        <div className="flex justify-start w-max min-w-full">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top left",
              transition: "transform 0.15s ease-out",
            }}
            className="shrink-0"
          >
            <div
              id="resume-preview"
              className={`w-[210mm] min-h-[297mm] box-border bg-white text-slate-900 shadow-2xl shadow-slate-400/30 rounded-xs print:shadow-none print:w-[210mm] print:m-0 overflow-hidden ${classes}`}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .resume-pdf-export-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 210mm;
            min-width: 210mm;
            background: #ffffff;
            pointer-events: none;
            opacity: 0;
            z-index: -1;
          }
          .resume-pdf-export {
            display: block !important;
            box-sizing: border-box !important;
            width: 210mm !important;
            min-width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            overflow: visible !important;
          }
          .resume-pdf-export section,
          .resume-pdf-export header {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .resume-pdf-export img {
            max-width: 100%;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
          @media print {
            body * {
              visibility: hidden;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
