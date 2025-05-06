import React from 'react';
import {
  Stack,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import { Program, Caster, Forecaster, Schedule } from '../types';

// --- ProgramScheduleItem (子コンポーネント) ---
interface ProgramScheduleItemProps {
  program: Program;
  scheduleItem: Schedule | undefined;
  casters: Caster[];
  forecasters: Forecaster[];
  onScheduleChange: (
    programId: string,
    field: keyof Omit<Schedule, 'programId'>,
    value: string | boolean | null
  ) => void;
}

const ProgramScheduleItem: React.FC<ProgramScheduleItemProps> = ({
  program,
  scheduleItem,
  casters,
  forecasters,
  onScheduleChange, // props から受け取る
}) => {
  const currentCasterId = scheduleItem?.casterId ?? '';
  const currentForecasterId = scheduleItem?.forecasterId ?? '';
  const currentHasCrosstalk = scheduleItem?.hasCrosstalk ?? false;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography align="left" variant="h6" gutterBottom>
        {program.name}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {/* キャスター選択 */}
        <FormControl margin="dense" sx={{ flexGrow: 1 }}>
          <InputLabel id={`caster-select-label-${program.id}`}>
            担当キャスター
          </InputLabel>
          <Select
            labelId={`caster-select-label-${program.id}`}
            id={`caster-select-${program.id}`}
            value={currentCasterId}
            label="担当キャスター"
            onChange={(e: SelectChangeEvent<string>) =>
              onScheduleChange(program.id, 'casterId', e.target.value)
            }
          >
            <MenuItem value="">
              <em>未設定</em>
            </MenuItem>
            {casters.map((caster) => (
              <MenuItem key={caster.id} value={caster.id}>
                {caster.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 予報士選択 */}
        <FormControl margin="dense" sx={{ flexGrow: 1 }}>
          <InputLabel id={`forecaster-select-label-${program.id}`}>
            担当予報士
          </InputLabel>
          <Select
            labelId={`forecaster-select-label-${program.id}`}
            id={`forecaster-select-${program.id}`}
            value={currentForecasterId}
            label="担当予報士"
            onChange={(e: SelectChangeEvent<string>) =>
              onScheduleChange(program.id, 'forecasterId', e.target.value)
            }
          >
            <MenuItem value="">
              <em>未設定</em>
            </MenuItem>
            {forecasters.map((forecaster) => (
              <MenuItem key={forecaster.id} value={forecaster.id}>
                {forecaster.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* クロストークチェックボックス */}
        <FormControlLabel
          control={
            <Checkbox
              checked={currentHasCrosstalk}
              onChange={(e) =>
                onScheduleChange(program.id, 'hasCrosstalk', e.target.checked)
              }
            />
          }
          label="クロストーク"
        />
      </Stack>
    </Paper>
  );
};

// --- ProgramScheduleItems (親コンポーネント) ---
interface ProgramScheduleItemsProps {
  programs: Program[];
  schedule: Schedule[];
  casters: Caster[];
  forecasters: Forecaster[];
  setSchedule: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

const ProgramScheduleItems: React.FC<ProgramScheduleItemsProps> = ({
  programs,
  schedule,
  casters,
  forecasters,
  setSchedule,
}) => {
  const handleScheduleChange = (
    programId: string,
    field: keyof Omit<Schedule, 'programId'>,
    value: string | boolean | null
  ) => {
    setSchedule(prevSchedule => {
      const existingScheduleIndex = prevSchedule.findIndex(s => s.programId === programId);
      let newScheduleArray = [...prevSchedule];

      if (existingScheduleIndex > -1) {
        const updatedEntry = {
          ...newScheduleArray[existingScheduleIndex],
          [field]: value === '' ? null : value,
        };
        newScheduleArray[existingScheduleIndex] = updatedEntry;
      } else {
        const newEntry: Schedule = {
          programId: programId,
          casterId: field === 'casterId' ? (value as string) : null,
          forecasterId: field === 'forecasterId' ? (value as string) : null,
          hasCrosstalk: field === 'hasCrosstalk' ? (value as boolean) : false,
        };
        newScheduleArray.push(newEntry);
      }
      return newScheduleArray;
    });
    console.log(`Schedule updated in ProgramScheduleItems for ${programId}: ${field} = ${value}`);
  };

  return (
    <Stack spacing={1}>
      {programs.map((program) => {
        const programSchedule = schedule.find(s => s.programId === program.id);
        return (
          <ProgramScheduleItem
            key={program.id}
            program={program}
            scheduleItem={programSchedule}
            casters={casters}
            forecasters={forecasters}
            onScheduleChange={handleScheduleChange}
          />
        );
      })}
    </Stack>
  );
};

export default ProgramScheduleItems;
