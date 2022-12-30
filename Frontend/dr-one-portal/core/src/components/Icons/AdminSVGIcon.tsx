import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import SvgIcon from '@material-ui/core/SvgIcon';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > svg': {
            margin: theme.spacing(1),
            flexGrow: theme.spacing(1)
        },

    },
}));

function AdminIcon(props) {
    return (
        <SvgIcon {...props} className="MuiSvgIcon-root" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 14.12C15.1186 14.12 15.62 13.6186 15.62 13C15.62 12.3814 15.1186 11.88 14.5 11.88C13.8814 11.88 13.38 12.3814 13.38 13C13.38 13.6186 13.8814 14.12 14.5 14.12Z" fill="white" />
            <path d="M15.5 8.59V3.77L8 0.5L0.5 3.77V8.68C0.5 13.22 3.7 17.47 8 18.5C8.55 18.37 9.08 18.18 9.6 17.95C10.68 19.49 12.47 20.5 14.5 20.5C17.81 20.5 20.5 17.81 20.5 14.5C20.5 11.53 18.34 9.07 15.5 8.59ZM8.5 14.5C8.5 15.06 8.58 15.61 8.73 16.12C8.49 16.23 8.25 16.34 8 16.42C4.83 15.42 2.5 12.18 2.5 8.68V5.08L8 2.68L13.5 5.08V8.59C10.66 9.07 8.5 11.53 8.5 14.5ZM14.5 18.5C12.29 18.5 10.5 16.71 10.5 14.5C10.5 12.29 12.29 10.5 14.5 10.5C16.71 10.5 18.5 12.29 18.5 14.5C18.5 16.71 16.71 18.5 14.5 18.5Z" fill="white" />
            <path d="M14.5 15C13.77 15 12.31 15.36 12.26 16.08C12.76 16.79 13.58 17.25 14.5 17.25C15.42 17.25 16.24 16.79 16.74 16.08C16.69 15.36 15.23 15 14.5 15Z" fill="white" />
        </SvgIcon>
    );
}

export default function AdminSVGIcon(props) {
    const classes = useStyles();
    return (
        // <div {...props} className={classes.root} style={{ opacity: (props.opacity && props.rowNumber === 4)? '' : props.navigate ? '0.5' : '' }} >
            <AdminIcon {...props} style={{ fontSize: 30, width: 24, height: 25 }} />
        // </div >
    );
}
