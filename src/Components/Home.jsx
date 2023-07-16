import {
  Button,
  Container,
  Grid,
  Autocomplete,
  Paper,
  TextField,
} from "@mui/material";

import IranSans from "/font/IRANSans.woff2";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { request } from "../Utility/request";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
const adminToken = sessionStorage.getItem("adminToken");
const fetchData = async (url) => {
  const response = await request.get(url, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

const theme = createTheme({
  direction: "rtl", // Both here and <body dir="rtl">

  fontFamily: "IranSans, Arial",

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'IranSans';
          font-style: normal;
          font-weight: 400;
          url(${IranSans}) format('woff2');
         
        }
      `,
    },
  },
});
// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const Home = () => {
  const [cityId, setCityId] = useState();
  const [provinceID, setprovinceID] = useState();
  const [cityData, setCityData] = useState([]);
  const [provinceData, setProvinceData] = useState();

  console.log(cityData);
  const onSubmit = () => {
    console.log(city);
  };
  console.log(cityId);

  const { data: city } = useQuery(
    ["city"],
    () => fetchData(`/agency/getCity`),
    {
      onSuccess: (data) => {
        setCityData(data?.data);
        console.log(data);
      },
    }
  );

  const { data: province } = useQuery(
    ["province"],
    () => fetchData(`/agency/getProvince`),
    {
      onSuccess: (data) => {
        setProvinceData(data?.data);
        console.log(data);
      },
    }
  );

  useEffect(() => {
    if (provinceID) {
      const temp = city?.data.filter(
        (item) => item.provinceId === +provinceID.id
      );
      setCityData(temp);

      console.log(temp, "1");
    } else {
      if (city !== undefined) {
        setCityData(city?.data);
        console.log(city, "2");
      }
    }
    if (cityId) {
      const temp = province?.data.filter(
        (item) => item.id === +cityId.provinceId
      );
      setProvinceData(temp);
      console.log(temp);
    } else {
      setProvinceData(province?.data);
    }
  }, [cityId, provinceID]);

  return (
    <>
      <div>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Container
              maxWidth="md"
              sx={{
                fontFamily: "IranSans",
              }}
            >
              <Grid
                container
                direction={"column"}
                spacing={2}
                justifyContent={"center"}
                style={{ minHeight: "100vh" }}
              >
                <Paper elevation={1} sx={{ padding: 3 }}>
                  <form onSubmit={onSubmit}>
                    <Grid container spacing={4} justifyContent={"center"}>
                      <Grid item>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={provinceData}
                          //   value={{ id: 5, name: " تبریز" }}
                          getOptionLabel={(option) => option.name}
                          onChange={(e, obj) => setprovinceID(obj)}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField {...params} label="استان" />
                          )}
                        />
                      </Grid>
                      <Grid item>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          //   value={{ id: 43, provinceId: 10, name: "آرين شهر" }}
                          sx={{ width: 300 }}
                          options={cityData}
                          onChange={(e, obj) => setCityId(obj)}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField {...params} label="شهر" />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
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

export default Home;
