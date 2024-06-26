import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useSnackbar } from "notistack";
import { Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import instance from "../axios/axios";

const Register = () => {
  const { getLoggedIn, loggedIn } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const intialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  };
  const [formData, setFormData] = React.useState(intialState);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field and update the errors stateFpro
    if (formData.name.trim() === "") {
      newErrors.name = "First Name is required";
      isValid = false;
    }

    

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (formData.role.trim() === "") {
      newErrors.role = "Role is required";
      isValid = false;
    }

    

    setErrors(newErrors);
    return isValid;
  };

  const handleOnSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log(formData);
    await instance.post(`/createuser`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      .then((response) => {
        const { token, result } = response.data || {};
        localStorage.setItem("token", token);
        localStorage.setItem("AuthenticatedUser", JSON.stringify(result));
        setFormData(intialState);
        if (response.data.message) {
          console.log(response.data.message);
          enqueueSnackbar(response.data.message, { variant: "success" });
          getLoggedIn();
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          console.log(err.response.data.message);
          enqueueSnackbar(err.response.data.message, { variant: "error" });
        }
      });
  };

  return (
    <div>
      {loggedIn && <Navigate to="/" />}

      <div className="shadow-md p-5 md:w-96 w-fit mx-auto mt-10 flex items-center justify-center h-full">
        <form method="post" onSubmit={(e) => handleOnSubmit(e)}>
          <h1 className="text-center font-semibold text-blue-800 text-2xl">
            Sign up
          </h1>
          <TextField
            margin="dense"
            value={formData.name}
            onChange={(e) => handleOnChange(e)}
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            error={errors.name}
            helperText={errors.name}
          />
          
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleOnChange(e)}
            variant="outlined"
            fullWidth
            error={errors.email}
            helperText={errors.email}
          />
           <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              name="role"
              onChange={(e) => handleOnChange(e)}
              label="Role"
              error={errors.role}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="company">Company</MenuItem>
              
            </Select>
            {errors.role && (
              <span style={{ color: "red", fontSize: "0.75rem" }}>
                {errors.role}
              </span>
            )}
          </FormControl>
          <TextField
            margin="dense"
            label="Password"
            name="password"
            value={formData.password}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            onChange={(e) => handleOnChange(e)}
            fullWidth
            error={errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            onChange={(e) => handleOnChange(e)}
            fullWidth
            error={errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
         

         
          
          {/* <FormControl margin="dense">
            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="male"
              name="gender"
              onChange={(e) => handleOnChange(e)}
              value={formData.gender}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl> */}

          <div className="my-5">
            <Button variant="contained" color="primary" fullWidth type="submit">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
