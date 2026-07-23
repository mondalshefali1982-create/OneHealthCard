import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Brain, Loader2, AlertTriangle, CheckCircle, Activity, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';

const AiReportScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const analyze = async () => {
    if (activeTab === 'upload' && !file) {
      showToast('Please upload a file first', 'error');
      return;
    }
    if (activeTab === 'text' && !text.trim()) {
      showToast('Please paste report text first', 'error');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    
    try {
      // Fake delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mocked AI Response
      setResults({
        summary: "The blood test indicates elevated LDL cholesterol levels and slightly high fasting blood sugar. Other parameters including liver and kidney functions are within normal ranges.",
        abnormalities: [
          { name: "LDL Cholesterol", value: "160 mg/dL", ref: "< 100 mg/dL", severity: "high" },
          { name: "Fasting Blood Sugar", value: "115 mg/dL", ref: "70-99 mg/dL", severity: "medium" }
        ],
        vitals: [
          { name: "Hemoglobin", value: "14.5 g/dL", ref: "13.8-17.2 g/dL", status: "normal" },
          { name: "WBC Count", value: "6,500 /mcL", ref: "4,500-11,000 /mcL", status: "normal" },
          { name: "Platelets", value: "250,000 /mcL", ref: "150,000-450,000 /mcL", status: "normal" }
        ],
        recommendations: [
          "Consult a general physician to discuss cholesterol management.",
          "Adopt a diet low in saturated fats and high in fiber.",
          "Incorporate 30 minutes of cardiovascular exercise daily.",
          "Monitor blood sugar levels over the next month."
        ]
      });
      showToast('Analysis complete', 'success');
    } catch (error) {
      showToast('AI analysis failed. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4 shadow-sm">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">AI Medical Report Analyzer</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Upload your lab results or paste report text to get a simplified, easy-to-understand breakdown of your health metrics.</p>
      </div>

      {!results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('upload')} 
              className={`flex-1 py-4 text-sm font-medium transition-colors flex justify-center items-center gap-2 ${activeTab === 'upload' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <UploadCloud className="w-4 h-4" /> Upload PDF/Image
            </button>
            <button 
              onClick={() => setActiveTab('text')} 
              className={`flex-1 py-4 text-sm font-medium transition-colors flex justify-center items-center gap-2 ${activeTab === 'text' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FileText className="w-4 h-4" /> Paste Text
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'upload' ? (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${file ? 'border-primary-400 bg-primary-50/50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'}`}
              >
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,image/*" />
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-primary-500 mb-3" />
                    <p className="font-medium text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button className="mt-4 px-4 py-1.5 bg-white border shadow-sm rounded-lg text-sm font-medium hover:bg-slate-50">Change File</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="font-medium text-slate-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the text from your medical report here..."
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              ></textarea>
            )}

            <button 
              onClick={analyze}
              disabled={isAnalyzing}
              className="w-full mt-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> AI is analyzing...</>
              ) : (
                <><Brain className="w-6 h-6" /> Analyze Report</>
              )}
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="glass-card p-6 border-l-4 border-l-indigo-500">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Brain className="w-5 h-5 text-indigo-500" /> AI Summary</h3>
              <p className="text-slate-700 leading-relaxed">{results.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> Abnormalities</h3>
                {results.abnormalities.map((item: any, i: number) => (
                  <div key={i} className="bg-red-50 border border-red-100 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-red-800">{item.name}</p>
                      <p className="text-xs text-red-600 mt-0.5">Ref: {item.ref}</p>
                    </div>
                    <span className="text-lg font-bold text-red-700 bg-white px-3 py-1 rounded-lg shadow-sm">{item.value}</span>
                  </div>
                ))}

                <h3 className="font-bold text-slate-800 flex items-center gap-2 mt-6 pt-4 border-t border-slate-200"><CheckCircle className="w-5 h-5 text-green-500" /> Normal Ranges</h3>
                {results.vitals.map((item: any, i: number) => (
                  <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Ref: {item.ref}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-600">{item.value}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-sky-500" /> Recommendations</h3>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  {results.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1 bg-sky-100 text-sky-600 rounded-full shrink-0"><ChevronRight className="w-3 h-3" /></div>
                      <p className="text-sm text-slate-700">{rec}</p>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => { setResults(null); setFile(null); setText(''); }}
                  className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Scan Another Report
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiReportScanner;
