import { SVGProps } from "react"
import type { Environment } from "../../../src/config"
import { getEnvironmentColor } from "../utils/environmentColors"

/**
 * TarxLogoSanta component renders the TARX logo with a festive Santa hat
 * Includes automatic theme adaptation and environment-based color indicators.
 *
 * This festive version adds a Santa hat to the TARX logo while maintaining
 * the same theme and environment color system as TarxLogoVariable.
 *
 * @param {SVGProps<SVGSVGElement> & { environment?: Environment }} props - Standard SVG props plus optional environment
 * @returns {JSX.Element} SVG TARX logo with Santa hat that adapts to VS Code themes and environment
 */
const ClineLogoSanta = (props: SVGProps<SVGSVGElement> & { environment?: Environment }) => {
	const { environment, ...svgProps } = props

	// Determine fill color based on environment
	const fillColor = environment ? getEnvironmentColor(environment) : "var(--vscode-icon-foreground)"

	return (
		<svg fill="none" viewBox="0 0 785 702" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
			{/* Bottom arc (smile) */}
			<path
				d="M761.857 366.416C773.587 501.673 671.076 620.569 535.82 632.299C400.563 644.029 281.667 541.518 269.937 406.262C258.207 271.005 360.718 152.109 495.974 140.379C631.231 128.649 750.127 231.16 761.857 366.416Z"
				fill={fillColor}
			/>
			{/* Wave/M shape */}
			<path
				d="M184.957 122.191C215.959 67.5248 267.017 29.0174 325.259 11.1174C383.501 -6.78255 447.652 -3.15788 504.587 21.4003C561.522 45.9585 607.371 89.4389 634.118 144.613C660.864 199.787 666.664 262.755 650.471 322.003C677.179 292.119 697.396 256.595 709.513 217.945C721.63 179.294 725.333 138.523 720.383 98.3743C715.434 58.2252 701.943 19.6457 680.869 -14.9318C659.796 -49.5092 631.62 -79.3657 598.2 -102.34C564.78 -125.314 526.833 -140.91 486.845 -148.047C446.857 -155.184 405.759 -153.699 366.399 -143.689C327.04 -133.678 290.409 -115.36 259.011 -90.0248C227.613 -64.6895 202.158 -33.0236 184.369 3.08817C184.369 3.08817 121.327 113.261 99.9156 195.972C80.4127 271.382 82.0969 380.959 82.0969 380.959C94.7174 306.252 121.661 234.564 161.622 170.195C169.326 157.777 177.347 145.554 184.957 122.191Z"
				fill={fillColor}
			/>
			{/* Left dot (eye) */}
			<circle cx="124.083" cy="245.644" fill={fillColor} r="36.29" />
			{/* Right dot (eye) */}
			<circle cx="660.501" cy="240.085" fill={fillColor} r="36.318" />

			{/* Santa hat - main red body */}
			<path
				d="M680 80 L750 20 C760 10 770 15 765 30 L720 120 C715 135 700 140 680 135 L550 100 C520 92 500 75 510 55 L540 10 C550 -5 580 -10 620 5 L680 80Z"
				fill="#CC3333"
			/>
			{/* Santa hat - white fur trim */}
			<path
				d="M500 90 C480 85 460 100 470 115 L680 160 C710 168 730 155 725 135 L720 120 C715 105 700 100 680 95 L500 90Z"
				fill="white"
			/>
			{/* Santa hat - white pom-pom */}
			<circle cx="765" cy="25" fill="white" r="25" />
		</svg>
	)
}
export default ClineLogoSanta
