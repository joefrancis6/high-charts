export interface IAppData {
  categories: ICategory[];
  selectedCategory: ICategory;
  selectedCategoryProducts: IProduct[];
  categoryProducts: IProduct[];
}

export const INIT_APP_DATA: IAppData = {
  categories: [],
  selectedCategory: {} as ICategory,
  selectedCategoryProducts: [],
  categoryProducts: [],
};

export interface ICategory {
  slug: string;
  name: string;
  url: string;
}

interface IProductDimension {
  width: number;
  height: number;
  depth: number;
}

interface IProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface IProducrMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: IProductDimension;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: IProducrMeta;
  images: string[];
  thumbnail: string;
}

export const pieOptions: Highcharts.Options = {
  chart: {
    plotBackgroundColor: "#eeeeee",
    plotBorderWidth: 1,
    plotShadow: false,
    height: 600,
    width: 800,
  },
  title: {
    text: "list of categories",
  },
  tooltip: {
    pointFormat: "{series.name}",
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",

      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>",
        style: {
          color: "black",
        },
      },
    },
  },
  series: [
    {
      type: "pie",
      name: "Categories",
    },
  ],
};

export const columnChartOptions: Highcharts.Options = {
  chart: {
    type: "column",
    height: 600,
    width: 800,
  },
  title: {
    text: "Products in the selected category list",
  },
  xAxis: {
    type: "Products",
    labels: {
      rotation: -45,
      style: {
        fontSize: "13px",
        fontFamily: "Verdana, sans-serif",
      },
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "Category",
    },
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    pointFormat: "Product price: <b>{point.y:.1f}</b>",
  },
  series: [
    {
      name: "Products",
    },
  ],
};
