import React from 'react'

// material-ui
import { makeStyles, withStyles } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles((theme) => ({
  containerTable: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100px',
    width: '100%',
    marginTop: '2.5rem',
    boxShadow: 'none',
  },
  oddRow: {
    backgroundColor: '#F6F8FB',
  },
  evenRow: {
    backgroundColor: 'white',
  },
}))

const TableMetricSkeleton: React.FC = () => {
  const classes = useStyles()
  return (
    <TableContainer className={classes.containerTable} component={Paper}>
      <Table aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="left" width="45%">
              <Typography component="div" variant="h3">
                <Skeleton animation="wave" variant="rect" />
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography component="div" variant="h3">
                <Skeleton animation="wave" variant="rect" />
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography component="div" variant="h3">
                <Skeleton animation="wave" variant="rect" />
              </Typography>
            </TableCell>
            <TableCell align="right" width="12%">
              <Typography component="div" variant="h3">
                <Skeleton animation="wave" variant="rect" />
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {new Array(8).fill(0).map((val: number, index: number) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? classes.evenRow : classes.oddRow}
            >
              {new Array(4).fill(0).map((val2: number, index2: number) => (
                <TableCell key={index2} align="left" width={(index2 === 0) ? '45%' : 'auto'}>
                  <Typography component="div" variant="body1">
                    <Skeleton animation="wave" variant="rect" />
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableMetricSkeleton