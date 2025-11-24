import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Props = {
  name: string;
  pdfRef: React.RefObject<HTMLDivElement | null>;
};

export const htmlToPdf = async (name, pdfRef) => {
  const element = pdfRef.current;
  if (!element) return;
  const canvas = await html2canvas(element, {
    scale: 3, // Higher quality
    useCORS: true,
    logging: false
  });

  const imgData = canvas.toDataURL("image/png");

  /*   const link = document.createElement("a")
  link.download = `image.png`
  link.href = imgData
  link.click() */

  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${name}.pdf`);
};
