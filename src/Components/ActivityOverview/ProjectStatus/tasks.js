import { COLUMN_NAMES } from './constants';
const {
  PendingDataCollection,
  PendingQuotes,
  UnassignedToEditor,
  RunningProjects,
  INcheckingProjects,
  ExportProjects,
  CompleteProjects,
  ReworkProjects,
} = COLUMN_NAMES;

export const tasks = [
  { id: 1, name: 'ABC Company', column: PendingDataCollection },
  { id: 2, name: 'DEF Company', column: PendingQuotes },
  { id: 3, name: 'GHI Company', column: UnassignedToEditor },
  { id: 4, name: 'JKL Company', column: RunningProjects },
  { id: 5, name: 'MNO Company', column: INcheckingProjects },
  { id: 6, name: 'PQR Company', column: ExportProjects },
  { id: 7, name: 'STU Company', column: CompleteProjects },
  { id: 8, name: 'VWX Company', column: ReworkProjects },
  { id: 9, name: 'BCD Company', column: PendingDataCollection },
  { id: 10, name: 'EFG Company', column: PendingQuotes },
  { id: 11, name: 'HIJ Company', column: UnassignedToEditor },
  { id: 12, name: 'KLM Company', column: RunningProjects },
  { id: 13, name: 'NOP Company', column: RunningProjects },
  { id: 14, name: 'QRS Company', column: ExportProjects },
  { id: 15, name: 'TUV Company', column: CompleteProjects },
  { id: 16, name: 'WXY Company', column: PendingDataCollection },
];
