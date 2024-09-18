import { useState } from 'react';
import { Box, styled, Tab, Tabs } from '@mui/material';

import { useCustomTheme } from '~/hooks';
import { FORM_MIN_WIDTH } from '~/utils';

interface FunctionsTabProps {
  tabs: {
    label: string;
    component: JSX.Element;
  }[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const FunctionsTab = ({ tabs }: FunctionsTabProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_: unknown, index: number) => {
    setValue(index);
  };

  return (
    <TabCard data-testid='functions-tab'>
      <StyledTabs value={value} onChange={handleChange} aria-label='functions tabs' centered>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.label}
            label={tab.label}
            disableRipple
            data-testid={`tab-item-${tab.label}`}
            {...a11yProps(index)}
          />
        ))}
      </StyledTabs>
      {tabs.map((tab, index) => (
        <CustomTabPanel key={tab.label} value={value} index={index} data-testid={`tab-panel-${tab.label}`}>
          {tab.component}
        </CustomTabPanel>
      ))}
    </TabCard>
  );
};

const TabCard = styled('div')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    width: 'min-content',
    minWidth: `${FORM_MIN_WIDTH}rem`,
    boxShadow: currentTheme.cardBoxShadow,
    padding: '2rem',
    borderRadius: currentTheme.borderRadius,
  };
});

const StyledTabs = styled(Tabs)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    '.MuiTab-root': {
      color: currentTheme.textSecondary,
    },
    '.MuiButtonBase-root.Mui-selected': {
      color: currentTheme.textPrimary,
    },
    '.MuiTabs-indicator': {
      backgroundColor: currentTheme.textPrimary,
    },
  };
});
