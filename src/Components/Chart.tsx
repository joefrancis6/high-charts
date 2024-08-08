import Highcharts from "highcharts";
import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import { columnChartOptions, IAppData, pieOptions } from "../utils/constants";

const Chart = (props: { appData: IAppData }) => {
  const chartKey = Math.random();
  const [chartData, setChartData] = useState<any>({});

  const { appData } = props;

  const {
    categories,
    selectedCategory,
    selectedCategoryProducts,
    categoryProducts,
  } = appData;

  useEffect(() => {
    if (
      (selectedCategoryProducts.length || selectedCategory?.name) &&
      columnChartOptions?.series
    ) {
      const displaProductsArray = selectedCategoryProducts.length
        ? selectedCategoryProducts
        : categoryProducts;
      columnChartOptions.series[0].data = [];
      const columnChartProductData: [string, number][] = [];
      displaProductsArray.forEach((product) => {
        columnChartProductData.push([product.title, product.price]);
      });
      columnChartOptions.series[0].data = columnChartProductData;
      setChartData(columnChartOptions);
    } else {
      if (pieOptions?.series?.length) {
        pieOptions.series[0].data = [];
        const pieChartCategoryData: [string, number][] = [];
        categories?.forEach((cat) => {
          pieChartCategoryData.push([cat.name, 1]);
        });
        pieOptions.series[0].data = pieChartCategoryData;
        setChartData(pieOptions);
      }
    }
  }, [appData]);

  return (
    <div>
      <HighchartsReact
        key={chartKey}
        highcharts={Highcharts}
        options={chartData as Highcharts.Options}
      />
    </div>
  );
};

export default Chart;
