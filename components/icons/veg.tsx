import * as React from "react"

const VegIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 12 12"
    xmlSpace="preserve"
    {...props}
  >
    <path
      style={{
        fill: "#fff",
        stroke: "#00a14b",
        strokeWidth: 0.5,
        strokeMiterlimit: 10,
      }}
      d="M.26.26h11.49v11.49H.26z"
    />
    <circle
      cx={6.18}
      cy={6.01}
      r={3}
      style={{
        fill: "#00a14b",
        stroke: "#00a14b",
        strokeWidth: 0.25,
        strokeMiterlimit: 10,
      }}
    />
  </svg>
)
export default VegIcon
