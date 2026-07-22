import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import {
  UploadCloud, FileText, Cpu, CheckCircle2, ShieldAlert,
  ArrowRight, Activity, Calendar, Info, LogOut, CreditCard, Settings, Search, Trash2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const AiReportScanner: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Uploader states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [reportResult, setReportResult] = useState<any | null>(null);
  const [reportsHistory, setReportsHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchReportsHistory();
  }, []);

  const fetchReportsHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await api.get('/ai/reports');
      setReportsHistory(response.data);
    } catch (err) {
      console.error('Failed to load report history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg('');
      setReportResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setErrorMsg('');
      setReportResult(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select or drag a medical report first.');
      return;
    }

    setScanning(true);
    setErrorMsg('');
    setProgressText('Extracting text and scanning parameters...');

    const formData = new FormData();
    formData.append('report', selectedFile);

    try {
      // Transition loading texts to simulate high-fidelity AI pipeline
      setTimeout(() => setProgressText('Sending data to OpenRouter Vision model...'), 1500);
      setTimeout(() => setProgressText('Analyzing chemical markers and reference ranges...'), 3500);
      setTimeout(() => setProgressText('Generating final patient-friendly summaries...'), 5500);

      const response = await api.post('/ai/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setReportResult(response.data.analysis);
      fetchReportsHistory(); // Refresh history list
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'AI analysis failed. Please verify OpenRouter key config.');
    } finally {
      setScanning(false);
      setProgressText('');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark-900 border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">OneHealthCard</span>
          </div>

          <nav className="flex flex-col gap-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <CreditCard className="h-4 w-4" /> My Health Card
            </Link>
            <Link to="/doctor-finder" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <Search className="h-4 w-4" /> Find Doctors
            </Link>
            <Link to="/report-scanner" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold transition-all">
              <FileText className="h-4 w-4" /> AI Report Scanner
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <Settings className="h-4 w-4" /> Account Settings
            </Link>
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 text-sm font-semibold transition-all border border-transparent mt-8">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="text-left flex flex-col gap-8">
          
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-primary-400 font-sans">INTELLIGENT OCR</span>
            <h1 className="text-3xl font-extrabold text-white mt-1 mb-0">AI Lab Report Scanner</h1>
            <p className="text-slate-400 text-sm">Upload medical laboratory test reports to receive summaries and parameter breakdowns.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Upload and Result display */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Drag/Drop Box */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full rounded-2xl glass border border-dashed border-white/10 hover:border-primary-500/40 p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors select-none"
              >
                {/* Custom laser line scan animation if active */}
                {scanning && <div className="absolute left-0 right-0 laser-line pointer-events-none" />}

                <UploadCloud className={`h-12 w-12 mb-3 transition-colors ${selectedFile ? 'text-primary-400' : 'text-slate-600'}`} />
                
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">{selectedFile.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">Drag and drop your report image here</p>
                    <p className="text-slate-500 text-xs mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                )}

                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <label
                  htmlFor="file-upload"
                  className="mt-5 px-4 py-2 text-xs font-bold bg-slate-800 text-white rounded-xl hover:bg-slate-700 cursor-pointer transition-colors border border-white/5 active:scale-95"
                >
                  Choose File
                </label>
              </div>

              {/* Action scanner button */}
              {selectedFile && !reportResult && (
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-cyan-500 text-white font-bold rounded-xl hover:from-primary-500 hover:to-cyan-400 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {scanning ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{progressText}</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="h-4.5 w-4.5" /> Analyze with OpenRouter AI
                    </>
                  )}
                </button>
              )}

              {/* Error Callout */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-3 items-center">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Result analysis block */}
              {reportResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl glass-card border border-white/10 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">Analysis Completed</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Parsed via OpenRouter Gemini</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1.5">Overview Summary</h4>
                    <p className="text-xs text-slate-200 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {reportResult.summary}
                    </p>
                  </div>

                  {/* Detected Parameters Table */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Extracted Parameters</h4>
                    <div className="overflow-x-auto rounded-xl border border-white/5">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900/60 text-slate-400 border-b border-white/5 font-semibold">
                            <th className="py-2.5 px-3">Marker Parameter</th>
                            <th className="py-2.5 px-3">Result Value</th>
                            <th className="py-2.5 px-3">Normal Range</th>
                            <th className="py-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {reportResult.detectedParameters?.map((param: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/5 text-slate-200">
                              <td className="py-2.5 px-3 font-semibold">{param.parameter}</td>
                              <td className="py-2.5 px-3 font-mono">{param.value}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-400">{param.range}</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                  param.status === 'normal' ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' :
                                  param.status === 'high' ? 'bg-amber-500/10 border border-amber-500/25 text-amber-400' :
                                  param.status === 'low' ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400' :
                                  'bg-slate-800 text-slate-400'
                                }`}>
                                  {param.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
                      <h5 className="font-bold text-teal-400 mb-2">Suggestions & Lifestyle</h5>
                      <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                        {reportResult.suggestions?.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                      <h5 className="font-bold text-rose-400 mb-2">Clinical Warnings & Flags</h5>
                      <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                        {reportResult.warnings?.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Medical Disclaimer */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-400/80 flex gap-2.5 items-start">
                    <Info className="h-4.5 w-4.5 shrink-0" />
                    <span>This AI summary is generated via OCR analysis and is only for informational purposes. It should not replace professional clinical evaluation or medical advice.</span>
                  </div>

                </motion.div>
              )}

            </div>

            {/* Right: History Timeline List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 m-0">Scanned Documents</h4>
              
              {loadingHistory ? (
                <div className="py-6 text-center text-xs text-slate-500">Loading history...</div>
              ) : reportsHistory.length === 0 ? (
                <div className="p-6 rounded-2xl glass border border-white/5 text-center text-xs text-slate-500">
                  No previously scanned records.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reportsHistory.map((rep: any) => (
                    <div
                      key={rep._id}
                      onClick={() => setReportResult({
                        summary: rep.summary,
                        detectedParameters: JSON.parse(rep.extractedText || '[]'),
                        explanation: rep.explanation,
                        suggestions: rep.suggestions?.split('\n') || [],
                        warnings: rep.warnings?.split('\n') || []
                      })}
                      className="p-3.5 rounded-xl glass border border-white/5 hover:border-primary-500/25 transition-all text-left text-xs cursor-pointer flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-bold text-white m-0 truncate max-w-[150px]">{rep.reportName}</p>
                          <span className="text-[9px] text-slate-500">{new Date(rep.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
