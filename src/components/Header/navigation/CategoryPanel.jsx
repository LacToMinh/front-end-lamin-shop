import Box from "@mui/material/Box";
import { IoCloseSharp } from "react-icons/io5";

import { Drawer } from "@mui/material";
import "./style.css";
import CategoryCollapse from "../../CategoryCollapse";

const CategoryPanel = (props) => {
  const DrawerList = (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      // onClick={() => props.openCategoryPanel(false)}
      className="categoryPanel"
    >
      <h3 className="p-4 pl-4 text-[18px] font-bold border-b-[1.5px] flex items-center justify-between">
        Shop by Category{" "}
        <IoCloseSharp
          onClick={() => props.openCategoryPanel(false)}
          className="cursor-pointer text-[30px]"
        />
      </h3>
      {props?.data?.length !== 0 && <CategoryCollapse className="!ml-5" data={props.data} />}

      
    </Box>
  );

  return (
    <>
      <Drawer
        open={props.isOpenCatPanel}
        onClose={() => props.openCategoryPanel(false)}
      >
        {DrawerList}
      </Drawer>
    </>
  );
};

export default CategoryPanel;
