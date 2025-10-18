import { CheckCircle } from '@mui/icons-material'
import { Alert, Snackbar } from '@mui/material'

const CustomSnackbar = ({
	open,
	onClose,
	message,
	severity = 'success',
	autoHideDuration = 3000
}) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
		>
			<Alert
				variant="filled"
				severity={severity}
				icon={severity === 'success' ? <CheckCircle /> : undefined}
				sx={{
					width: '100%',
					minWidth: '300px',
					fontSize: '1rem',
					'& .MuiAlert-message': {
						fontSize: '1rem'
					}
				}}
			>
				{message}
			</Alert>
		</Snackbar>
	)
}

export default CustomSnackbar
