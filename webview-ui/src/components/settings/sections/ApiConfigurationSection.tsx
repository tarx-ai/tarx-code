import { useExtensionState } from "@/context/ExtensionStateContext"
import ApiOptions from "../ApiOptions"
import Section from "../Section"

interface ApiConfigurationSectionProps {
	renderSectionHeader?: (tabId: string) => JSX.Element | null
}

const ApiConfigurationSection = ({ renderSectionHeader }: ApiConfigurationSectionProps) => {
	const { mode } = useExtensionState()
	return (
		<div>
			{renderSectionHeader?.("api-config")}
			<Section>
				{/* TARX uses local inference - simplified API config */}
				<ApiOptions currentMode={mode} showModelOptions={true} />
			</Section>
		</div>
	)
}

export default ApiConfigurationSection
