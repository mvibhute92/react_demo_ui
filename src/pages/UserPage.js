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
  { id: '' },
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

  const [gender, setGender] = useState();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    role: '',
    experience: '',
    about: '',
    mobile: '',
    email: '',
  });

  useEffect(() => {
    const getUsers = async () => {
      const response = await Axios.get('http://localhost:5000/getuserdata');
      console.log(response);
      if (response.status === 200) {
        setUserDetail(response.data.userDetails);
        console.log(userDetail);
      } else {
        setUserDetail([]);
      }
    };

    getUsers();
  }, []);

  const handleOpenMenu = (event) => {
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

  const handleClick = (event, name) => {
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
    if(e.target.id === undefined){
      console.log(e.target);
      
    
      const { name, value } = e.target;
      setGender(e.target.value);
      console.log(gender);
      setFormData((formData) => ({ ...formData, [name]: value }));
    
      console.log(formData);
    } else {
      const { id, value } = e.target;
      setFormData((formData) => ({ ...formData, [id]: value }));
      console.log(formData);
    }
    
    
    
  };

  const submitHandler = (data) => {
    // setNewUserData(JSON.stringify(data));
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userDetail.length) : 0;

  const filteredUsers = applySortFilter(userDetail, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() =>{setNewUserDialog(true); setFormData({}); setGender('')} }
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

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
                    const { companyid, firstname, lastname, companyname, role, experience, about, mobile, email } = row;
                    const selectedUser = selected.indexOf(companyid) !== -1;

                    return (
                      <TableRow hover key={index} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, companyid)} />
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
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
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
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={newUserDialog} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <form onSubmit={submitHandler}>
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
                <FormControl variant="standard" sx={{ m: 1, minWidth: '88%' }}>
                  <InputLabel id="demo-simple-select-standard-label">Gender*</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id='about'
                    name="about"
                    value={gender}
                    onChange={inputChangeHandler}
                    label="Gender*"
                    variant="standard"
                  >
                    <MenuItem value={'M'}>M</MenuItem>
                    <MenuItem value={'F'}>F</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={6}>
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
          <Button type="submit">Save User</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
