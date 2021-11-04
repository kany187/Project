import React from 'react'
import { Line } from 'react-chartjs-2'
import Slider from 'react-slick'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const data = {
  labels: ['1D', '1W', '1M', '3M', '1Y'],
  datasets: [
    {
      label: '# of Votes',
      data: [4, 19, 3, 5, 2],
      fill: false,
      backgroundColor: 'orange',
      borderColor: 'orange',
    },
  ],
}

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
        drawBorder: false,
        lineWidth: 0.5,
      },
      ticks: {
        display: false
    }
    },
  },
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      // style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    >
      <ArrowBackIosIcon className='slideArrow nextIc'/>
    </div>
  )
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props
  return (
    <div className={className} onClick={onClick}>
      <ArrowBackIosIcon className='slideArrow' />
    </div>
  )
}

const LineChart = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // arrows:false
  }
  return (
    <>
      <Slider {...settings}>
          <Line className='lineChartMain' data={data} options={options} />
          <Line className='lineChartMain' data={data} options={options} />
          <Line className='lineChartMain' data={data} options={options} />
      </Slider>
    </>
  )
}

export default LineChart
