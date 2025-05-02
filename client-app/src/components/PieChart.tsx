import * as echarts from 'echarts';
import { useEffect, useId, useMemo } from 'react';

type PieChartProps = {
  data: {
    value: number;
    name: string;
  }[];
  title?: string;
  subtext?: string;
  width?: number | string;
  height?: number | string;
}


export default function PieChart({ data, title, subtext, width = '100%', height = 400 }: PieChartProps) {
  const id = useId();;

  // const option = useMemo(() => ({
  //   title: {
  //     text: title,
  //     subtext: subtext,
  //     left: 'center'
  //   },
  //   tooltip: {
  //     trigger: 'item'
  //   },
  //   legend: {
  //     orient: 'vertical',
  //     left: 'left'
  //   },
  //   series: [
  //     {
  //       name: 'Status Aduan',
  //       type: 'pie',
  //       radius: '50%',
  //       data: data,
  //       emphasis: {
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowOffsetX: 0,
  //           shadowColor: 'rgba(0, 0, 0, 0.5)'
  //         }
  //       }
  //     }
  //   ]
  // }), [data, title, subtext]);

  const option1 = useMemo(() => ({
    title: {
      text: title,
      subtext: subtext,
      left: 'center'
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      top: "200px",
      left: "0%",
      right: "20px",
      bottom: "0%",
      containLabel: true
    },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: data ? data.map((item) => item.name) : [],
    },
    series: [
      {
        label: {
          show: true,
          position: "right",
          color: "#000",
          fontWeight: "bold"
        },
        name: "Ticket",
        type: "bar",
        color: "#0075a6",
        data: data
      },
      {
        type: "pie",
        radius: [0, "50px"],
        center: ["50%", "100px"],
        data: data
      }
    ]
  }), [data, title, subtext]);

  useEffect(() => {
    const chartDom = document.getElementById(id);
    const myChart = echarts.init(chartDom);
    myChart.setOption(option1);

    return () => {
      myChart.dispose();
    }
  }, [option1, id]);

  return (
    <div id={id} style={{ width, height }} className='bg-slate-100 p-5 rounded-lg'></div>
  )
}
