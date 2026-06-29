import React from "react";
import ClassicTemplate from "../assets/templates/ClassicTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
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
    <div className="w-full overflow-x-auto bg-gray-100">
      <div
        id="resume-preview"
        className={`mx-auto min-w-[320px] border border-gray-200 bg-white [overflow-wrap:anywhere] print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>
      <style>
        {`
          .resume-pdf-export-container {
            position: fixed;
            left: -10000px;
            top: 0;
            width: 210mm;
            background: #ffffff;
            z-index: -1;
          }
          .resume-pdf-export {
            width: 210mm !important;
            min-width: 210mm !important;
            max-width: 210mm !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
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
            size: letter;
            margin: 0;
          }
          @media print {
            html,
            body {
              width: 8.5in;
              height: 11in;
            }
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
              width: 8.5in;
              height: auto;
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
