
export type Jenjang = 'MI' | 'MTs' | 'MA';

export type Pedagogis = 'Inkuiri-Discovery' | 'PjBL' | 'Cooperative Learning' | 'Experiential Learning (ARKA)';

export type Dimensi = 
  | 'Keimanan & Ketakwaan' 
  | 'Kewargaan' 
  | 'Penalaran Kritis' 
  | 'Kreativitas' 
  | 'Kolaborasi' 
  | 'Kemandirian' 
  | 'Kesehatan' 
  | 'Komunikasi';

export type TemaKBC = 
  | 'Cinta Allah & Rasul-Nya' 
  | 'Cinta Ilmu' 
  | 'Cinta Lingkungan' 
  | 'Cinta Diri & Sesama Manusia' 
  | 'Cinta Tanah Air';

export interface MeetingPedagogy {
  meetingNo: number;
  practice: Pedagogis;
}

export interface RPMFormData {
  schoolName: string;
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
  jenjang: Jenjang;
  className: string;
  subject: string;
  learningOutcome: string; // CP
  learningObjective: string; // TP
  material: string;
  meetingCount: number;
  durationPerMeeting: string;
  pedagogies: MeetingPedagogy[];
  dimensions: Dimensi[];
  kbcThemes: TemaKBC[];
  kbcMaterial: string;
}

export interface GeneratedRPM {
  identitas: {
    schoolName: string;
    subject: string;
    classSemester: string;
    duration: string;
  };
  identifikasi: {
    siswa: string;
    materi: string;
    dimensi: string;
  };
  desain: {
    cp: string;
    lintasDisiplin: string;
    tp: string;
    topik: string;
    pedagogis: string;
    kemitraan: string;
    lingkungan: string;
    digital: string;
  };
  pengalaman: {
    memahami: string;
    mengaplikasi: string;
    refleksi: string;
  };
  asesmen: {
    awal: string;
    proses: string;
    akhir: string;
  };
}
