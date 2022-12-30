import React from 'react';

// material-ui
import { makeStyles, withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
	containerTable: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100px',
		width: '100%',
		marginTop: "2.5rem",
		boxShadow: "none"
	},
	specialRow: {
		fontWeight: 900,
		fontSize: '14px',
		color: '#6D7EA6',
		textAlign: 'center'
	},
	normalText: {
		fontWeight: 400,
	},
	titleHeader: {
		fontWeight: 700,
		fontSize: '14px',
	},
	oddRow: {
		backgroundColor: '#F6F8FB'
	},
	evenRow: {
		backgroundColor: 'white'
	}
}));

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: "white",
		},
		'&:nth-of-type(even)': {
			backgroundColor: "grey",
		},
	},
}))(TableRow);

interface Props {
	data?: [any];
}

const TableMetric: React.FC<Props> = ({ data }) => {
	const classes = useStyles();
	return (
			<TableContainer className={classes.containerTable} component={Paper}>
				<Table aria-label="spanning table">
					<TableHead>
						<TableRow>
							<TableCell align="left" colSpan={8} className={classes.titleHeader} width="45%">
								Metric
							</TableCell>
							<TableCell align="center" className={classes.titleHeader} >
								A: Results for
								this campaign
							</TableCell>
							<TableCell align="center" className={classes.titleHeader} >
								B: Ave for
								all previous
								campaigns
							</TableCell>
							<TableCell align="right" className={classes.titleHeader} width="12%">
								Lift
								(A-B)
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody >
							<TableRow className={classes.oddRow}>
								<TableCell align="left" colSpan={8}>Targeted</TableCell>
								<TableCell align="center">1000</TableCell>
								<TableCell align="center">1000</TableCell>
								<TableCell align="right">57%</TableCell>
							</TableRow>
							<TableRow className={classes.evenRow}>
								<TableCell align="left" colSpan={8} className={classes.normalText} style={{color: "#5A6EFF"}}>Sent</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#5A6EFF"}}>800</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#5A6EFF"}} >700</TableCell>
								<TableCell align="right" className={classes.normalText} style={{color: "#5A6EFF"}} >14%</TableCell>
							</TableRow>
							<TableRow className={classes.oddRow}>
								<TableCell align="left" colSpan={8} className={classes.normalText} style={{color: "#818FFE"}} >Reached</TableCell>
								<TableCell align="center"  className={classes.normalText} style={{color: "#818FFE"}} >300</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#818FFE"}} >200</TableCell>
								<TableCell align="right" className={classes.normalText} style={{color: "#818FFE"}} >50%</TableCell>
							</TableRow>
							<TableRow className={classes.evenRow}>
								<TableCell align="left" colSpan={8} className={classes.normalText} style={{color: "#B7B7F3"}} >Push Impressions</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#B7B7F3"}} >1000</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#B7B7F3"}}>1000</TableCell>
								<TableCell align="right" className={classes.normalText} style={{color: "#B7B7F3"}}>57%</TableCell>
							</TableRow>

							<TableRow className={classes.oddRow}>
								<TableCell align="left" colSpan={8} className={classes.normalText} style={{color: "#FFB394"}}>Push Clicks</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#FFB394"}}>8%</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#FFB394"}}>4%</TableCell>
								<TableCell align="right" className={classes.normalText} style={{color: "#FFB394"}}>100%</TableCell>
							</TableRow>
							<TableRow className={classes.evenRow}>
								<TableCell align="left" colSpan={8} className={classes.normalText} style={{color: "#FFC5AE"}}>Inapp Impressions</TableCell>
								<TableCell align="center" style={{color: "#FFC5AE"}}>8%</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#FFC5AE"}} >4%</TableCell>
								<TableCell align="right" className={classes.normalText} style={{color: "#FFC5AE"}} >100%</TableCell>
							</TableRow>
							<TableRow className={classes.oddRow}>
								<TableCell align="left" colSpan={8} className={classes.normalText} style={{color: "#FFD6C7"}} >Inapp Clicks</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#FFD6C7"}} >8%</TableCell>
								<TableCell align="center" className={classes.normalText} style={{color: "#FFD6C7"}} >4%</TableCell>
								<TableCell align="right" className={classes.normalText} style={{color: "#FFD6C7"}} >100%</TableCell>
							</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
	);

};

export default TableMetric;