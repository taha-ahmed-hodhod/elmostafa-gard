import { ShareOptions } from '../types';

export const generateAndSharePDF = async (elementId: string, options: ShareOptions): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Table element not found');
  }

  // Configuration for html2pdf
  const opt = {
    margin: [10, 10, 10, 10], // top, left, bottom, right
    filename: options.filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      // Helper to ensure input values are captured correctly from React state
      onclone: (clonedDoc: Document) => {
        const inputs = clonedDoc.querySelectorAll('input');
        inputs.forEach((input) => {
          // Explicitly set the value attribute to the current value property
          input.setAttribute('value', input.value);
        });
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    // Generate PDF as a Blob directly
    // @ts-ignore - html2pdf is loaded via CDN
    const pdfBlob = await window.html2pdf()
      .from(element)
      .set(opt)
      .output('blob');

    if (!pdfBlob) {
      throw new Error('Failed to generate PDF Blob');
    }

    // Create a File object from the Blob
    const file = new File([pdfBlob], options.filename, { type: 'application/pdf' });

    // Check if Web Share API is supported and can share files
    const canShare = navigator.canShare && navigator.canShare({ files: [file] });

    if (navigator.share && canShare) {
      await navigator.share({
        files: [file],
        title: options.title,
        text: options.text,
      });
      console.log('Shared successfully');
    } else {
      // Fallback: Just download the file if sharing is not supported
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Optional: Inform user
      // alert('تم تحميل الملف لأن جهازك لا يدعم المشاركة المباشرة.');
    }
  } catch (error: any) {
    // Ignore AbortError (user cancelled share)
    if (error.name !== 'AbortError') {
      console.error('Error generating or sharing PDF:', error);
      throw error;
    }
  }
};