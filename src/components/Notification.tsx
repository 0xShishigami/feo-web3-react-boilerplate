import { useCallback, useEffect } from 'react';
import { Alert, Link, Snackbar, styled } from '@mui/material';

import { NotificationActionTypes } from '~/providers/NotificationProvider/actions';
import { useCustomTheme, useNotificationContext } from '~/hooks';

export default function Notification() {
  const { state, dispatchNotification } = useNotificationContext();
  const { type, message, visible, timeout, link } = state;

  const clearNotification = useCallback(() => {
    dispatchNotification({ type: NotificationActionTypes.CLEAR_NOTIFICATION });
  }, [dispatchNotification]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (visible && timeout > 0) {
      timeoutId = setTimeout(() => {
        clearNotification();
      }, timeout);
    }

    return () => clearTimeout(timeoutId);
  }, [timeout, visible, clearNotification, state]);

  const severity = type === 'loading' ? 'info' : type;

  return (
    <Snackbar
      open={visible}
      autoHideDuration={timeout}
      message={message}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      sx={{ position: 'absolute' }}
    >
      <StyledAlert onClose={clearNotification} severity={severity} variant='filled' sx={{ width: '100%' }}>
        {message}
        {link && (
          <>
            <br />
            <Link href={link.href} target='_blank' rel='noopener noreferrer' underline='hover'>
              {link.text}
            </Link>
          </>
        )}
      </StyledAlert>
    </Snackbar>
  );
}

const StyledAlert = styled(Alert)(({ theme, severity }) => {
  const { currentTheme } = useCustomTheme();
  return {
    border: currentTheme.border,
    borderColor: theme.palette[severity!].dark,
    background: currentTheme.backgroundPrimary,
    borderRadius: '1.25rem',
    color: currentTheme.textPrimary,
  };
});
