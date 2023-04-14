import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Axios from 'axios';
// components
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------

export default function LoginForm() {
const navigate = useNavigate();
const [email, setEmail]= useState("");
const [password, setPassword]= useState("");
const [showPassword, setShowPassword] = useState(false);

  // const handleClick = () => {
  //   navigate('/dashboard', { replace: true });
  // };
  const handleClick = ()=> {
 
      loginApiCall();
    
  }

  async function loginApiCall() {

        try{
          const response = await Axios.post('http://localhost:5000/login', {'email': email, 'password': password});
         
        if(response.status === 200){
          sessionStorage.setItem('userData',JSON.stringify(response.data));
          const userName = response.data.data.email.split("@", 1);
          sessionStorage.setItem('username',userName[0]);
          navigate('/dashboard/app', { replace: true });
        }
      }catch(error) {
          console.log('in catch block');
      }
  
   }
  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address"  onChange={e =>{setEmail(e.currentTarget.value);} }/>

        <TextField
          name="password"
          label="Password"
          onChange={e => setPassword(e.currentTarget.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large"  variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
