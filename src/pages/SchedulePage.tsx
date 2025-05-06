import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Button,
} from '@mui/material';
import { Program, Caster, Forecaster, Schedule } from '../types';
import ProgramScheduleItems from '../components/ProgramScheduleItems';

// 仮のAPI呼び出し関数 (実際には api.ts などで実装)
const fetchPrograms = async (): Promise<Program[]> => {
  // GET /programs の実装 (ダミーデータ)
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return [
    { id: 'p1', name: 'モーニング' },
    { id: 'p2', name: 'アフタヌーン' },
    { id: 'p3', name: 'イブニング' },
  ];
};

const fetchCasters = async (): Promise<Caster[]> => {
  // GET /casters の実装 (ダミーデータ)
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 'c1', name: 'キャスターA' },
    { id: 'c2', name: 'キャスターB' },
    { id: 'c3', name: 'キャスターC' },
  ];
};

const fetchForecasters = async (): Promise<Forecaster[]> => {
  // GET /forecasters の実装 (ダミーデータ)
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 'f1', name: '予報士X' },
    { id: 'f2', name: '予報士Y' },
    { id: 'f3', name: '予報士Z' },
  ];
};

const fetchSchedule = async (date: Dayjs): Promise<Schedule[]> => {
  // GET /schedules?date=YYYY-MM-DD の実装 (ダミーデータ)
  console.log(`Fetching schedule for ${date.format('YYYY-MM-DD')}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  // 簡単のため、日付によってダミーデータを返す
  if (date.date() % 2 === 0) {
    return [
      { programId: 'p1', casterId: 'c1', forecasterId: 'f1', hasCrosstalk: true },
      { programId: 'p2', casterId: 'c2', forecasterId: 'f2', hasCrosstalk: false },
      { programId: 'p3', casterId: 'c3', forecasterId: 'f3', hasCrosstalk: true },
    ];
  }
  return []; // 奇数日はデータなし
};

// 仮のスケジュール保存API呼び出し関数
const saveSchedule = async (date: Dayjs, schedule: Schedule[]): Promise<void> => {
  console.log(`Saving schedule for ${date.format('YYYY-MM-DD')}:`, schedule);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // ここで実際のAPI (例: PUT /schedules?date=YYYY-MM-DD) を呼び出す
};

const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [programs, setPrograms] = useState<Program[]>([]);
  const [casters, setCasters] = useState<Caster[]>([]);
  const [forecasters, setForecasters] = useState<Forecaster[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 初期データ取得
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [programsData, castersData, forecastersData] = await Promise.all([
          fetchPrograms(),
          fetchCasters(),
          fetchForecasters(),
        ]);
        setPrograms(programsData);
        setCasters(castersData);
        setForecasters(forecastersData);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        // エラーハンドリングを追加
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 日付選択時にスケジュールを取得
  useEffect(() => {
    const loadSchedule = async () => {
      setLoading(true);
      try {
        const scheduleData = await fetchSchedule(selectedDate);
        setSchedule(scheduleData);
      } catch (error) {
        console.error(`Failed to load schedule for ${selectedDate.format('YYYY-MM-DD')}:`, error);
        setSchedule([]); // エラー時は空にする
      } finally {
        setLoading(false);
      }
    };
    if (programs.length > 0) { // 番組データがないと表示できないため
      loadSchedule();
    }
  }, [selectedDate, programs]); // selectedDate または programs が変更されたら実行

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  // 保存ボタンクリック時のハンドラー
  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      await saveSchedule(selectedDate, schedule);
      // 保存成功時の処理 (例: Snackbar表示など)
      console.log("Schedule saved successfully!");
    } catch (error) {
      console.error("Failed to save schedule:", error);
      // 保存失敗時の処理 (例: エラーメッセージ表示など)
    } finally {
      setIsSaving(false);
    }
  };

  // --- ここから下にJSX (表示部分) を記述 ---
  return (
    <Stack spacing={1} alignItems='stretch' justifyContent={'flex-start'}
      sx={{ pt: 2, pb: 2, maxWidth: 'lg', margin: 'auto', px: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" gutterBottom>
        番組放送スケジュール
      </Typography>

      {/* DatePicker 用の Paper */}
      <Paper sx={{ display: 'flex', justifyContent: 'flex-start', p: 2, my: 1 }}>
        <DatePicker label="日付" value={selectedDate} onChange={handleDateChange} />
      </Paper>

      {/* ローディング表示または番組リスト */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ProgramScheduleItems
          programs={programs}
          schedule={schedule}
          casters={casters}
          forecasters={forecasters}
          setSchedule={setSchedule}
        />
      )}

      {/* 保存ボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSchedule}
          disabled={isSaving || loading}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          スケジュールを保存
        </Button>
      </Box>
    </Stack>
  );
};

export default SchedulePage;