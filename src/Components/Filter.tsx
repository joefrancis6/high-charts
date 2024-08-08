import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  IAppData,
  ICategory,
  INIT_APP_DATA,
  IProduct,
} from "../utils/constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

async function getCategoryData(
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>,
  getAppData: (data: IAppData) => void,
  appData: IAppData
) {
  const url = "https://dummyjson.com/products/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    setCategories(json);
    getAppData({ ...appData, categories: json });
  } catch (error: any) {
    console.error(error.message);
  }
}

const getCategoryProducts = async (
  category: string,
  setSelectedCategory: React.Dispatch<React.SetStateAction<ICategory>>,
  setCategoryProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
  categories: ICategory[],
  setProductName: React.Dispatch<React.SetStateAction<string[]>>,
  setIsRunReportBoolean: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const selectedCategory = categories.find((e) => e.name === category);
  const url = (selectedCategory as ICategory).url;
  setSelectedCategory(selectedCategory as ICategory);
  setProductName([]);
  setIsRunReportBoolean(true);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    setCategoryProducts(json.products);
  } catch (error: any) {
    console.error(error.message);
  }
};

const clearFilter = (
  setSelectedCategory: React.Dispatch<React.SetStateAction<ICategory>>,
  setCategoryProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
  setProductName: React.Dispatch<React.SetStateAction<string[]>>,
  setIsRunReportBoolean: React.Dispatch<React.SetStateAction<boolean>>,
  getAppData: (data: IAppData) => void,
  filterCategories: ICategory[]
) => {
  setSelectedCategory({} as ICategory);
  setCategoryProducts([]);
  setProductName([]);
  setIsRunReportBoolean(false);
  getAppData({ ...INIT_APP_DATA, categories: filterCategories });
};

const Filter = (props: {
  getAppData: (data: IAppData) => void;
  appData: IAppData;
}) => {
  const { getAppData, appData } = props;
  const { categories, selectedCategory, selectedCategoryProducts } = appData;
  const theme = useTheme();

  const [productName, setProductName] = useState<string[]>(
    selectedCategoryProducts.length
      ? selectedCategoryProducts.map((prod) => prod.title)
      : []
  );
  const [filterCategories, setFilterCategories] = useState<ICategory[]>(
    categories.length ? categories : []
  );
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<ICategory>(
      selectedCategory?.name ? selectedCategory : ({} as ICategory)
    );
  const [filterCategoryProducts, setFilterCategoryProducts] = useState<
    IProduct[]
  >([]);
  const [isRunReportBoolean, setIsRunReportBoolean] = useState<boolean>(false);

  useEffect(() => {
    getCategoryData(setFilterCategories, getAppData, appData);
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof productName>) => {
    const {
      target: { value },
    } = event;
    setProductName(typeof value === "string" ? value.split(",") : value);
    setIsRunReportBoolean(true);
  };

  const onClickRunReport = () => {
    const selectedProducts = productName.map((e) =>
      filterCategoryProducts.find((el) => el.title === e)
    );
    getAppData({
      categories: filterCategories,
      selectedCategory: selectedFilterCategory,
      selectedCategoryProducts: selectedProducts as IProduct[],
      categoryProducts: filterCategoryProducts,
    });
    setIsRunReportBoolean(false);
  };

  return (
    <div className="filter">
      <div className="filter-headers">
        <h1>Filters</h1>
        <Button
          variant="text"
          className="clear-button"
          onClick={() =>
            clearFilter(
              setSelectedFilterCategory,
              setFilterCategoryProducts,
              setProductName,
              setIsRunReportBoolean,
              getAppData,
              filterCategories
            )
          }
        >
          Clear
        </Button>
      </div>
      <div className="filter-select-box">
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category"
            id="category"
            value={selectedFilterCategory?.name || ""}
            label="Category"
            onChange={(e) =>
              getCategoryProducts(
                e.target.value as string,
                setSelectedFilterCategory,
                setFilterCategoryProducts,
                filterCategories,
                setProductName,
                setIsRunReportBoolean
              )
            }
            className="select-box"
            MenuProps={MenuProps}
          >
            {filterCategories.map((category) => {
              return (
                <MenuItem key={category.name} value={category.name}>
                  {category.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel id="product-label">Products</InputLabel>
          <Select
            labelId="product"
            id="product"
            multiple
            value={productName}
            onChange={handleChange}
            label="Products"
            MenuProps={MenuProps}
            className="select-box"
            readOnly={filterCategoryProducts.length === 0}
          >
            {filterCategoryProducts.map((product) => (
              <MenuItem
                key={product.id}
                value={product.title}
                style={getStyles(product.title, productName, theme)}
              >
                {product.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Button
        variant="contained"
        className="report-button"
        disabled={!isRunReportBoolean}
        onClick={onClickRunReport}
      >
        Run Report
      </Button>
    </div>
  );
};
export default Filter;
