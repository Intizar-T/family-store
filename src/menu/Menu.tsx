import { TabContext, TabList } from "@mui/lab";
import { Box, Grid, Tab } from "@mui/material";
import { useState } from "react";

export type MenuTabValueType = "products" | "onDuty";

export default function Menu() {
  const [menuTabValue, setMenuTabValue] =
    useState<MenuTabValueType>("products");
  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <TabContext value={menuTabValue}>
        <Box
          sx={{
            height: 60,
            width: "100%",
            p: 0,
          }}
        >
          <TabList
            centered
            onChange={(_, value) => {
              setMenuTabValue(value as MenuTabValueType);
            }}
          >
            <Tab value="products" label="Produktlar" />
            <Tab value="onDuty" label="Nobatchylyk" />
          </TabList>
        </Box>
      </TabContext>
    </Grid>
  );
}
