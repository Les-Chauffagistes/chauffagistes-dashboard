import { DesktopNavbar } from "../components/DesktopNavbar";
import MobileNavbar from "../components/MobileNavbar";

export default function Layout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100dvh", backgroundColor: "var(--background)"}}>
            <DesktopNavbar />
            {children}
            <MobileNavbar />
        </div>
    )
}