import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import SvgIcon from '@material-ui/core/SvgIcon';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > svg': {
            // margin: theme.spacing(1),
            // flexGrow: theme.spacing(0)
        },

    },
}));

function OopbSVG(props) {
    return (
        <SvgIcon {...props} className="MuiSvgIcon-root" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" d="M17 3.5H7V4.5H17V3.5Z" fill="#F3F3F3" />
            <path opacity="0.3" d="M17 20.5H7V21.5H17V20.5Z" fill="#F3F3F3" />
            <path d="M17 1.5H7C5.9 1.5 5 2.4 5 3.5V21.5C5 22.6 5.9 23.5 7 23.5H17C18.1 23.5 19 22.6 19 21.5V3.5C19 2.4 18.1 1.5 17 1.5ZM7 4.5V3.5H17V4.5H7ZM7 18.5V6.5H17V18.5H7ZM7 21.5V20.5H17V21.5H7Z" fill="#F3F3F3" />
            <path d="M16 7.5H8V9.5H16V7.5Z" fill="#F3F3F3" />
        </SvgIcon>
    );
}

export default function OopbSVGIcon(props) {
    const classes = useStyles();
    return (
        // <div {...props} className={classes.root} style={{ opacity: (props.opacity && props.rowNumber === 3) ? '' : props.navigate ? '0.5' : '' }}>
            <OopbSVG {...props} style={{ fontSize: 30, width: 24, height: 25 }} />
        // </div >
    );
}
