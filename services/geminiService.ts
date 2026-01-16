
import { GoogleGenAI, Type } from "@google/genai";
import { RPMFormData, GeneratedRPM } from "../types";

export const generateRPMContent = async (formData: RPMFormData): Promise<GeneratedRPM> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Bertindaklah sebagai pakar pengembang kurikulum dan instruksional pendidikan di Indonesia. 
    Buatlah sebuah Perencanaan Pembelajaran Mendalam (RPM) yang komprehensif berdasarkan data berikut:
    
    Nama Satuan Pendidikan: ${formData.schoolName}
    Jenjang: ${formData.jenjang}
    Kelas: ${formData.className}
    Mata Pelajaran: ${formData.subject}
    Capaian Pembelajaran (CP): ${formData.learningOutcome}
    Tujuan Pembelajaran (TP): ${formData.learningObjective}
    Materi: ${formData.material}
    Jumlah Pertemuan: ${formData.meetingCount}
    Durasi: ${formData.durationPerMeeting}
    Praktik Pedagogis per Pertemuan: ${formData.pedagogies.map(p => `Pertemuan ${p.meetingNo}: ${p.practice}`).join(', ')}
    Dimensi Lulusan: ${formData.dimensions.join(', ')}
    Tema KBC: ${formData.kbcThemes.join(', ')}
    Materi Insersi KBC: ${formData.kbcMaterial}

    Instruksi Khusus untuk tiap bagian:
    1. Identifikasi Siswa: Generate profil karakteristik siswa yang relevan untuk jenjang ${formData.jenjang} kelas ${formData.className} dalam mempelajari materi ini.
    2. Lintas Disiplin Ilmu: Berikan analisis bagaimana materi ini terhubung dengan mata pelajaran lain.
    3. Topik Pembelajaran: Rumuskan topik yang menarik dan sesuai dari materi '${formData.material}'.
    4. Kemitraan Pembelajaran: Sarankan mitra (orang tua, instansi, atau komunitas) yang cocok untuk dilibatkan.
    5. Lingkungan Pembelajaran: Deskripsikan setting kelas atau luar kelas yang mendukung materi ini.
    6. Pemanfaatan Digital: Sebutkan alat digital (seperti Canva, Quizizz, PhET, dll) beserta referensi penggunaannya.
    7. Pengalaman Belajar (WAJIB disesuaikan dengan Sintaks Praktik Pedagogis yang dipilih):
       - Memahami (Awal): Langkah kegiatan pendahuluan yang berkesadaran, bermakna, dan menggembirakan.
       - Mengaplikasi (Inti): Langkah kegiatan inti sesuai sintaks ${formData.pedagogies.map(p => p.practice).join('/')}.
       - Refleksi (Penutup): Langkah penutup yang mencakup refleksi bermakna.
    8. Asesmen:
       - Awal: Berikan contoh instrumen diagnostik/apersepsi.
       - Proses: Berikan contoh rubrik observasi atau panduan diskusi.
       - Akhir: Sebutkan produk/tugas akhir yang sesuai.

    Keluaran harus dalam Bahasa Indonesia yang formal dan benar (EBI), rata kanan-kiri (justified context).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identitas: {
            type: Type.OBJECT,
            properties: {
              schoolName: { type: Type.STRING },
              subject: { type: Type.STRING },
              classSemester: { type: Type.STRING },
              duration: { type: Type.STRING }
            },
            required: ["schoolName", "subject", "classSemester", "duration"]
          },
          identifikasi: {
            type: Type.OBJECT,
            properties: {
              siswa: { type: Type.STRING },
              materi: { type: Type.STRING },
              dimensi: { type: Type.STRING }
            },
            required: ["siswa", "materi", "dimensi"]
          },
          desain: {
            type: Type.OBJECT,
            properties: {
              cp: { type: Type.STRING },
              lintasDisiplin: { type: Type.STRING },
              tp: { type: Type.STRING },
              topik: { type: Type.STRING },
              pedagogis: { type: Type.STRING },
              kemitraan: { type: Type.STRING },
              lingkungan: { type: Type.STRING },
              digital: { type: Type.STRING }
            },
            required: ["cp", "lintasDisiplin", "tp", "topik", "pedagogis", "kemitraan", "lingkungan", "digital"]
          },
          pengalaman: {
            type: Type.OBJECT,
            properties: {
              memahami: { type: Type.STRING },
              mengaplikasi: { type: Type.STRING },
              refleksi: { type: Type.STRING }
            },
            required: ["memahami", "mengaplikasi", "refleksi"]
          },
          asesmen: {
            type: Type.OBJECT,
            properties: {
              awal: { type: Type.STRING },
              proses: { type: Type.STRING },
              akhir: { type: Type.STRING }
            },
            required: ["awal", "proses", "akhir"]
          }
        },
        required: ["identitas", "identifikasi", "desain", "pengalaman", "asesmen"]
      }
    }
  });

  return JSON.parse(response.text);
};
