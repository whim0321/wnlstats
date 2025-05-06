// /programs API のレスポンス型 (仮)
export interface Program {
    id: string;
    name: string;
  }
  
  // /casters API のレスポンス型 (仮)
  export interface Caster {
    id: string;
    name: string;
  }
  
  // /forecasters API のレスポンス型 (仮)
  export interface Forecaster {
    id: string;
    name: string;
  }
  
  // /schedules API のレスポンス型 (仮)
  export interface Schedule {
    programId: string; // 番組IDで紐付ける想定
    casterId?: string | null;
    forecasterId?: string | null;
    hasCrosstalk?: boolean;
  }