import React, { useState, useEffect, useCallback } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'

import {
  PERCENT_LABELS_COLORS,
  PERCENT_BACK_COLORS,
  DATE_LINE_COLORS,
} from '../../../../components/Charts/Utils/constants'

const useStyles = makeStyles({
  checkedAll: {
    marginLeft: '10px',
  },
  containerEvents: {
    overflow: 'auto',
    minHeight: '150px',
    height: '100%',
    border: '1px solid',
    borderRadius: '5px',
    borderColor: '#E9EBEE',
  },
  oddRow: {
    minHeight: '70px',
    padding: '10px',
    backgroundColor: '#F6F8FB',
  },
  evenRow: {
    minHeight: '70px',
    padding: '10px',
    backgroundColor: '#ffffff',
  },
})

export type itemCheck = {
  key: string
  checked: boolean
}
export type eventsType = {
  key: string
  name: string
  percent: number
  total: number
}
type Props = {
  data?: eventsType[],
  changeSeriesVisible?: (e: string[]) => void
}

const TableEvents: React.FC<Props> = ({ data, changeSeriesVisible }) => {
  const classes = useStyles()
  const [checkedAll, setCheckedAll] = useState<boolean>(true)
  const [itemsCheck, setItemsCheck] = useState<itemCheck[]>([])

  useEffect(() => {
    checkAllItems(true)
  }, [])

  const checkItem = (key: string) => {
    const findIndex = itemsCheck.findIndex((val: itemCheck) => val.key === key);
    const newArray: itemCheck[] = Array.from(itemsCheck)
    if (findIndex < 0) {
      setItemsCheck([...newArray, { key, checked: true }])
    } else {
      //const seriesVisible: string[] = []
      //const newArray: itemCheck[] = Array.from(itemsCheck)
      const isChecked: boolean = !newArray[findIndex].checked
      newArray[findIndex].checked = isChecked;
      setItemsCheck(newArray);
      //changeSeriesVisible(['TEST'])
      if (!isChecked) {
        setCheckedAll(false)
      }
    }
    const seriesVisible: string[] = newArray.filter((e:itemCheck) => e.checked).map((e: itemCheck) => e.key)
    changeSeriesVisible(seriesVisible)
  }

  const checkAllItems = useCallback(
    (newStateAll: boolean) => {
      const newArray: itemCheck[] = []
      data?.forEach((val: eventsType) => {
        newArray.push({
          key: val.key,
          checked: newStateAll,
        })
      })
      const seriesVisible: string[] = newArray.filter((e:itemCheck) => e.checked).map((e: itemCheck) => e.key)
      changeSeriesVisible(seriesVisible)
      setCheckedAll(newStateAll)
      setItemsCheck(newArray)
    },
    [data],
  )

  const props = {
    checkedAll: {
      className: classes.checkedAll,
      checked: checkedAll,
      onChange: () => checkAllItems(!checkedAll),
      name: 'checkedAll',
    },
    containerEvents: {
      className: classes.containerEvents,
    },
  }

  return (
    <div>
      <FormControlLabel
        control={<Checkbox {...props.checkedAll} color="primary" />}
        label="Select all the events"
      />
      <Grid container {...props.containerEvents}>
        {data?.map((value: eventsType, index: number) => {
          const isChecked: boolean =
            itemsCheck.filter((val) => val.key === value.key && val.checked)
              .length > 0
          return (
            <Grid
              key={index}
              item
              xs={12}
              className={index % 2 === 0 ? classes.oddRow : classes.evenRow}
            >
              <Grid container>
                <Grid item xs={9}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => checkItem(value.key)}
                        color="primary"
                      />
                    }
                    label={value.name}
                    style={{
                      color: isChecked ? DATE_LINE_COLORS[index] : '#000',
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Tooltip key={index} title={value.total} placement="top" arrow>
                    <div
                      style={{
                        backgroundColor: PERCENT_BACK_COLORS[index],
                        padding: '5px',
                        maxWidth: '55px',
                        textAlign: 'center',
                        borderRadius: '5px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: PERCENT_LABELS_COLORS[index],
                        }}
                      >
                        ${value.percent}%
                      </span>
                    </div>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

export default React.memo(TableEvents)
