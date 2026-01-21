/**
 * TARX App Sidebar
 *
 * A Grok-inspired sidebar using shadcn/ui components.
 * Shows: History/Threads, Context/Sources, Settings at bottom.
 */

import { FileTextIcon, HistoryIcon, MessageSquareIcon, PlusIcon, SettingsIcon } from "lucide-react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { TaskServiceClient } from "@/services/grpc-client"
import { MeshStatusBadge } from "./mesh-status"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "./sidebar"

// TARX Logo
const TarxLogo = () => (
	<svg fill="none" height="20" viewBox="0 0 100 100" width="20" xmlns="http://www.w3.org/2000/svg">
		<circle cx="50" cy="50" fill="url(#tarx-gradient-sidebar)" r="45" />
		<path d="M30 40 Q50 30 70 40" fill="none" stroke="white" strokeLinecap="round" strokeWidth="4" />
		<circle cx="35" cy="45" fill="white" r="5" />
		<circle cx="65" cy="45" fill="white" r="5" />
		<path d="M35 60 Q50 70 65 60" fill="none" stroke="white" strokeLinecap="round" strokeWidth="4" />
		<defs>
			<linearGradient id="tarx-gradient-sidebar" x1="0%" x2="100%" y1="0%" y2="100%">
				<stop offset="0%" stopColor="#ff6b6b" />
				<stop offset="25%" stopColor="#feca57" />
				<stop offset="50%" stopColor="#48dbfb" />
				<stop offset="75%" stopColor="#ff9ff3" />
				<stop offset="100%" stopColor="#54a0ff" />
			</linearGradient>
		</defs>
	</svg>
)

interface AppSidebarProps {
	className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
	const { taskHistory, navigateToHistory, navigateToSettings, navigateToChat } = useExtensionState()

	// Get recent tasks (up to 5)
	const recentTasks = taskHistory?.slice(0, 5) || []

	const handleNewChat = () => {
		TaskServiceClient.clearTask({})
			.catch((error) => {
				console.error("Failed to clear task:", error)
			})
			.finally(() => navigateToChat())
	}

	return (
		<Sidebar className={className} collapsible="icon" side="left" variant="sidebar">
			{/* Header with TARX branding */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" tooltip="TARX Code">
							<TarxLogo />
							<span className="font-semibold">TARX Code</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent>
				{/* New Chat Button */}
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={handleNewChat} tooltip="New Chat">
								<PlusIcon className="size-4" />
								<span>New Chat</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarSeparator />

				{/* Recent Threads */}
				<SidebarGroup>
					<SidebarGroupLabel>
						<MessageSquareIcon className="size-4 mr-2" />
						Recent Threads
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{recentTasks.length > 0 ? (
								recentTasks.map((task, index) => (
									<SidebarMenuItem key={task.id || index}>
										<SidebarMenuButton
											onClick={() => {
												// TODO: Navigate to specific task
												navigateToHistory()
											}}
											tooltip={task.task || "Task"}>
											<MessageSquareIcon className="size-4" />
											<span className="truncate">{task.task?.slice(0, 30) || "Untitled"}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))
							) : (
								<SidebarMenuItem>
									<SidebarMenuButton disabled tooltip="No recent threads">
										<span className="text-muted-foreground text-xs">No recent threads</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)}
							{recentTasks.length > 0 && (
								<SidebarMenuItem>
									<SidebarMenuButton onClick={navigateToHistory} tooltip="View All History">
										<HistoryIcon className="size-4" />
										<span>View All History</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				{/* Context / Sources (placeholder for RAG files) */}
				<SidebarGroup>
					<SidebarGroupLabel>
						<FileTextIcon className="size-4 mr-2" />
						Context
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton disabled tooltip="Context files appear here">
									<span className="text-muted-foreground text-xs">
										Files and context will appear here when added to a conversation
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator />

			{/* Footer with Settings and Status */}
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="px-2 py-1">
							<MeshStatusBadge />
						</div>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton onClick={() => navigateToSettings()} tooltip="Settings">
							<SettingsIcon className="size-4" />
							<span>Settings</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

export default AppSidebar
