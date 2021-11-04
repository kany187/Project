import React from 'react'
import { Link } from 'react-router-dom'
import './Btn.css'

const CustomButton = ({
  type,
  onClick,
  className,
  value,
  style,
  link,
  path,
}) => {
  return (
    <div>
      {link ? (
        <Link className={`cus_btn ${className}`} to={path}>
          {value}
        </Link>
      ) : (
        <button
        variant="contained"
          type={type}
          onClick={onClick}
          className={`cus_btn ${className}`}
          style={style}
        >
          {value}
        </button>
      )}
    </div>
  )
}

export default CustomButton
