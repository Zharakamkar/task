import { useState } from "react";
import {
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { request } from "../Utility/request";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const theme = createTheme({
  direction: "rtl", // Both here and <body dir="rtl">
});
// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
    showPass: false,
  });
  const navigate = useNavigate();
  const getLogin = async (data) => {
    try {
      const response = await request.post("/auth/login", data);
      console.log(response.data);

      sessionStorage.setItem("adminToken", response.data.accessToken);
      navigate("/");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const handlePassVisibilty = () => {
    setValues({
      ...values,
      showPass: !values.showPass,
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    getLogin(data);
  };

  return (
    <>
      <div>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
              <Grid
                container
                direction={"column"}
                spacing={2}
                justifyContent={"center"}
                style={{ minHeight: "100vh" }}
              >
                <Paper elevation={2} sx={{ padding: 5 }}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container direction={"column"} spacing={4}>
                      <Grid item>
                        <Controller
                          control={control}
                          name="username"
                          render={({ field }) => (
                            <TextField
                              type="text"
                              fullWidth
                              label="نام کاربری "
                              placeholder="نام کاربری "
                              variant="outlined"
                              {...field}
                            />
                          )}
                          rules={{
                            required: "نام کاربری خود را وارد کنید ",
                            minLength: {
                              value: 4,
                              message: "رمز  عبور کمتر از 4 کارکتر میباشد ",
                            },
                          }}
                        />
                        {errors.email && (
                          <p style={{ color: "red" }}>{errors.email.message}</p>
                        )}
                      </Grid>
                      <Grid item>
                        <Controller
                          control={control}
                          name="password"
                          render={({ field }) => (
                            <TextField
                              type={values.showPass ? "text" : "password"}
                              fullWidth
                              label=" رمز عبور "
                              placeholder="رمز عبور "
                              variant="outlined"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={handlePassVisibilty}
                                      aria-label="toggle password"
                                      edge="end"
                                    >
                                      {values.showPass ? (
                                        <VisibilityOffIcon />
                                      ) : (
                                        <VisibilityIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              {...field}
                            />
                          )}
                          rules={{
                            required: "رمز عبور را وارد کنید ",
                            minLength: {
                              value: 6,
                              message: "رمز  عبور کمتر از 6 کارکتر میباشد ",
                            },
                          }}
                        />
                        {errors.password && (
                          <p style={{ color: "red" }}>
                            {errors.password.message}
                          </p>
                        )}
                      </Grid>
                      <Grid item>
                        <Button variant="contained" fullWidth type="submit">
                          ورود
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Container>
          </ThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
};

export default Login;
