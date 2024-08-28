import { styled } from '@mui/material/styles';

import { Notification } from '~/components';
import { Balance, Allowance, Transfer, FunctionsTab } from '~/containers';
import { DISCLAIMER_HEIGHT, SURROUND_HEIGHT } from '~/utils';

export const Landing = () => {
  return (
    <Container>
      <Notification />
      <Balance />
      <FunctionsTab
        tabs={[
          { label: 'Allowance', component: <Allowance /> },
          { label: 'Transfer', component: <Transfer /> },
        ]}
      />
    </Container>
  );
};

const Container = styled('main')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  height: `calc(100vh - ${SURROUND_HEIGHT}rem - ${DISCLAIMER_HEIGHT}rem)`,
  padding: '0 8rem',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});
