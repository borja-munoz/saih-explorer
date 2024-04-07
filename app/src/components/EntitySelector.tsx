import { ReactElement, useEffect, useState } from "react";

import { Drawer, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';

import { executeQuery } from "../db/duckdb";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedEntity } from "../store/appSlice";

export const DRAWER_WIDTH = 350;

export type SelectedEntity = {
  type: 'basin' | 'province' | 'station';
  name: string;
};

const NavDrawer = styled("nav")(({ theme }: { theme: Theme }) => ({
  flex: "0 0 auto",
  position: "relative",
  width: DRAWER_WIDTH,
  flexShrink: 0,
}));

const DrawerDesktop = styled(Drawer)(() => ({
  "& .MuiPaper-root": {
    width: DRAWER_WIDTH,
    position: "absolute",
    height: "100vh",
    padding: "20px",
    borderWidth: "0px",
  },
}));

export default function EntitySelector() {
  const dispatch = useDispatch();
  const dbInitialized = useSelector((state: RootState) => state.app.dbInitialized);
  const [data, setData] = useState<any[] | undefined>();
  const treeItems: ReactElement[]  = [];

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        SELECT id AS station_id,
               name AS station_name,
               province
        FROM stations
        ORDER BY province, name
      `;
      const arrowTable = await executeQuery(query);
      setData(arrowTable?.toArray());
    };
  
    if (dbInitialized) {
      fetchData();
    }
  }, [dbInitialized]);

  if (data !== undefined) {
    let currentProvince = data[0].province;
    let stationItems: ReactElement[]  = [];
    data.forEach((station, index) => {
      if (station.province !== currentProvince) {
        treeItems.push(
          <TreeItem 
            key={index * -1} 
            itemId={String(index * -1)} 
            label={currentProvince}
          >
            {stationItems}
          </TreeItem>
        );  
        currentProvince = station.province;
        stationItems = [];
      }
      stationItems.push(
        <TreeItem 
          key={index} 
          itemId={String(station.station_id)} 
          label={station.station_name} 
        />
      );
    });
  }

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      dispatch(setSelectedEntity({
        type: 'basin',
        name: itemId
      }));
    }
  };

  return (
    <NavDrawer>
      <DrawerDesktop variant="permanent" anchor="left" open>
        <SimpleTreeView
          // expandedItems={['hidrosur']}
          aria-label="Entity Selector"
          sx={{ height: 200, flexGrow: 1, maxWidth: 350, overflowY: "auto" }}
          onItemSelectionToggle={handleItemSelectionToggle}
        >
          <TreeItem itemId="hidrosur" label="Hidrosur">
            {treeItems}
          </TreeItem>
        </SimpleTreeView>
      </DrawerDesktop>
    </NavDrawer>
  );
}
