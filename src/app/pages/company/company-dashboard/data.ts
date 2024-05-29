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
const donutChart: ChartType = {
    chart: { height: 320, type: "donut" },
    series: [44, 55, 41, 17, 15],
    labels: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"],
    colors: ["#2ab57d", "#5156be", "#fd625e", "#4ba6ef", "#ffbf53"],
    legend: {
        show: !0,
        position: "bottom",
        horizontalAlign: "center",
        verticalAlign: "middle",
        floating: !1,
        fontSize: "14px",
        offsetX: 0,
    },
    responsive: [
        {
            breakpoint: 600,
            options: { chart: { height: 240 }, legend: { show: !1 } },
        },
    ],
};
// const barChart: ChartType = {
//     chart: { height: 350, type: "bar", toolbar: { show: !1 } },
//     plotOptions: { bar: { horizontal: !0 } },
//     dataLabels: { enabled: !1 },
//     series: [{ data: [380, 430, 450, 475, 550, 584, 780, 1100, 1220, 1365] }],
//     colors: ['#2ab57d'],
//     grid: { borderColor: "#f1f1f1" },
//     xaxis: {
//         categories: [

//         ],
//     },
// };
const investedOverview: ChartType = {
    chart: {
        height: 270,
        type: 'radialBar',
        offsetY: -10
    },
    plotOptions: {
        radialBar: {
            startAngle: -130,
            endAngle: 130,
            dataLabels: {
                name: {
                    show: false
                },
                value: {
                    offsetY: 10,
                    fontSize: '18px',
                    color: undefined,
                    formatter: function (val: any) {
                        return val + "%";
                    }
                }
            }
        }
    },
    colors: ['#5156be'],
    fill: {
        type: "gradient",
        gradient: {
            shade: "dark",
            type: "horizontal",
            gradientToColors: ['#34c38f'],
            shadeIntensity: 0.15,
            inverseColors: !1,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [20, 60],
        },
    },
    stroke: {
        dashArray: 4,
    },
    legend: {
        show: false
    },
    series: [80],
    labels: ['Series A'],
};
const TodoList = [
    {
        icon: 'mdi mdi-currency-btc',
        avatar_icon: 'mdi-bitcoin',
        title: 'Keryar',
        content: 'Welcome to Keryar IT Solution At  Keryar IT Solution, we strive to streamline business operations with cutting-edge technology solutions. Our internal portal provides a comprehensive suite of tools designed to enhance productivity and ensure seamless management of daily tasks for our team. Our Key Features:Token Generation: Simplify and secure access to various company resources with our efficient token generation system.Scheduling: Manage your appointments and meetings effortlessly using our intuitive scheduling tool. Keep track of all client information in one central location, ensuring you have up-to-date details at your fingertips.Attendance: Monitor and manage employee attendance with ease, ensuring accurate and timely tracking of work hours.Meet Our CEO: Rumit Vaghela'
    },

];

export { walletOverview, donutChart, investedOverview, TodoList };
