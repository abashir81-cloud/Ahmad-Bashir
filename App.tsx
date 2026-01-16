
import React, { useState, useEffect } from 'react';
import { 
  RPMFormData, 
  GeneratedRPM, 
  Jenjang, 
  Dimensi, 
  TemaKBC, 
  Pedagogis, 
  MeetingPedagogy 
} from './types';
import { generateRPMContent } from './services/geminiService';
import { InputGroup } from './components/InputGroup';
import { 
  PlusCircle, 
  Trash2, 
  BookOpen, 
  FileText, 
  Loader2, 
  Printer, 
  Download,
  Info
} from 'lucide-react';

const APP_TITLE = "Generator RPM";

const JENJANG_OPTIONS: Jenjang[] = ['MI', 'MTs', 'MA'];
const DIMENSI_OPTIONS: Dimensi[] = [
  'Keimanan & Ketakwaan', 'Kewargaan', 'Penalaran Kritis', 'Kreativitas', 
  'Kolaborasi', 'Kemandirian', 'Kesehatan', 'Komunikasi'
];
const TEMA_KBC_OPTIONS: TemaKBC[] = [
  'Cinta Allah & Rasul-Nya', 'Cinta Ilmu', 'Cinta Lingkungan', 
  'Cinta Diri & Sesama Manusia', 'Cinta Tanah Air'
];
const PEDAGOGIS_OPTIONS: Pedagogis[] = [
  'Inkuiri-Discovery', 'PjBL', 'Cooperative Learning', 'Experiential Learning (ARKA)'
];

