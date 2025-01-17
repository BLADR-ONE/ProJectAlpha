import {
  alpha,
  Avatar,
  Divider,
  FormControlLabel,
  Icon,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  NoSsr,
  styled,
  Switch,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../lib/firebase';
import Router from 'next/router';
import axios from 'axios';
import { useStateValue } from '../lib/StateProvider';
import { actionTypes } from '../lib/reducer';

function Navbar(props) {
  // Menu

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff'
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const open = Boolean(anchorMenu);
  const handleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  const signOut = (e) => {
    auth.signOut();
    setAnchorMenu(null);
    setUser(false);
    Router.push('/');
  };

  // Script media

  const [st, setSt] = useState('0px');

  const phoneMenu__hide = () => {
    setSt('0px');
  };

  const phoneMenu__show = () => {
    setSt('200px');
  };

  const [user, setUser] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      if (auth.currentUser) {
        await axios
          .post(`/api/admin/isAdmin/`, {
            token: auth.currentUser.toJSON().stsTokenManager.accessToken,
          })
          .then((res) => {
            if (res.data.isAdmin) {
              setIsAdmin(true);
            }
          });
      }
    }, 1500);
  }, [auth.currentUser]);

  useEffect(() => {
    setTimeout(() => {
      if (auth.currentUser) {
        setUser(true);
      }
    }, 1000);
  }, [auth.currentUser]);

  const [mode, setMode] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('mode') === 'true'
        ? true
        : false
      : false
  );

  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('theme', mode);
  }

  const handleMode = (value) => {
    localStorage.setItem('mode', value);
    setMode(value);
    console.log(localStorage.getItem('mode'));
  };

  return (
    <>
      <nav
        className={
          props.navstyle
            ? `${styles['nav']} ${styles['nav__change__style']}`
            : styles.nav
        }
      >
        <a href="/">
          <img
            src="/assets/logo.png"
            className={styles.img}
            style={{ height: 62 }}
          />
        </a>
        <div
          className={styles.nav_links}
          id="navlinks"
          style={{ marginRight: st }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            className={styles.fa}
            onClick={phoneMenu__hide}
          />
          <ul className={styles.ul}>
            {user ? (
              <>
                <div
                  className={user ? styles.avatar__phone : styles.display__none}
                >
                  <IconButton onClick={handleMenu}>
                    <Avatar
                      color="primary"
                      src={`https://robohash.org/${auth.currentUser.email}?set=set4`}
                      sx={{ bgcolor: '#f1f2f3' }}
                    />
                  </IconButton>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className={styles.switch}>
              <NoSsr>
                <FormControlLabel
                  control={
                    <MaterialUISwitch
                      sx={{ m: 1 }}
                      defaultChecked={mode}
                      onChange={(e, value) => handleMode(value)}
                    />
                  }
                />
              </NoSsr>
            </div>
            <li
              className={
                props.navstyle
                  ? `${styles['li']} ${styles['li__change__style']}`
                  : styles.li
              }
            >
              <Link href="/">Acasă</Link>
            </li>
            <div className={styles.vertical__line} />
            <li
              className={
                props.navstyle
                  ? `${styles['li']} ${styles['li__change__style']}`
                  : styles.li
              }
            >
              <Link href="/facultati  ">Facultati</Link>
            </li>
            <div className={styles.vertical__line} />
            <li
              className={
                props.navstyle
                  ? `${styles['li']} ${styles['li__change__style']}`
                  : styles.li
              }
            >
              <Link href="/about">Despre</Link>
            </li>
            <div className={styles.vertical__line} />
            <li
              className={
                props.navstyle
                  ? `${styles['li']} ${styles['li__change__style']}`
                  : styles.li
              }
            >
              <Link href="/contact">Contact</Link>
            </li>
            {user ? (
              <>
                <div
                  className={user ? styles.avatar__pc : styles.display__none}
                >
                  <IconButton onClick={handleMenu}>
                    <Avatar
                      color="primary"
                      src={`https://robohash.org/${auth.currentUser.email}?set=set4`}
                      sx={{ bgcolor: '#f1f2f3' }}
                    />
                  </IconButton>
                </div>
              </>
            ) : (
              <>
                <div className={styles.vertical__line} />
                <li
                  className={
                    props.navstyle
                      ? `${styles['li']} ${styles['li__change__style']}`
                      : styles.li
                  }
                >
                  <Link href="/account/auth">Logare</Link>
                </li>
              </>
            )}
            {isAdmin ? (
              <Menu
                id="basic-menu"
                anchorEl={anchorMenu}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                sx={{
                  zIndex: '9999999',
                }}
              >
                <MenuItem>
                  <Link href="/account">Contul meu</Link>
                </MenuItem>
                <MenuItem onClick={signOut}>Delogare</MenuItem>
                <Divider />
                <MenuItem>
                  <Link href="/admin">Panou admin</Link>
                </MenuItem>
              </Menu>
            ) : (
              <Menu
                id="basic-menu"
                anchorEl={anchorMenu}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                sx={{
                  zIndex: '9999999',
                }}
              >
                <MenuItem>
                  <Link href="/account">Contul meu</Link>
                </MenuItem>
                <MenuItem onClick={signOut}>Delogare</MenuItem>
              </Menu>
            )}
          </ul>
        </div>

        <FontAwesomeIcon
          icon={faBars}
          className={styles.fa}
          onClick={phoneMenu__show}
        />
      </nav>
    </>
  );
}

export default Navbar;
