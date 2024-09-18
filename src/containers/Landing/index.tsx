import { styled } from '@mui/material/styles';

import { Notification } from '~/components';
import { Balance, Allowance, Transfer, FunctionsTab, Mint, Logs } from '~/containers';
import { DISCLAIMER_HEIGHT, SURROUND_HEIGHT } from '~/utils';

export const Landing = () => {
  return (
    <Layout data-testid='landing'>
      <Notification />
      <Container>
        <Balance />
        <FunctionsTab
          tabs={[
            { label: 'Allowance', component: <Allowance /> },
            { label: 'Transfer', component: <Transfer /> },
            { label: 'Mint', component: <Mint /> },
          ]}
        />
      </Container>
      <Container>
        <Logs />
      </Container>
    </Layout>
  );
};

const Layout = styled('main')({
  position: 'relative',
  display: 'flex',
  gap: '1rem',
  height: `calc(100vh - ${SURROUND_HEIGHT}rem - ${DISCLAIMER_HEIGHT}rem)`,
  padding: '2rem 8rem',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});
