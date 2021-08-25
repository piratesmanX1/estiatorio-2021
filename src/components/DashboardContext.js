import { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

import Cookies from 'js-cookie'
import { destroyCookies } from '../functions/destroyCookies'

// Functions
import { formatDate } from '../functions/formatDate'
import { validateJSON } from '../functions/validateJSON'

// MaterialUI
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Paper,
  Container,
  Grid,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';

const DashBoardContext = () => {
    return (
        <div className="DashboardContext">
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.75}}
            >
                {/* <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Card className="">
                        <CardContent>
                            
                        </CardContent>
                    </Card>
                </Grid> */}
                <p>Welcome back, {Cookies.get("first_name") + " " + Cookies.get("last_name")}</p>
            </motion.div>
        </div>
    );
}
 
export default DashBoardContext;