import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

import Cookies from 'js-cookie'

// Functions
import { validateJSON } from '../functions/validateJSON'
import { removeArrayObject } from '../functions/removeArrayObject'
import { formatTime } from '../functions/formatTime'

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { Divider } from '@material-ui/core';

export default function AdminAccountLog() {
    function createData(id, name, log_status, decider_name, affected_date) {
        return {id, name, log_status, decider_name, affected_date};
      }
      
    function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
    }
    
    function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
    
    function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
    }
    
    const headCells = [
    { id: 'id', numeric: false, disablePadding: true, label: '#' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Affected User' },
    { id: 'log_status', numeric: true, disablePadding: false, label: 'Status Changes' },
    { id: 'decider_name', numeric: true, disablePadding: false, label: 'Decider User' },
    { id: 'affected_date', numeric: true, disablePadding: false, label: 'Date of Affected' }
    ];
    
    function EnhancedTableHead(props) {
        const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };
    
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                    </TableCell>
                    {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                        >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                        ) : null}
                        </TableSortLabel>
                    </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }
    
    EnhancedTableHead.propTypes = {
        classes: PropTypes.object.isRequired,
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };
    
    const useToolbarStyles = makeStyles((theme) => ({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }));
    
    const EnhancedTableToolbar = (props) => {
        const classes = useToolbarStyles();
        const { numSelected } = props;
        const { tableData } = props;
        
        // Defining snackbar from MaterialUI
        const { enqueueSnackbar } = useSnackbar();
    
        return (
            <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
            >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Account log
                    <Typography color="textSecondary" variant="body1">
                        * Keep track on the changes made on the account status.
                    </Typography>
                </Typography>
            )}
            </Toolbar>
    
        );
    };
    
    EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
    };
    
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }));

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    const [rows, setRows] = useState([]);

    const fetchData = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_account_log.php`; // direct it to the PHP folder
        
        axios.post(API_PATH) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == false) {
                    // if user data not found
                    enqueueSnackbar('Data unable to be fetched, please try again.', {variant: 'error'});
                } else if (validateJSON(res.data) == true) {
                    // if data is in JSON format, means the user data retrieved
                    // proceed to extract the data and set it into React Session
                    let datarows = [];
                    let affected_name;
                    let decider_name;
                    let affected_date;
                    res.data.map((data) => {
                        affected_name = data.affected_first_name + " " + data.affected_last_name;
                        decider_name = data.decider_first_name + " " + data.decider_last_name;
                        affected_date = formatTime(data.affected_date);
                        datarows.push(createData(data.acclog_id, affected_name, data.log_status, decider_name, affected_date));
                    });
                    
                    setRows(datarows);
                } else {
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Error: Data fetching process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
    }

    useEffect(() => {
        // fetch the data onload
        fetchData();
    }, [])

    // Table code
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [tableData, setTableData] = useState([]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
            setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className="RegionList">
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.75}}
            >
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <EnhancedTableToolbar numSelected={selected.length} tableData={tableData} />
                        <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        className="data-table-chk"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            // set the data object if the item is selected
                                            onChange={
                                                (e) => {
                                                    if (e.target.checked) {
                                                        // // if its the first selected (aka only one item at the time)
                                                        // if (selected.length == 0){
                                                        //     // set the data object if the item is selected
                                                        //     setTableData(row);
                                                        // }
                                                        let newTableData = tableData;
                                                        newTableData.push(row);
                                                        setTableData(newTableData);
                                                    } else {
                                                        // remove the value from the object array based on the given id
                                                        let newTableData = removeArrayObject(tableData, "id", row.id)
                                                        setTableData(newTableData);
                                                    }
                                                }
                                            }
                                        />
                                    </TableCell>
                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                        {row.id}
                                    </TableCell>
                                        <TableCell align="right">{row.name}</TableCell>
                                        <TableCell align="right" style={row.log_status == 0 ? {color: "green"} : {color: "red"}}>{row.log_status == 0 ? "Activate" : "Deactivate"}</TableCell>
                                        <TableCell align="right">{row.decider_name}</TableCell>
                                        <TableCell align="right">{row.affected_date}</TableCell>
                                    </TableRow>
                                );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                        </TableContainer>
                        <TablePagination
                            className="data-table-button"
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Dense padding"
                    />
                    </div>
            </motion.div>
        </div>
    );
}