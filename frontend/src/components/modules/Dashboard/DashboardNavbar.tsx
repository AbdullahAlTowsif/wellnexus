import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getUserInfo } from "@/services/auth.services"
import DashboardNavbarContent from "./DashboardNavbarContent"
import { NavSection } from "@/types/dashboard.types"
import { getNavItemsByRole } from "@/lib/navItems"

const DashboardNavbar = async () => {
    const userInfo = await getUserInfo()
    const navItems: NavSection[] = getNavItemsByRole(userInfo.role)

    const dashboardHome = getDefaultDashboardRoute(userInfo.role)
    return (
        <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
    )
}

export default DashboardNavbar;
