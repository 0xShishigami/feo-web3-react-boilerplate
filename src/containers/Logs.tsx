import { formatUnits } from 'viem';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useCustomTheme, useToken } from '~/hooks';
import { truncateAddress } from '~/utils';

export const Logs = () => {
  const { logs, tokenSelected } = useToken();

  const rows = logs.map((log) => {
    const target = log.eventName === 'Transfer' ? log.args.to : log.args.spender;
    const truncatedTarget = truncateAddress(target);
    const formattedValue = formatUnits(BigInt(log.args.value), tokenSelected?.decimals ?? 18);

    return {
      id: log.blockNumber?.toString(),
      eventName: log.eventName,
      value: formattedValue,
      target: truncatedTarget,
      blockNumber: log.blockNumber?.toString(),
    };
  });

  const columns = [
    { field: 'eventName', headerName: 'Event' },
    { field: 'value', headerName: 'Value' },
    { field: 'target', headerName: 'Target', width: 180 },
    { field: 'blockNumber', headerName: 'Block number', width: 120 },
  ];

  return (
    <LogsCard>
      <Typography variant='h4'>Transaction Logs</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnResize
        disableColumnMenu
        disableDensitySelector
        disableColumnSorting
        autoPageSize
        density='compact'
        disableAutosize
      />
    </LogsCard>
  );
};

const LogsCard = styled('div')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    width: '100%',
    height: '100%',
    boxShadow: currentTheme.cardBoxShadow,
    padding: '2rem',
    borderRadius: currentTheme.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };
});
