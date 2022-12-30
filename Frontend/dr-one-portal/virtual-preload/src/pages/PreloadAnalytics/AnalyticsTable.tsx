import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../context/globalState';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import { Spinner } from '@dr-one/shared-component';

const AnalyticsTable = ({ data: dataProp, columns, ...rest }) => {
  const { t } = useTranslation();
  const { dispatch, state } = useContext(GlobalContext);
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
  const [sortColumn, setSortColumn] = useState(state.analytics.currentTab === 'all' ? state?.analytics?.all?.list?.sortColumn : state.analytics.currentTab === 'channel' ? state?.analytics?.channel?.list?.sortColumn : state.analytics.currentTab === 'device' ? state?.analytics?.device?.list?.sortColumn : state?.analytics?.app?.list?.sortColumn);
  const [sortOrder, setSortOrder] = useState(state.analytics.currentTab === 'all' ? state?.analytics?.all?.list?.sortOrder : state.analytics.currentTab === 'channel' ? state?.analytics?.channel?.list?.sortOrder : state.analytics.currentTab === 'device' ? state?.analytics?.device?.list?.sortOrder : state?.analytics?.app?.list?.sortOrder);
  const [buttonLoader, setButtonLoader] = useState(false);


  const updateTableData = (): void => {
    const params = {
      groupby: state.analytics.currentTab !== 'all' ? state.analytics.currentTab.toUpperCase() : 'NONE',
      startdate: encodeURI(helper.formatDateWithSlash(state.analytics.dateRange.from)),
      enddate: encodeURI(helper.formatDateWithSlash(state.analytics.dateRange.to)),
      start: state.analytics[state.analytics.currentTab].list.offset + state.analytics[state.analytics.currentTab].list.limit,
      limit: state.analytics[state.analytics.currentTab].list.limit
    };
    const idArray = state.analytics.currentTab === 'channel' ? state.analytics.selectedChannelList : state.analytics.currentTab === 'device' ?
      state.analytics.selectedDeviceList : state.analytics.currentTab === 'app' ? state.analytics.selectedAppList : [];
    if (state.analytics.currentTab !== 'all') {
      params['ids'] = idArray.map(item => item.id).join();
    }
    const urlParams = {
      params: params
    };
    setButtonLoader(true);
    apiDashboard.get(`preload/analytics/organizationid/${organizationId}/listcount`, urlParams).then(response => {
      const modifiedHeaderData = response?.data?.data?.headers.filter(header => header.name !== 'Channel');
      const modifiedValues = response?.data?.data?.values.map(value => {
        delete value['Channel'];
        return value;
      })
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: modifiedHeaderData,
            values: helper.sort(state.analytics[state.analytics.currentTab].list?.data?.values.concat(modifiedValues), { property: state.analytics[state.analytics.currentTab].list.sortColumn, direction: state.analytics[state.analytics.currentTab].list.sortOrder === 'desc' ? -1 : 1 })
          },
          hasMore: response?.data?.data?.hasMore,
          offset: state.analytics[state.analytics.currentTab].list.offset + 10,
          limit: 10,
          tab: state.analytics.currentTab,
          sortOrder: state.analytics[state.analytics.currentTab].list.sortOrder,
          sortColumn: state.analytics[state.analytics.currentTab].list.sortColumn
        }
      });
      setButtonLoader(false);
    }, error => {
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: [],
            values: []
          },
          hasMore: false,
          offset: 0,
          limit: 10,
          tab: state.analytics.currentTab,
          sortOrder: state.analytics[state.analytics.currentTab].list.sortOrder,
          sortColumn: state.analytics[state.analytics.currentTab].list.sortColumn
        }
      });
      setButtonLoader(false);
    });
  }

  const setTableColumn = (sortOrder: string, sortColumn: string): void => {
    const tableListValues = state.analytics.currentTab === 'all' ? state.analytics?.all?.list?.data?.values :
      state.analytics.currentTab === 'channel' ? state.analytics?.channel?.list?.data?.values : state.analytics.currentTab === 'device' ?
        state.analytics?.device?.list?.data?.values : state.analytics?.app?.list?.data?.values;

    const tableListHeaders = state.analytics.currentTab === 'all' ? state.analytics?.all?.list?.data?.columns :
      state.analytics.currentTab === 'channel' ? state.analytics?.channel?.list?.data?.columns : state.analytics.currentTab === 'device' ?
        state.analytics?.device?.list?.data?.columns : state.analytics?.app?.list?.data?.columns;
    const columnSortOrder = sortOrder === 'desc' ? -1 : 1;

    const sortedArray = helper.sort(tableListValues, {
      "property": sortColumn,
      "direction": columnSortOrder
    })

    const offsetValue = state.analytics.currentTab === 'all' ? state.analytics?.all?.list?.offset :
      state.analytics.currentTab === 'channel' ? state.analytics?.channel?.list?.offset : state.analytics.currentTab === 'device' ?
        state.analytics?.device?.list?.offset : state.analytics?.app?.list?.offset;

    const limitValue = state.analytics.currentTab === 'all' ? state.analytics?.all?.list?.limit :
      state.analytics.currentTab === 'channel' ? state.analytics?.channel?.list?.limit : state.analytics.currentTab === 'device' ?
        state.analytics?.device?.list?.limit : state.analytics?.app?.list?.limit;

    const hasMoreValue = state.analytics.currentTab === 'all' ? state.analytics?.all?.list?.hasMore :
      state.analytics.currentTab === 'channel' ? state.analytics?.channel?.list?.hasMore : state.analytics.currentTab === 'device' ?
        state.analytics?.device?.list?.hasMore : state.analytics?.app?.list?.hasMore;

    dispatch({
      type: "UPDATE_ANALYTICS_LIST_DATA",
      payload: {
        data: {
          columns: tableListHeaders,
          values: sortedArray
        },
        hasMore: hasMoreValue,
        offset: offsetValue,
        limit: limitValue,
        sortOrder: sortOrder,
        sortColumn: sortColumn,
        tab: state.analytics.currentTab
      }
    });
  }

  return (
    <>
      {dataProp.length > 0 &&
        <TableContainer component={Paper}>
          <Table aria-label="preload analytics table">
            <TableHead>
              <TableRow >
                {columns.map((col, index) => (<TableCell key={'col-' + index} className="sort-row"><span>{col.name}</span>
                  <div className="sort">
                    <ArrowDropUpOutlinedIcon className={(sortColumn === col.name && sortOrder === 'asc') ? 'active' : ''} onClick={(e) => setTableColumn('asc', col.name)} />
                    <ArrowDropDownOutlinedIcon onClick={(e) => setTableColumn('desc', col.name)} className={(sortColumn === col.name && sortOrder === 'desc') ? 'active' : ''} />
                  </div></TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataProp
                .map((row, rowIndex) => (
                  <TableRow key={'row-' + rowIndex}>
                    {columns.map((col, colIndex) => (<TableCell key={'row-' + rowIndex + '-col-' + colIndex}>{row[col.name]}</TableCell>))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {(buttonLoader && ((state.analytics.currentTab === 'all' && state.analytics.all?.list?.hasMore) || (state.analytics.currentTab === 'channel' && state.analytics.channel?.list?.hasMore)
            || (state.analytics.currentTab === 'device' && state.analytics.device?.list?.hasMore) || (state.analytics.currentTab === 'app' && state.analytics.app?.list?.hasMore))) &&
            <Button className="button-xs show-more-btn" variant="contained" color="primary" onClick={() => updateTableData()} disabled>{t('SHOW_MORE_BUTTON')}<Spinner color={"blue"} /></Button>}
          {(!buttonLoader && ((state.analytics.currentTab === 'all' && state.analytics.all?.list?.hasMore) || (state.analytics.currentTab === 'channel' && state.analytics.channel?.list?.hasMore)
            || (state.analytics.currentTab === 'device' && state.analytics.device?.list?.hasMore) || (state.analytics.currentTab === 'app' && state.analytics.app?.list?.hasMore))) &&
            <Button className="button-xs show-more-btn" variant="contained" color="primary" onClick={() => updateTableData()}>{t('SHOW_MORE_BUTTON')}</Button>}
        </TableContainer>}
      {((state.analytics.currentTab === 'all' && dataProp.length === 0 && !state.analytics.tableAllLoader) || (state.analytics.currentTab === 'channel' && dataProp.length === 0 && !state.analytics.tableChannelLoader) || (state.analytics.currentTab === 'device' && dataProp.length === 0 && !state.analytics.tableDeviceLoader) || (state.analytics.currentTab === 'app' && dataProp.length === 0 && !state.analytics.tableAppLoader)) && <div className="alert error lg"><div className="alert-message">{t('PRELOAD_ANALYTICS_TABLE_ERROR')}</div></div>}
    </>
  );
};

AnalyticsTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
};

export default AnalyticsTable;
