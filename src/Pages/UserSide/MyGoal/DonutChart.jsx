import React from 'react'
import DonutChart from 'react-donut-chart'

const DonutChartComp = ({data,label}) => {
  return (
    <div className='donutContainer'>
      <DonutChart
        data={data}
        innerRadius={0.55}
        emptyOffset={1}
        toggledOffset={0}
        selectedOffset={0}
        emptyColor={'#ffff'}
        strokeColor={'transparent'}
        colors={['#0CB868', 'purple', 'red']}
        width={170}
        height={170}
        legend={false}
        style={{ margin: '0px auto' }}
        className="custom_donut_chart"
      />
      <p className="centrText">{label}</p>
    </div>
  )
}

export default DonutChartComp
