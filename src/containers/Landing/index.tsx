import { styled } from '@mui/material/styles';
import { Balance } from '~/containers';
import { Allownace } from '~/containers/Allowance';

import { DISCLAIMER_HEIGHT, SURROUND_HEIGHT } from '~/utils';

export const Landing = () => {
  return (
    <Container>
      <Balance />
      <Allownace />
    </Container>
  );
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: `calc(100vh - ${SURROUND_HEIGHT}rem - ${DISCLAIMER_HEIGHT}rem)`,
  padding: '0 8rem',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});
