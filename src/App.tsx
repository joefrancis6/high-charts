import React, { useEffect, useState } from "react";
import "./App.css";
import Filter from "./Components/Filter";
import Chart from "./Components/Chart";
import {
  columnChartOptions,
  ICategory,
  IProduct,
  pieOptions,
} from "./utils/constants";

function App() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<ICategory>(
    {} as ICategory
  );

  const [categoryProducts, setCategoryProducts] = useState<IProduct[]>([]);

  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<
    IProduct[]
  >([]);

  const [isRunReportClicked, setIsRunReportClicked] = useState<boolean>(false);

  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    if (selectedCategoryProducts.length && isRunReportClicked && columnChartOptions?.series) {
      columnChartOptions.series[0].data = [];
      const columnChartProductData: [string, number][] = [];
      selectedCategoryProducts.forEach((product) => {
        columnChartProductData.push([product.title, product.price]);
      })
      columnChartOptions.series[0].data = columnChartProductData;
      setChartData(columnChartOptions);
    } else {
      if (pieOptions?.series?.length && !isRunReportClicked) {
        pieOptions.series[0].data = [];
        const pieChartCategoryData: [string, number][] = [];
        categories?.forEach((cat) => {
          pieChartCategoryData.push([cat.name, 1]);
        });
        pieOptions.series[0].data = pieChartCategoryData;
        setChartData(pieOptions);
      }
    }
  }, [isRunReportClicked, categories.length, selectedCategoryProducts.length]);

  return (
    <div className="App" style={{ display: "flex" }}>
      <Filter
        categories={categories}
        setCategories={setCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryProducts={categoryProducts}
        setCategoryProducts={setCategoryProducts}
        selectedCategoryProducts={selectedCategoryProducts}
        setSelectedCategoryProducts={setSelectedCategoryProducts}
        isRunReportClicked={isRunReportClicked}
        setIsRunReportClicked={setIsRunReportClicked}
      />
      {categories.length ? (
        <Chart
          categories={categories}
          selectedCategory={selectedCategory}
          categoryProducts={categoryProducts}
          selectedCategoryProducts={selectedCategoryProducts}
          isRunReportClicked={isRunReportClicked}
          chartData={chartData}
        />
      ) : null}
    </div>
  );
}

export default App;
