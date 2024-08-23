import { styled } from '@mui/material/styles';
import Notification from '~/components/Notification';
import { Balance, Allowance } from '~/containers';

import { DISCLAIMER_HEIGHT, SURROUND_HEIGHT } from '~/utils';

export const Landing = () => {
  return (
    <Container>
      <Notification />
      <Balance />
      <Allowance />
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
