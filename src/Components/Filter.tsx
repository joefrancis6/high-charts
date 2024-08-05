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
import { ICategory, IProduct } from "../utils/constants";

export interface IFilterProps {
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  selectedCategory: ICategory;
  setSelectedCategory: React.Dispatch<React.SetStateAction<ICategory>>;
  categoryProducts: IProduct[];
  setCategoryProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  selectedCategoryProducts: IProduct[];
  setSelectedCategoryProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  isRunReportClicked: boolean;
  setIsRunReportClicked: React.Dispatch<React.SetStateAction<boolean>>;
  chartData?: any;
}

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
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>
) {
  const url = "https://dummyjson.com/products/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    setCategories(json);
  } catch (error: any) {
    console.error(error.message);
  }
}

const getCategoryProducts = async (
  category: string,
  setSelectedCategory: React.Dispatch<React.SetStateAction<ICategory>>,
  setCategoryProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
  categories: ICategory[],
  setProductName: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const selectedCategory = categories.find((e) => e.name === category);
  const url = (selectedCategory as ICategory).url;
  setSelectedCategory(selectedCategory as ICategory);
  setProductName([]);
  // setIsRunReportClicked(false);
  // setSelectedCategoryProducts([]);
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
  setSelectedCategoryProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
  setProductName: React.Dispatch<React.SetStateAction<string[]>>,
  setIsRunReportClicked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSelectedCategory({} as ICategory);
  setCategoryProducts([]);
  setSelectedCategoryProducts([]);
  setProductName([]);
  setIsRunReportClicked(false);
};

const Filter = (props: IFilterProps) => {
  const {
    categories,
    setCategories,
    categoryProducts,
    setSelectedCategory,
    setCategoryProducts,
    selectedCategory,
    setSelectedCategoryProducts,
    setIsRunReportClicked,
    selectedCategoryProducts,
  } = props;
  // selectedCategory, setSelectedCategory, categoryProducts, setCategoryProducts, selectedCategoryProducts, setSelectedCategoryProducts
  const theme = useTheme();
  const [productName, setProductName] = useState<string[]>(
    selectedCategoryProducts.length
      ? selectedCategoryProducts.map((prod) => prod.title)
      : []
  );
  useEffect(() => {
    getCategoryData(setCategories);
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof productName>) => {
    const {
      target: { value },
    } = event;
    // const selectedProducts = value === 'string' ? value.split(',').map(e => categoryProducts.find(el => el.title === e)) : (value as string[]).map(e => categoryProducts.find(el => el.title === e))
    // setSelectedCategoryProducts(selectedProducts as IProduct[]);
    setProductName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const onClickRunReport = () => {
    setIsRunReportClicked(true);
    const selectedProducts = productName.map((e) =>
      categoryProducts.find((el) => el.title === e)
    );
    setSelectedCategoryProducts(selectedProducts as IProduct[]);
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
              setSelectedCategory,
              setCategoryProducts,
              setSelectedCategoryProducts,
              setProductName,
              setIsRunReportClicked
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
            value={selectedCategory?.name || ""}
            label="Category"
            onChange={(e) =>
              getCategoryProducts(
                e.target.value as string,
                setSelectedCategory,
                setCategoryProducts,
                categories,
                setProductName
              )
            }
            className="select-box"
            MenuProps={MenuProps}
          >
            {categories.map((category) => {
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
            readOnly={categoryProducts.length === 0}
          >
            {categoryProducts.map((product) => (
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
        disabled={productName.length === 0}
        onClick={onClickRunReport}
      >
        Run Report
      </Button>
    </div>
  );
};
export default Filter;
