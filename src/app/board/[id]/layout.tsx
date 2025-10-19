import { DesktopNavbar } from "./components";
import "./styles.css"

export default function Layout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100dvh"}}>
            <DesktopNavbar />
            {children}
            
        </div>
    )
}