const App: React.FC = () => {
  const [formData, setFormData] = useState<RPMFormData>({
    schoolName: '',
    teacherName: '',
    teacherNip: '',
    principalName: '',
    principalNip: '',
    jenjang: 'MI',
    className: '',
    subject: '',
    learningOutcome: '',
    learningObjective: '',
    material: '',
    meetingCount: 1,
    durationPerMeeting: '',
    pedagogies: [{ meetingNo: 1, practice: 'Inkuiri-Discovery' }],
    dimensions: [],
    kbcThemes: [],
    kbcMaterial: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedRPM | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMeetingCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 1;
    setFormData(prev => {
      const newPedagogies = [...prev.pedagogies];
      if (count > newPedagogies.length) {
        for (let i = newPedagogies.length + 1; i <= count; i++) {
          newPedagogies.push({ meetingNo: i, practice: 'Inkuiri-Discovery' });
        }
      } else {
        newPedagogies.length = count;
      }
      return { ...prev, meetingCount: count, pedagogies: newPedagogies };
    });
  };

  const handlePedagogyChange = (index: number, practice: Pedagogis) => {
    setFormData(prev => {
      const newPedagogies = [...prev.pedagogies];
      newPedagogies[index].practice = practice;
      return { ...prev, pedagogies: newPedagogies };
    });
  };

  const handleMultiSelect = (field: 'dimensions' | 'kbcThemes', value: any) => {
    setFormData(prev => {
      const current = prev[field] as any[];
      const exists = current.includes(value);
      if (exists) {
        return { ...prev, [field]: current.filter(i => i !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generated = await generateRPMContent(formData);
      setResult(generated);
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError("Gagal menghasilkan RPM. Pastikan API Key Anda valid dan coba lagi.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-emerald-700 text-white py-8 px-6 no-print shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <BookOpen size={40} className="text-emerald-200" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{APP_TITLE}</h1>
            <p className="text-emerald-100 opacity-90">Pembuat Perencanaan Pembelajaran Mendalam Otomatis</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        {/* Input Form Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 no-print">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Data Input Perencanaan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-emerald-700 border-l-4 border-emerald-500 pl-2 text-sm uppercase tracking-wider mb-4">Profil Satuan Pendidikan</h3>
              <InputGroup label="Nama Satuan Pendidikan" required>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="Contoh: MIN 1 Jakarta"
                />
              </InputGroup>
              
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Jenjang" required>
                  <select
                    name="jenjang"
                    value={formData.jenjang}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {JENJANG_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </InputGroup>
                <InputGroup label="Kelas" required>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Contoh: VII-A"
                  />
                </InputGroup>
              </div>

              <InputGroup label="Mata Pelajaran (Mapel)" required>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Contoh: Akidah Akhlak"
                />
              </InputGroup>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-emerald-700 border-l-4 border-emerald-500 pl-2 text-sm uppercase tracking-wider mb-4">Identitas Guru & Kepala</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Nama Guru" required>
                  <input
                    type="text"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </InputGroup>
                <InputGroup label="NIP Guru" required>
                  <input
                    type="text"
                    name="teacherNip"
                    value={formData.teacherNip}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </InputGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Nama Kepala Madrasah" required>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </InputGroup>
                <InputGroup label="NIP Kepala Madrasah" required>
                  <input
                    type="text"
                    name="principalNip"
                    value={formData.principalNip}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="font-semibold text-emerald-700 border-l-4 border-emerald-500 pl-2 text-sm uppercase tracking-wider">Substansi Kurikulum</h3>
            
            <InputGroup label="Capaian Pembelajaran (CP)" required>
              <textarea
                name="learningOutcome"
                rows={3}
                value={formData.learningOutcome}
                onChange={handleInputChange}
                className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Salin Capaian Pembelajaran dari Kurikulum Merdeka..."
              />
            </InputGroup>

            <InputGroup label="Tujuan Pembelajaran (TP)" required>
              <textarea
                name="learningObjective"
                rows={2}
                value={formData.learningObjective}
                onChange={handleInputChange}
                className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Tentukan tujuan utama pembelajaran..."
              />
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Materi Pelajaran" required>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  placeholder="Contoh: Adab Bertetangga"
                />
              </InputGroup>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Jumlah Pertemuan" required>
                  <input
                    type="number"
                    min={1}
                    value={formData.meetingCount}
                    onChange={handleMeetingCountChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </InputGroup>
                <InputGroup label="Durasi (e.g. 2 x 35 menit)" required>
                  <input
                    type="text"
                    name="durationPerMeeting"
                    value={formData.durationPerMeeting}
                    onChange={handleInputChange}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </InputGroup>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                <Info size={16} />
                <span>Pilih Praktik Pedagogis untuk Tiap Pertemuan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.pedagogies.map((p, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-2">
                    <span className="text-xs font-bold text-emerald-600">Pertemuan {p.meetingNo}</span>
                    <select
                      value={p.practice}
                      onChange={(e) => handlePedagogyChange(idx, e.target.value as Pedagogis)}
                      className="text-sm bg-slate-50 border-none focus:ring-0 p-0"
                    >
                      {PEDAGOGIS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">Dimensi Lulusan (Multi-select)</label>
                <div className="flex flex-wrap gap-2">
                  {DIMENSI_OPTIONS.map(dim => (
                    <button
                      key={dim}
                      onClick={() => handleMultiSelect('dimensions', dim)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        formData.dimensions.includes(dim)
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {dim}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">Tema KBC (Multi-select)</label>
                <div className="flex flex-wrap gap-2">
                  {TEMA_KBC_OPTIONS.map(tema => (
                    <button
                      key={tema}
                      onClick={() => handleMultiSelect('kbcThemes', tema)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        formData.kbcThemes.includes(tema)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {tema}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <InputGroup label="Materi Insersi KBC" required>
              <textarea
                name="kbcMaterial"
                rows={2}
                value={formData.kbcMaterial}
                onChange={handleInputChange}
                className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Sebutkan konten karakter yang ingin disisipkan..."
              />
            </InputGroup>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.schoolName || !formData.subject}
              className={`w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg ${
                isGenerating 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sedang Menghasilkan RPM...
                </>
              ) : (
                <>
                  Mulai Generate RPM
                </>
              )}
            </button>
          </div>
        </section>

        {/* Result Preview Section */}
        {result && (
          <section id="result-section" className="space-y-6">
            <div className="flex items-center justify-between no-print">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                Hasil Perencanaan (RPM)
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-md"
                >
                  <Printer size={18} />
                  Cetak PDF
                </button>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 shadow-2xl border border-slate-200 rounded-none overflow-x-auto min-h-screen printable-area">
              <div className="text-center mb-8 uppercase">
                <h1 className="text-2xl font-bold">Perencanaan Pembelajaran Mendalam (RPM)</h1>
                <p className="font-semibold text-lg">{result.identitas.schoolName}</p>
                <div className="h-1 w-full bg-black mt-2 mb-1" />
                <div className="h-0.5 w-full bg-black" />
              </div>

              {/* Table Structure */}
              <table className="w-full border-collapse border border-black text-sm">
                <tbody>
                  {/* 1. Identitas */}
                  <tr className="bg-slate-100">
                    <td colSpan={2} className="border border-black p-2 font-bold uppercase text-center bg-slate-200">I. Identitas</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold w-1/3">Satuan Pendidikan</td>
                    <td className="border border-black p-3">{result.identitas.schoolName}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Mata Pelajaran</td>
                    <td className="border border-black p-3">{result.identitas.subject}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Kelas / Semester</td>
                    <td className="border border-black p-3">{result.identitas.classSemester}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Durasi Pertemuan</td>
                    <td className="border border-black p-3">{result.identitas.duration}</td>
                  </tr>

                  {/* 2. Identifikasi */}
                  <tr className="bg-slate-100">
                    <td colSpan={2} className="border border-black p-2 font-bold uppercase text-center bg-slate-200">II. Identifikasi</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Profil Siswa</td>
                    <td className="border border-black p-3 text-justify leading-relaxed">{result.identifikasi.siswa}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Materi Pelajaran</td>
                    <td className="border border-black p-3 text-justify">{result.identifikasi.materi}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Capaian Dimensi Lulusan</td>
                    <td className="border border-black p-3 text-justify">{result.identifikasi.dimensi}</td>
                  </tr>

                  {/* 3. Desain Pembelajaran */}
                  <tr className="bg-slate-100">
                    <td colSpan={2} className="border border-black p-2 font-bold uppercase text-center bg-slate-200">III. Desain Pembelajaran</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Capaian Pembelajaran</td>
                    <td className="border border-black p-3 text-justify">{result.desain.cp}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Lintas Disiplin Ilmu</td>
                    <td className="border border-black p-3 text-justify">{result.desain.lintasDisiplin}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Tujuan Pembelajaran</td>
                    <td className="border border-black p-3 text-justify">{result.desain.tp}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Topik Pembelajaran</td>
                    <td className="border border-black p-3 font-bold">{result.desain.topik}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Praktik Pedagogis</td>
                    <td className="border border-black p-3 italic">{result.desain.pedagogis}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Kemitraan Pembelajaran</td>
                    <td className="border border-black p-3">{result.desain.kemitraan}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Lingkungan Pembelajaran</td>
                    <td className="border border-black p-3">{result.desain.lingkungan}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Pemanfaatan Digital</td>
                    <td className="border border-black p-3">{result.desain.digital}</td>
                  </tr>

                  {/* 4. Pengalaman Belajar */}
                  <tr className="bg-slate-100">
                    <td colSpan={2} className="border border-black p-2 font-bold uppercase text-center bg-slate-200">IV. Pengalaman Belajar</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Memahami (Kegiatan Awal)</td>
                    <td className="border border-black p-3 text-justify leading-relaxed">{result.pengalaman.memahami}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Mengaplikasi (Kegiatan Inti)</td>
                    <td className="border border-black p-3 text-justify leading-relaxed whitespace-pre-line">{result.pengalaman.mengaplikasi}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Refleksi (Kegiatan Akhir)</td>
                    <td className="border border-black p-3 text-justify leading-relaxed">{result.pengalaman.refleksi}</td>
                  </tr>

                  {/* 5. Asesmen Pembelajaran */}
                  <tr className="bg-slate-100">
                    <td colSpan={2} className="border border-black p-2 font-bold uppercase text-center bg-slate-200">V. Asesmen Pembelajaran</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Asesmen Awal</td>
                    <td className="border border-black p-3">{result.asesmen.awal}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Asesmen Proses</td>
                    <td className="border border-black p-3">{result.asesmen.proses}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 font-semibold">Asesmen Akhir</td>
                    <td className="border border-black p-3">{result.asesmen.akhir}</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div className="mt-12 flex justify-between px-10">
                <div className="text-left flex flex-col items-start gap-1">
                  <p>Mengetahui,</p>
                  <p>Kepala {formData.schoolName}</p>
                  <div className="h-20" />
                  <p className="font-bold underline">{formData.principalName}</p>
                  <p>NIP. {formData.principalNip}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p>, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p>Guru Mata Pelajaran</p>
                  <div className="h-20" />
                  <p className="font-bold underline">{formData.teacherName}</p>
                  <p>NIP. {formData.teacherNip}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm no-print">
        &copy; {new Date().getFullYear()} Generator RPM Deep Learning Madani
      </footer>
    </div>
  );
};

export default App;
