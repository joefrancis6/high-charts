import Highcharts from "highcharts";
import React from "react";
import HighchartsReact from 'highcharts-react-official';
import { IFilterProps } from "./Filter";

const Chart = (props: Partial<IFilterProps>) => {

   const chartKey = Math.random();
   const {chartData} = props;

    return <div>
      <HighchartsReact  key ={chartKey} highcharts={Highcharts} options={chartData as Highcharts.Options} />
    </div>
}

export default Chart;