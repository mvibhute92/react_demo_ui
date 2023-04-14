import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect, FormEvent } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Menu,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Axios from 'axios';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

import authHeader from '../constants/auth';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'companyid', label: 'Company Id', alignRight: false },
  { id: 'firstname', label: 'First Name', alignRight: false },
  { id: 'lastname', label: 'Last Name', alignRight: false },
  { id: 'companyname', label: 'Company Name', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'experience', label: 'Experience', alignRight: false },
  { id: 'about', label: 'Gender', alignRight: false },
  { id: 'mobile', label: 'Mobile No', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: '_id' },
];

// ----------------------------------------------------------------------

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.firstname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [userDetail, setUserDetail] = useState([]);

  const [newUserDialog, setNewUserDialog] = useState(false);

  const [newUserData, setNewUserData] = useState([]);

  const [gender, setGender] = useState('');

  const [showSnack, setShowSnack] = useState(false);

  const [seletedRow, setSelectedRow] = useState({});

  const [deleteMultipleIds, setdeleteMultipleIds] = useState([]);



  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    role: '',
    experience: '',
    about: '',
    companyid: '',
    mobile: '',
    email: '',
  });

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    
  }, [deleteMultipleIds])
  const handleUserDelete = () => {
    deleteUser();
    setOpen(null);
  };
  const handleUserEdit = () => {
    setNewUserDialog(true);
    const obj = { ...seletedRow };
    delete obj._id;
    setFormData(obj);
    setGender(seletedRow.about);
    setOpen(null);
  };

  const deleteUser = async () => {
    // api
    const response = await Axios.delete(`http://localhost:5000/delete/${seletedRow._id}`, { headers: authHeader() });
    console.log(response);
    if (response.status === 200) {
      console.log(response);
      getUsers();
    }
  };
const deleteMultiple = async () => {
  const response = await Axios.post(`http://localhost:5000/deletemultiple`,{...deleteMultipleIds},  { headers: authHeader() });
  console.log(response);
  if (response.status === 200) {
    setSelected([]);
    console.log(response);
    getUsers();
  }
};
  const editUser = async () => {
    const response = await Axios.put(`http://localhost:5000/edituser/${seletedRow._id}`, formData, {
      headers: authHeader(),
    });
    console.log(response);
    if (response.status === 200) {
      setNewUserDialog(true);
      console.log(response);
      getUsers();
    }
  };
  const getUsers = async () => {
    const response = await Axios.get('http://localhost:5000/getuserdata', { headers: authHeader() });

    if (response.status === 200) {
      setUserDetail(response.data.userDetails);
    } else {
      setUserDetail([]);
    }
  };
  const handleMultipleDelete = async () => {
    deleteMultiple();
  }
  const handleOpenMenu = (row) => (event) => {
    setSelectedRow(row);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleClose = () => {
    setNewUserDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userDetail.map((n) => n.companyid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, _id) => {
    console.log(_id);
    const idArray = [...deleteMultipleIds, _id];
    console.log(idArray);
    setdeleteMultipleIds(idArray)
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
    console.log(deleteMultipleIds);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    // setPage(0);
    setFilterName(event.target.value);
  };

  const inputChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((formData) => ({ ...formData, [id]: value }));
  };

  const submitHandler = () => {
    // setNewUserData(JSON.stringify(data));
    console.log(seletedRow);
    const checkData = checkProperties(formData);
    setOpen(null);
    if (checkData) {
      setShowSnack(false);
      if (Object.keys(seletedRow).length === 0) {
        const obj = { ...formData };
        obj.about = gender;
        obj.companyid = JSON.stringify(Math.floor(Math.random() * 9000000000) + 1000000000);
        setFormData({ ...obj });
        createNewUser(obj);
      } else {
        editUser(formData);
      }
    } else {
      setShowSnack(true);
    }
  };

  function checkProperties(obj) {
    let checkval;
    if (Object.values(obj).length <= 9 && !Object.values(obj).includes('')) {
      checkval = true;
    }

    return checkval;
  }
  async function createNewUser(body) {
    try {
      const response = await Axios.post('http://localhost:5000/adduser', body, { headers: authHeader() });

      if (response.status === 200) {
        setNewUserDialog(false);
        getUsers();
        console.log('sucess');
      }
    } catch (error) {
      console.log('in catch block');
    }
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userDetail.length) : 0;

  const filteredUsers = applySortFilter(userDetail, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setNewUserDialog(true);
              setFormData({});
              setGender('');
            }}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar onMultipleDelete={handleMultipleDelete} numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userDetail.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { _id, companyid, firstname, lastname, companyname, role, experience, about, mobile, email } =
                      row;
                    const selectedUser = selected.indexOf(companyid) !== -1;

                    return (
                      <>
                        <TableRow hover key={index} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, companyid, _id)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={companyid} src={USERLIST[index].avatarUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {companyid}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{firstname}</TableCell>

                          <TableCell align="left">{lastname}</TableCell>

                          <TableCell align="left">{companyname}</TableCell>

                          <TableCell align="left">{role}</TableCell>
                          <TableCell align="left">{experience}</TableCell>
                          <TableCell align="left">{about}</TableCell>
                          <TableCell align="left">{mobile}</TableCell>
                          <TableCell align="left">{email}</TableCell>

                          <TableCell align="right" style={{ paddingLeft: '0px !important' }}>
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu(row)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                            {/* <Button onClick={checkRow(_id, index)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                            </Button> */}
                          </TableCell>
                        </TableRow>
                        {/* <Menu
                          open={Boolean(open)}
                          anchorEl={open}
                          onClose={handleCloseMenu}
                          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          PaperProps={{
                            sx: {
                              p: 1,
                              width: 140,
                              '& .MuiMenuItem-root': {
                                px: 1,
                                typography: 'body2',
                                borderRadius: 0.75,
                              },
                            },
                          }}
                        >
                          <MenuItem>
                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                            Edit
                          </MenuItem>

                          <MenuItem sx={{ color: 'error.main' }} key={index} onClick={handleUserDelete(row)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Delete
                          </MenuItem>
                        </Menu> */}
                      </>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userDetail.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleUserEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleUserDelete}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Snackbar
        open={showSnack}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setShowSnack(false)}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          All fields are mandatory!
        </Alert>
      </Snackbar>
      <Dialog open={newUserDialog} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <FormControl variant="standard">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="firstname"
                    label="First Name*"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.firstname}
                    onChange={inputChangeHandler}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl variant="standard">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="lastname"
                    label="Last Name*"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.lastname}
                    onChange={inputChangeHandler}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <FormControl variant="standard">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="companyname"
                    label="Company Name*"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.companyname}
                    onChange={inputChangeHandler}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <FormControl variant="standard">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="role"
                    label="Role*"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.role}
                    onChange={inputChangeHandler}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <FormControl variant="standard">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="experience"
                    label="Experience*"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.experience}
                    onChange={inputChangeHandler}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <FormControl variant="standard" sx={{ margin: '0px', minWidth: '77%' }}>
                  <InputLabel id="about">Gender*</InputLabel>
                  <Select
                    labelId="about"
                    id="about"
                    name="about"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Gender*"
                    variant="standard"
                  >
                    <MenuItem value={'M'}>M</MenuItem>
                    <MenuItem value={'F'}>F</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <FormControl variant="standard">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="mobile"
                    label="Mobile No.*"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.mobile}
                    onChange={inputChangeHandler}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
                <FormControl variant="standard">
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email*"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={formData.email}
                    onChange={inputChangeHandler}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={submitHandler}>
            Save User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
