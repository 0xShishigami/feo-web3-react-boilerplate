import { useCallback, useEffect } from 'react';
import { Alert, Link, Snackbar, styled } from '@mui/material';

import { NotificationActionTypes } from '~/providers';
import { useCustomTheme, useNotificationContext } from '~/hooks';

export const Notification = () => {
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
    <StyledSnackbar
      open={visible}
      autoHideDuration={timeout}
      message={message}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <StyledAlert onClose={clearNotification} severity={severity} variant='filled'>
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
    </StyledSnackbar>
  );
};

const StyledSnackbar = styled(Snackbar)(() => {
  return {
    position: 'absolute',
  };
});

const StyledAlert = styled(Alert)(({ theme, severity }) => {
  const { currentTheme } = useCustomTheme();
  return {
    width: '100%',
    border: currentTheme.border,
    borderColor: theme.palette[severity!].dark,
    background: currentTheme.backgroundPrimary,
    borderRadius: '1.25rem',
    color: currentTheme.textPrimary,
  };
});
