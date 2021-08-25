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
import VoiceOverOffOutlinedIcon from '@material-ui/icons/VoiceOverOffOutlined';
import BlockIcon from '@material-ui/icons/Block';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import PanToolIcon from '@material-ui/icons/PanTool';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function AdminRestaurantList() {
    function createData(id, name, staff_name, email, status, seat_capacity) {
        return {id, name, staff_name, email, status, seat_capacity};
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
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'staff_name', numeric: true, disablePadding: false, label: 'Owner' },
    { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
    { id: 'status', numeric: true, disablePadding: false, label: 'Restaurant Status' },
    { id: 'seat_capacity', numeric: true, disablePadding: false, label: 'Seat Capacity' }
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
        
        const editData = (updated_status) => {
            const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/status_restaurant_list.php`; // direct it to the PHP folder

            const data_type = "Restaurant";

            // since the processing is deleting, we will target on the checked table rows and take it as an array
            // check if the array of object has been defined or not
            if (tableData) {
                // loop it by checking the ID and perform the deletion one by one
                // showing a loading backdrop page to prevent any interruption from user
                tableData.forEach(function(item) {
                    setLoadingOpen(true);

                    if (item.status == updated_status) {
                        setLoadingOpen(false);
                        enqueueSnackbar(data_type + " ID: " + item.id + " is already in the status you intended to update.", {variant: 'error'});
                    } else {
                        let formData = new FormData();
                        formData.append("restaurant_id", item.id);
                        formData.append("status", updated_status);

                        axios.post(API_PATH, formData) // asynchronous, therefore promises
                        .then((res) => {
                            // if POST is a success then output a snackbar from MaterialUI
                            if (res.data == true) {
                                // if data updated
                                enqueueSnackbar('Restaurant ID: ' + item.id + ((updated_status == 0) ? " activated" : " deactivated"), {variant: 'success'});
                                // refresh the data
                                fetchData();
                                setLoadingOpen(false);
                            } else {
                                setLoadingOpen(false);
                                // in this case res.data must be returning an error message
                                enqueueSnackbar(res.data, {variant: 'error'});
                                // refresh the data
                                fetchData();
                            }
                        })
                        .catch((err) =>  {
                            setLoadingOpen(false);
                            enqueueSnackbar(err, {variant: 'error'});
                            // refresh the data
                            fetchData();
                            throw Error("Error: Restaurant status update process on " + data_type + " ID: " + item.id + " failed for some reason. Error: " + err); // making a custom error message that will show in console
                        });
                    }
                });
                // clear the current onholding data
                setTableData([]);
                // uncheck all the checkbox after data updated
                setSelected([]);
            } else {
                enqueueSnackbar("Error: Restaurant data is not defined, please re-check the table row again.", {variant: 'error'});
            }
        }

        // delete form dialog settings
        const [deleteOpen, setDeleteOpen] = useState(false);
        const theme = useTheme();
        const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

        const handleClickDeleteOpen = () => {
            setDeleteOpen(true);
        };

        const handleDeleteClose = () => {
            setDeleteOpen(false);
        };

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
                    Restaurant list
                    <Typography color="textSecondary" variant="body1">
                        * Restaurant with at least one active/ongoing reservation can't be deactivated.
                    </Typography>
                </Typography>
            )}
    
            {numSelected > 0 ? (
                <>
                    <Tooltip title="Disable">
                        <IconButton  onClick={handleClickDeleteOpen} className="data-theader-button" aria-label="delete">
                            <BlockIcon/>
                        </IconButton>
                    </Tooltip>

                    <Dialog
                        className="dashboard-dialog"
                        fullScreen={fullScreen}
                        open={deleteOpen}
                        onClose={handleDeleteClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">{"Are you sure you wish to disable the selected restaurant list?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                This action will make the restaurant no longer available to public.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button autoFocus onClick={handleDeleteClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => editData(1)} color="primary" autoFocus>
                            Proceed
                        </Button>
                        </DialogActions>
                    </Dialog>

                    <Tooltip title="Enable">
                        <IconButton onClick={() => editData(0)} className="data-theader-button" aria-label="edit data">
                            <DoneAllOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <>
                    {/* <Tooltip title="Add new data">
                        <IconButton className="data-theader-button" aria-label="add new data">
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Tooltip> */}
                </>
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
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        }
    }));

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState();

    const [rows, setRows] = useState([]);

    const fetchData = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_restaurant_list.php`; // direct it to the PHP folder

        axios.post(API_PATH) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == false) {
                    // if user data not found
                    enqueueSnackbar('Data unable to be fetched or there is not data from the database, please try again.', {variant: 'error'});
                    // make the table empty
                    setRows([]);
                } else if (validateJSON(res.data) == true) {
                    // if data is in JSON format, means the user data retrieved
                    // proceed to extract the data and set it into React Session
                    let datarows = [];
                    let fullName;
                    res.data.map((data) => {
                        fullName = data.first_name + " " + data.last_name;
                        
                        datarows.push(createData(data.restaurant_id, data.restaurant_name, fullName, data.email, data.status, data.seat_capacity));
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
        <div className="UserList">
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.75}}
            >
                <Backdrop className={classes.backdrop} open={loadingOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
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
                                        <TableCell align="right">{row.staff_name}</TableCell>
                                        <TableCell align="right">{row.email}</TableCell>
                                        <TableCell align="right" style={row.status == 0 ? {color: "green"} : row.status == 1 ? {color: "red"} : {color: "#FFD800"}}>{row.status == 0 ? "Active" : row.status == 1 ? "Deactivated" : "-"}</TableCell>
                                        <TableCell align="right">{row.seat_capacity}</TableCell>
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