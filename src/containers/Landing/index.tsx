import { styled } from '@mui/material/styles';
import { Balance, Allowance } from '~/containers';

import { DISCLAIMER_HEIGHT, SURROUND_HEIGHT } from '~/utils';

export const Landing = () => {
  return (
    <Container>
      <Balance />
      <Allowance />
    </Container>
  );
};

const Container = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  height: `calc(100vh - ${SURROUND_HEIGHT}rem - ${DISCLAIMER_HEIGHT}rem)`,
  padding: '0 8rem',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});
