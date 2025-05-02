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

  const option = useMemo(() => ({
    title: {
      text: title,
      subtext: subtext,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Status Aduan',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }), [data, title, subtext]);

  useEffect(() => {
    const chartDom = document.getElementById(id);
    const myChart = echarts.init(chartDom);
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    }
  }, [option, id]);

  return (
    <div id={id} style={{ width, height }} className='bg-slate-100 p-5 rounded-lg'></div>
  )
}
