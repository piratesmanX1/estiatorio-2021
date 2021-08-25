import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { motion } from 'framer-motion';

// components
import AdminUserOverview from "./AdminUserOverview";
import AdminUserPending from "./AdminUserPending";

export default function AdminUserList() {
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
    
        return (
            <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
            </div>
        );
    }
      
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };
      
    function a11yProps(index) {
        return {
            id: `wrapped-tab-${index}`,
            'aria-controls': `wrapped-tabpanel-${index}`,
        };
    }
      
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
        },
    }));

    const classes = useStyles();
    const [value, setValue] = React.useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.75}}
        >
            <div className={`AdminUserList ` + classes.root}>
                <AppBar position="static">
                    <Tabs className="dashboard-tab-container" value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                        <Tab
                            value="one"
                            label="Overview"
                            wrapped
                            {...a11yProps('one')}
                        />
                        <Tab value="two" label="Pending Approval" {...a11yProps('two')} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index="one">
                    <AdminUserOverview />
                </TabPanel>
                <TabPanel value={value} index="two">
                    <AdminUserPending />
                </TabPanel>
            </div>
        </motion.div>
    );
}
