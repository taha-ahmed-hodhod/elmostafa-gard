import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Share2, Columns, Minus } from 'lucide-react';
import Button from './Button';
import { generateAndSharePDF } from '../services/pdfService';
import { TableState } from '../types';

const STORAGE_KEY = 'sharetable_data_v1';

const TableEditor: React.FC = () => {
  const [isSharing, setIsSharing] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Initial State: Load from LocalStorage or use Default
  const [state, setState] = useState<TableState>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to load table data from storage:', error);
    }
    // Default fallback if no data exists
    return {
      headers: ['الاسم', 'مخزن تحت السكة', 'مخزن محسوب'],
      rows: [
        ['منتج 1', '0', '0'],
        ['منتج 2', '0', '0']
      ]
    };
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // --- Actions ---

  const addRow = () => {
    const newRow = new Array(state.headers.length).fill('');
    setState(prev => ({ ...prev, rows: [...prev.rows, newRow] }));
  };

  const removeRow = () => {
    if (state.rows.length === 0) return;
    setState(prev => ({ ...prev, rows: prev.rows.slice(0, -1) }));
  };

  const addColumn = () => {
    setState(prev => ({
      headers: [...prev.headers, `عنوان ${prev.headers.length + 1}`],
      rows: prev.rows.map(row => [...row, ''])
    }));
  };

  const removeColumn = () => {
    if (state.headers.length <= 1) return;
    setState(prev => ({
      headers: prev.headers.slice(0, -1),
      rows: prev.rows.map(row => row.slice(0, -1))
    }));
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...state.headers];
    newHeaders[index] = value;
    setState(prev => ({ ...prev, headers: newHeaders }));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...state.rows];
    newRows[rowIndex] = [...newRows[rowIndex]]; // Copy row
    newRows[rowIndex][colIndex] = value;
    setState(prev => ({ ...prev, rows: newRows }));
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await generateAndSharePDF('printable-area', {
        filename: 'هدهد.pdf',
        title: 'هدهد',
        text: 'إليك ملف PDF يحتوي على الجدول الذي قمت بإنشائه.'
      });
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء إنشاء ملف PDF.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4 md:p-6">
      
      {/* Action Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-3 justify-between items-center sticky top-4 z-10 backdrop-blur-md bg-opacity-90">
        <div className="flex flex-wrap gap-2">
          <Button onClick={addRow} variant="secondary" icon={<Plus size={18} />}>
            صف
          </Button>
          <Button onClick={removeRow} variant="danger" disabled={state.rows.length === 0} icon={<Minus size={18} />}>
            صف
          </Button>
          <div className="w-px h-8 bg-gray-300 mx-2 hidden md:block"></div>
          <Button onClick={addColumn} variant="secondary" icon={<Columns size={18} />}>
            عمود +
          </Button>
          <Button onClick={removeColumn} variant="ghost" disabled={state.headers.length <= 1} icon={<Trash2 size={18} />}>
            عمود -
          </Button>
        </div>

        <Button 
          onClick={handleShare} 
          variant="primary" 
          isLoading={isSharing}
          icon={<Share2 size={18} />}
          className="w-full md:w-auto"
        >
          {isSharing ? 'جاري التحضير...' : 'تحويل ومشاركة PDF'}
        </Button>
      </div>

      {/* Printable Area Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div id="printable-area" className="p-4 md:p-8 bg-white" ref={tableRef}>
          
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">المصطفي</h1>
            <p className="text-gray-500 text-sm">للمصنوعات الخشبية والموبليا الحديثة</p>
          </div>

          <div className="overflow-x-auto pb-4">
            <table className="w-full border-collapse border border-gray-300 text-right">
              <thead>
                <tr className="bg-gray-100">
                  {state.headers.map((header, idx) => (
                    <th key={`h-${idx}`} className="border border-gray-300 p-3 min-w-[140px]">
                      <input 
                        type="text" 
                        value={header}
                        onChange={(e) => updateHeader(idx, e.target.value)}
                        className="w-full bg-transparent font-bold text-gray-800 outline-none text-center placeholder-gray-400 focus:text-blue-600 h-10 text-lg md:text-base"
                        placeholder="عنوان"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.rows.map((row, rIdx) => (
                  <tr key={`r-${rIdx}`} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cIdx) => (
                      <td key={`c-${rIdx}-${cIdx}`} className="border border-gray-300 p-3">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                          className="w-full bg-transparent text-gray-700 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-100 rounded px-1 h-10 text-lg md:text-base"
                          placeholder="..."
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {state.rows.length === 0 && (
            <div className="text-center py-8 text-gray-400 italic">
              الجدول فارغ. أضف صفوفاً للبدء.
            </div>
          )}

        </div>
      </div>
      
      <div className="text-center text-gray-400 text-xs mt-4">
        * نصيحة: يتم حفظ بياناتك تلقائياً على هذا المتصفح.
      </div>
    </div>
  );
};

export default TableEditor;