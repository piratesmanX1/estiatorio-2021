import axios from 'axios';
import { useState, useEffect } from "react";
import { Link, useHistory, useParams  } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie'

// Functions
import { validateJSON } from '../functions/validateJSON'
import { destroyCookies } from '../functions/destroyCookies'
import { removeArrayObject } from '../functions/removeArrayObject'
import { pageValidation } from '../functions/pageValidation'

// MaterialUI
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
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

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

// CSS
import '../assets/css/login.css';

const LogContent = () => {
    function createData(id, name, reservation_time, table_number, status, action) {
        return {id, name, reservation_time, table_number, status, action};
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
    { id: 'name', numeric: false, disablePadding: true, label: 'Restaurant' },
    { id: 'reservation_time', numeric: true, disablePadding: false, label: 'Reservation Schedule' },
    { id: 'table_number', numeric: true, disablePadding: false, label: 'Total Seats' },
    { id: 'status', numeric: true, disablePadding: false, label: 'Reservation Status' },
    { id: 'action', numeric: true, disablePadding: false, label: 'Available Action' }
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
                        inputProps={{ 'aria-label': 'select all logs' }}
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
    
        // dialog setups
        const [open, setOpen] = useState(false);
    
        const handleClickOpen = () => {
            setOpen(true);
        };
    
        const handleClose = () => {
            setOpen(false);
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
                    Reservation Log
                    <Typography color="textSecondary" variant="body1">
                        * Reservations that already overdue can't be cancelled by customer.
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
            padding: "50px",
            paddingTop: "15vh",
            backgroundImage: 'url(./assets/image/B06.jpg)',
            backgroundAttachment: "fixed",
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
        },
    }));

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    const [rows, setRows] = useState([]);

    const fetchData = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_reservation_log.php`; // direct it to the PHP folder
        
        let formData = new FormData();
        
        formData.append("user_id", Cookies.get("user_id"));

        axios.post(API_PATH, formData) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == false) {
                    // if user data not found
                    enqueueSnackbar('Data unable to be fetched, please try again.', {variant: 'error'});
                } else if (validateJSON(res.data) == true) {
                    // if data is in JSON format, means the user data retrieved
                    // proceed to extract the data and set it into React Session
                    let datarows = [];
                    res.data.map((data) => {
                        datarows.push(createData(data.reservation_id, data.restaurant_name, data.reservation_time, data.table_number, data.status));
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

    const [resid, setResid] = useState();

    const handleResStatus = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/cancel_reservation.php`; // direct it to the PHP folder
        
        let formData = new FormData();
        
        formData.append("user_id", Cookies.get("user_id"));
        formData.append("reservation_id", resid);

        setOpen(false);;
        setLoadingOpen(true);
        axios.post(API_PATH, formData) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == true) {
                    // if reservation being cancelled
                    enqueueSnackbar("Reservation cancelled, you may check your email for the notification.", {variant: 'success'});
                    fetchData();
                    setLoadingOpen(false);
                } else {
                    setLoadingOpen(false);
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                setLoadingOpen(false);
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Reservation status unable to be updated. Error: " + err); // making a custom error message that will show in console
            });
    }

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

    const history = useHistory();

    const [progressBar, setProgressBar] = useState(0);

    useEffect(() => {
        setProgressBar(100);
        // hide the navbar and footer for design concerns
        document.getElementById("estiatorio-header").classList.remove("inverted");
        document.getElementById("navbar").classList.add("hidden");
        document.getElementById("contact").classList.add("hidden");
        document.getElementById("navbar").classList.remove("removed");
        document.getElementById("contact").classList.remove("removed");
        
        document.title = ' Reservation Log | Estiatorio ';
    }, []);

    // page validation on reservation log
    useEffect(() => {
         // Page validation on profile page
         if (pageValidation() != true) {
            // if user has not logged in yet
            enqueueSnackbar(pageValidation(), {variant: 'error'});
            history.push('/');
        } else {
            // if user logged in, check the user role
            // if the user already logged in, check whether the account is active or not
            if (Cookies.get("status") == 0) {
                // if it is, proceed to redirect back to their page accordingly based on their role
                // 0: Admin = Dashboard; 1: Customer = stay; 2: Staff = Dashboard
                if (Cookies.get("role") == 0) {
                    enqueueSnackbar("Notice: You are not authorized to access this page", {variant: 'info'});
                    history.push('/dashboard'); 
                } else if (Cookies.get("role") == 1) {
                    // do nothing
                    // fetch the data onload
                    fetchData();
                } else {
                    enqueueSnackbar("Notice: You are not authorized to access this page", {variant: 'info'});
                    history.push('/dashboard'); 
                }
            } else {
                enqueueSnackbar('Your account is inactive, you are unauthorized to access this page.', {variant: 'error'});
                history.push('/'); 
                // immediately break session
                destroyCookies();
            }
        }
    }, [])

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState(false);
    
    // Dialog box settings
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="LoginContent">
            <LoadingBar 
            color="#ffe500"
            progress={progressBar}
            onLoaderFinished={() => setProgressBar(0)}
            />
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
                                        <TableCell align="right">{new Date (row.reservation_time).toLocaleDateString("en-US") + " " + new Date(row.reservation_time).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</TableCell>
                                        <TableCell align="right">{row.table_number}</TableCell>
                                        <TableCell align="right" style={(row.status == 0) ? {color: "lime"} : (row.status == 1) ? {color: "green"} : (row.status == 2) ? {color: "red"} : {color: "red"}}>{(row.status == 0) ? "Attended" : (row.status == 1) ? "Ongoing" : (row.status == 2) ? "Cancelled" : ""}</TableCell>
                                        <TableCell align="right">{row.status == 1 ? <a onClick={() => { setOpen(true); setResid(row.id) }} style={{cursor: "pointer"}}>Cancel</a> : "-"}</TableCell>
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
                    <Dialog
                        className="account-status-dialog"
                        fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">{`Are you sure you want to cancel your reservation?`}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                This action is irreversible. Once you have choose to cancelled it, you will no longer having the reservation
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleResStatus} color="primary" autoFocus>
                                Proceed
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <Backdrop className={classes.backdrop} open={loadingOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </motion.div>
        </div>
    );
}
 
export default LogContent;