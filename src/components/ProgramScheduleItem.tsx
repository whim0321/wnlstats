import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from '@mui/material';
import { Program, Caster, Forecaster, Schedule } from '../types';

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
  onScheduleChange,
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

export default ProgramScheduleItem;