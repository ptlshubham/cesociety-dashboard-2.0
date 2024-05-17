import { ChartType } from './dashboard.model';

const walletOverview: ChartType = {
    chart: {
        width: 227,
        height: 227,
        type: 'pie'
    },
    colors: ["#777aca", "#5156be", "#a8aada"],
    legend: { show: !1 },
    stroke: {
        width: 0
    },
    series: [2, 3],
    labels: [],
};
export { walletOverview };
